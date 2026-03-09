/**
 * Player — Represents a game player / user
 *
 * OOP Paradigms:
 * - Encapsulation: private progress map
 * - Computed properties: stars, totalPts
 */
import EventBus from '../core/EventBus.js';

export class Player {
    #uid;
    #nome;
    #email;
    #avatar;
    #progress = new Map();  // key: "lang:qid" → { concluida, stars, pts, tempo }
    #streak = 0;
    #lastPlayDate = null;

    constructor({ uid = null, nome = '', email = '', avatar = '👤' } = {}) {
        this.#uid = uid;
        this.#nome = nome;
        this.#email = email;
        this.#avatar = avatar;
    }

    get uid() { return this.#uid; }
    get nome() { return this.#nome; }
    get email() { return this.#email; }
    get avatar() { return this.#avatar; }
    get streak() { return this.#streak; }
    get isGuest() { return this.#uid === null; }

    setProfile({ uid, nome, email, avatar }) {
        if (uid) this.#uid = uid;
        if (nome) this.#nome = nome;
        if (email) this.#email = email;
        if (avatar) this.#avatar = avatar;
        EventBus.emit('player:profileUpdated', this.toPublic());
    }

    /** Load progress from Firestore/localStorage snapshot */
    loadProgress(rawMap) {
        this.#progress = new Map(Object.entries(rawMap));
        EventBus.emit('player:progressLoaded', {});
    }

    /** Record completion of a question */
    recordProgress(lang, qId, { stars, pts, tempo }) {
        const key = `${lang}:${qId}`;
        const existing = this.#progress.get(key);
        // Only update if better score
        if (!existing?.concluida || stars > (existing.stars ?? 0)) {
            this.#progress.set(key, { concluida: true, stars, pts, tempo });
            EventBus.emit('player:progressUpdated', { key, stars, pts });
        }
        this.#updateStreak();
        return this.#progress.get(key);
    }

    getProgress(lang, qId) {
        return this.#progress.get(`${lang}:${qId}`) ?? null;
    }

    get progressMap() {
        return new Map(this.#progress);  // defensive copy
    }

    /** Total completed questions for a language */
    totalConc(lang) {
        let count = 0;
        for (const [key, val] of this.#progress) {
            if (key.startsWith(lang + ':') && val?.concluida) count++;
        }
        return count;
    }

    /** Total stars for a language */
    totalStars(lang) {
        let stars = 0;
        for (const [key, val] of this.#progress) {
            if (key.startsWith(lang + ':')) stars += (val?.stars ?? 0);
        }
        return stars;
    }

    /** Total XP across all languages */
    get totalPts() {
        let pts = 0;
        for (const val of this.#progress.values()) pts += (val?.pts ?? 0);
        return pts;
    }

    /** Total stars across all languages */
    get totalAllStars() {
        let s = 0;
        for (const val of this.#progress.values()) s += (val?.stars ?? 0);
        return s;
    }

    /** Progress serialized for persistence */
    serializeProgress() {
        return Object.fromEntries(this.#progress);
    }

    /** Serialized public data for ranking */
    toPublic() {
        return {
            uid: this.#uid,
            nome: this.#nome,
            avatar: this.#avatar,
            pts: this.totalPts,
            estrelas: this.totalAllStars,
            questoes: ['visualg', 'python', 'js'].reduce((s, l) => s + this.totalConc(l), 0),
        };
    }

    #updateStreak() {
        const today = new Date().toDateString();
        if (this.#lastPlayDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            this.#streak = (this.#lastPlayDate === yesterday) ? this.#streak + 1 : 1;
            this.#lastPlayDate = today;
        }
    }
}
