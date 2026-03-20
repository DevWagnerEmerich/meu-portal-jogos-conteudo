/**
 * RankingService — Firestore real-time ranking
 *
 * OOP Paradigms:
 * - Encapsulation: private db, unsubscribe handle
 * - Single Responsibility: only ranking persistence
 *
 * Falls back to localStorage if Firebase is not configured.
 */
import EventBus from '../core/EventBus.js';

class RankingService {
    #db = null;  // Firestore instance
    #unsubscribe = null;
    #localKey = 'cc_rank';
    #collection = 'ranking_v2';
    #limit = 50;

    /** Initialize with Firestore instance */
    init(firestoreDb) {
        this.#db = firestoreDb;
    }

    /**
     * Subscribe to real-time ranking updates.
     * Callback receives array of rank entries sorted by pts desc.
     * @param {Function} callback
     * @param {string} langMode - 'global' or language key ('visualg', 'python', 'js')
     */
    async subscribeGlobal(callback, langMode = 'global') {
        if (!this.#db) {
            // Offline fallback
            callback(this.#loadLocal(langMode), langMode);
            return;
        }
        try {
            const { collection, query, orderBy, limit, onSnapshot } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

            const sortField = langMode === 'global' ? 'pts' : `pts_${langMode}`;

            const q = query(
                collection(this.#db, this.#collection),
                orderBy(sortField, 'desc'),
                limit(this.#limit)
            );

            this.#unsubscribe = onSnapshot(q, snapshot => {
                const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Fire callback with the active langMode attached for context
                callback(entries, langMode);
                EventBus.emit('ranking:updated', { entries, langMode });
            }, err => {
                console.error('[RankingService] onSnapshot error:', err);
                callback(this.#loadLocal(langMode), langMode);
            });
        } catch (err) {
            console.error('[RankingService] subscribe failed:', err);
            callback(this.#loadLocal(langMode), langMode);
        }
    }

    /**
     * Update player's ranking entry.
     * @param {string} userId
     * @param {object} entry — { nome, avatar, pts, estrelas, questoes, langProgress }
     */
    async updateEntry(userId, entry) {
        const enriched = {
            ...entry,
            updatedAt: new Date().toISOString(),
        };

        // Always save locally as cache
        this.#saveLocalEntry(userId, enriched);

        if (!this.#db) return;

        try {
            const { doc, setDoc } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await setDoc(doc(this.#db, this.#collection, String(userId)), enriched, { merge: true });
        } catch (err) {
            console.error('[RankingService] updateEntry failed:', err);
        }
    }

    /** Get top N entries once (non-realtime) — used for initial load */
    async getTopN(n = 20) {
        if (!this.#db) return this.#loadLocal().slice(0, n);
        try {
            const { collection, query, orderBy, limit, getDocs } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            const q = query(
                collection(this.#db, this.#collection),
                orderBy('pts', 'desc'),
                limit(n)
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch {
            return this.#loadLocal().slice(0, n);
        }
    }

    /** Unsubscribe from real-time updates */
    unsubscribe() {
        this.#unsubscribe?.();
        this.#unsubscribe = null;
    }

    // ── Local (localStorage) fallback ──────────────────────────

    #loadLocal(langMode = 'global') {
        try {
            const all = JSON.parse(localStorage.getItem(this.#localKey) || '[]');
            const sortField = langMode === 'global' ? 'pts' : `pts_${langMode}`;
            return all.sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0));
        } catch { return []; }
    }

    #saveLocalEntry(userId, entry) {
        let all = JSON.parse(localStorage.getItem(this.#localKey) || '[]');
        const idx = all.findIndex(r => r.id === userId || r.nome === entry.nome);
        if (idx >= 0) all[idx] = { id: userId, ...entry };
        else all.push({ id: userId, ...entry });

        // We only prune based on total pts to keep stable storage map
        all.sort((a, b) => (b.pts || 0) - (a.pts || 0));
        if (all.length > 50) all.length = 50;
        localStorage.setItem(this.#localKey, JSON.stringify(all));
    }

    clearLocal() {
        localStorage.removeItem(this.#localKey);
    }
}

export default new RankingService();
