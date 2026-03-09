/**
 * ProgressService — Persists player progress to Firestore + localStorage
 *
 * OOP Paradigms:
 * - Encapsulation: private db
 * - Separation of concerns: only progress I/O
 */
import EventBus from '../core/EventBus.js';

class ProgressService {
    #db = null;
    #localKey = 'cc_prog';
    #localGamificationKey = 'cc_gami';

    init(firestoreDb) {
        this.#db = firestoreDb;
    }

    /**
     * Load all progress for a user.
     * @param {string} uid
     * @returns {object} flat map { "lang:qid": { concluida, stars, pts, tempo } }
     */
    async load(uid) {
        if (!uid || !this.#db) return this.#loadLocal();

        try {
            const { collection, getDocs } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

            const langs = ['visualg', 'python', 'js'];
            const result = {};

            for (const lang of langs) {
                const snap = await getDocs(
                    collection(this.#db, `progress/${uid}/languages/${lang}/questions`)
                );
                snap.docs.forEach(d => { result[`${lang}:${d.id}`] = d.data(); });
            }

            // Sync to local cache
            localStorage.setItem(this.#localKey, JSON.stringify(result));
            return result;
        } catch (err) {
            console.error('[ProgressService] load failed:', err);
            return this.#loadLocal();
        }
    }

    /**
     * Save a single question result.
     * @param {string} uid
     * @param {string} lang
     * @param {string} qId
     * @param {{ concluida, stars, pts, tempo }} data
     */
    async save(uid, lang, qId, data) {
        // Always save locally first
        const all = this.#loadLocal();
        all[`${lang}:${qId}`] = data;
        localStorage.setItem(this.#localKey, JSON.stringify(all));

        if (!uid || !this.#db) return;

        try {
            const { doc, setDoc } =
                await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await setDoc(
                doc(this.#db, `progress/${uid}/languages/${lang}/questions/${qId}`),
                data,
                { merge: true }
            );
            EventBus.emit('progress:saved', { lang, qId, data });
        } catch (err) {
            console.error('[ProgressService] save failed:', err);
        }
    }

    #loadLocal() {
        try {
            return JSON.parse(localStorage.getItem(this.#localKey) || '{}');
        } catch { return {}; }
    }

    // --- Gamification Sync ---

    async loadGamification(uid) {
        if (!uid || !this.#db) return this.#loadLocalGamification();

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            const snap = await getDoc(doc(this.#db, `progress/${uid}/gamification/profile`));

            if (snap.exists()) {
                const data = snap.data();
                localStorage.setItem(this.#localGamificationKey, JSON.stringify(data));
                return this.#ensureDefaults(data);
            }
            return this.#loadLocalGamification();
        } catch (err) {
            console.error('[ProgressService] loadGamification failed:', err);
            return this.#loadLocalGamification();
        }
    }

    async saveGamification(uid, data) {
        const fullData = this.#ensureDefaults(data);
        localStorage.setItem(this.#localGamificationKey, JSON.stringify(fullData));

        if (!uid || !this.#db) return;

        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await setDoc(doc(this.#db, `progress/${uid}/gamification/profile`), fullData, { merge: true });
            EventBus.emit('gamification:saved', fullData);
        } catch (err) {
            console.error('[ProgressService] saveGamification failed:', err);
        }
    }

    #loadLocalGamification() {
        try {
            const data = JSON.parse(localStorage.getItem(this.#localGamificationKey) || '{}');
            return this.#ensureDefaults(data);
        } catch {
            return this.#ensureDefaults({});
        }
    }

    #ensureDefaults(data) {
        return {
            coins: data.coins || 0,
            inventory: data.inventory || ['avatar_blue', 'bg_dark', 'title_rookie'],
            equipped: data.equipped || { avatar: 'avatar_blue', background: 'bg_dark', title: 'title_rookie' },
            achievements: data.achievements || []
        };
    }
}

export default new ProgressService();
