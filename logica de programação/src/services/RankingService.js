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
    #collection = 'ranking';
    #limit = 50;

    /** Initialize with Firestore instance */
    init(firestoreDb) {
        this.#db = firestoreDb;
    }

    /**
     * Subscribe to real-time ranking updates.
     * Callback receives array of rank entries sorted by pts desc.
     * @param {Function} callback
     */
    async subscribeGlobal(callback) {
        if (!this.#db) {
            // Offline fallback
            callback(this.#loadLocal());
            return;
        }
        try {
            const { collection, query, orderBy, limit, onSnapshot } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

            const q = query(
                collection(this.#db, this.#collection),
                orderBy('pts', 'desc'),
                limit(this.#limit)
            );

            this.#unsubscribe = onSnapshot(q, snapshot => {
                const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(entries);
                EventBus.emit('ranking:updated', { entries });
            }, err => {
                console.error('[RankingService] onSnapshot error:', err);
                callback(this.#loadLocal());
            });
        } catch (err) {
            console.error('[RankingService] subscribe failed:', err);
            callback(this.#loadLocal());
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
            await setDoc(doc(this.#db, this.#collection, userId), enriched, { merge: true });
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

    #loadLocal() {
        try {
            return JSON.parse(localStorage.getItem(this.#localKey) || '[]');
        } catch { return []; }
    }

    #saveLocalEntry(userId, entry) {
        const all = this.#loadLocal();
        const idx = all.findIndex(r => r.id === userId || r.nome === entry.nome);
        if (idx >= 0) all[idx] = { id: userId, ...entry };
        else all.push({ id: userId, ...entry });
        all.sort((a, b) => b.pts - a.pts);
        if (all.length > 50) all.length = 50;
        localStorage.setItem(this.#localKey, JSON.stringify(all));
    }

    clearLocal() {
        localStorage.removeItem(this.#localKey);
    }
}

export default new RankingService();
