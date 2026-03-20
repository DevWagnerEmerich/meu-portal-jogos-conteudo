/**
 * CommunityService — Manages global collective goals (e.g., movies, events)
 *
 * This service handles real-time synchronization of shared purchase goals.
 */
import EventBus from '../core/EventBus.js';

class CommunityService {
    #db = null;
    #collection = 'shop_v2';
    #docId = 'community';
    #unsubscribe = null;
    #data = {
        total_paid: 0,
        goal: 1000000,
        last_contributor: 'Ninguém ainda'
    };

    init(firestoreDb) {
        this.#db = firestoreDb;
    }

    /**
     * Subscribe to collective goal updates.
     * @param {Function} callback
     */
    async subscribe(callback) {
        if (!this.#db) return;

        try {
            const { doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            
            this.#unsubscribe = onSnapshot(doc(this.#db, this.#collection, this.#docId), (snap) => {
                if (snap.exists()) {
                    this.#data = snap.data();
                    callback(this.#data);
                    EventBus.emit('community:updated', this.#data);
                } else {
                    // Initialize if not exists
                    this.#createInitialDoc();
                }
            }, err => {
                console.error('[CommunityService] Subscription error:', err);
            });
        } catch (err) {
            console.error('[CommunityService] Init failed:', err);
        }
    }

    async #createInitialDoc() {
        if (!this.#db) return;
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await setDoc(doc(this.#db, this.#collection, this.#docId), this.#data);
        } catch (err) {
            console.error('[CommunityService] Create error:', err);
        }
    }

    /**
     * Contribute to the global goal.
     * @param {string} uid
     * @param {string} userName
     * @param {number} amount
     */
    async contribute(uid, userName, amount) {
        if (!this.#db || amount <= 0) return;

        try {
            const { doc, runTransaction, increment } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            
            await runTransaction(this.#db, async (transaction) => {
                const communityDoc = doc(this.#db, this.#collection, this.#docId);
                const snap = await transaction.get(communityDoc);
                
                if (!snap.exists()) {
                    transaction.set(communityDoc, { 
                        total_paid: amount, 
                        goal: 1000000, 
                        last_contributor: userName 
                    });
                } else {
                    transaction.update(communityDoc, {
                        total_paid: increment(amount),
                        last_contributor: userName
                    });
                }
            });
            console.info(`[CommunityService] ${userName} contributed ${amount} coins.`);
        } catch (err) {
            console.error('[CommunityService] Contribution failed:', err);
            throw err;
        }
    }

    getData() {
        return this.#data;
    }

    unsubscribe() {
        this.#unsubscribe?.();
    }
}

export default new CommunityService();
