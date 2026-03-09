import EventBus from '../core/EventBus.js';
import ProgressService from './ProgressService.js';
import AuthService from './AuthService.js';
import { ShopItems } from '../data/ShopItems.js';

class GamificationService {
    #data = {
        coins: 0,
        inventory: [],
        equipped: { avatar: 'avatar_blue', background: 'bg_dark', title: 'title_rookie' },
        achievements: []
    };

    async init() {
        EventBus.on('auth:stateChanged', user => {
            if (user) {
                this.loadUserData(user.uid);
            } else {
                this.loadUserData(null);
            }
        });

        // Load initially for guest
        if (!AuthService.user) {
            await this.loadUserData(null);
        }

        // Apply equipped styles globally
        this.applyEquippedStyles();
    }

    async loadUserData(uid) {
        this.#data = await ProgressService.loadGamification(uid);
        EventBus.emit('gamification:loaded', this.#data);
        this.applyEquippedStyles();
    }

    async saveData() {
        const uid = AuthService.user ? AuthService.user.uid : null;
        await ProgressService.saveGamification(uid, this.#data);
        EventBus.emit('gamification:updated', this.#data);
    }

    // --- Economy ---

    addCoins(amount) {
        if (amount <= 0) return;
        this.#data.coins += amount;
        this.saveData();
    }

    spendCoins(amount) {
        if (this.#data.coins >= amount) {
            this.#data.coins -= amount;
            this.saveData();
            return true;
        }
        return false;
    }

    // --- Shop & Inventory ---

    isOwned(itemId) {
        return this.#data.inventory.includes(itemId);
    }

    buyItem(itemId) {
        if (this.isOwned(itemId)) return false;

        const item = ShopItems.find(i => i.id === itemId);
        if (!item) return false;

        if (this.spendCoins(item.price)) {
            this.#data.inventory.push(itemId);
            this.saveData();
            return true;
        }
        return false;
    }

    equipItem(itemId) {
        if (!this.isOwned(itemId)) return false;

        const item = ShopItems.find(i => i.id === itemId);
        if (!item) return false;

        this.#data.equipped[item.type] = itemId;
        this.saveData();
        this.applyEquippedStyles();
        return true;
    }

    // --- Dynamic CSS Application ---

    applyEquippedStyles() {
        const root = document.documentElement;

        // Reset previous gamification styles to prevent bleeding
        root.style.removeProperty('--robot-primary');
        root.style.removeProperty('--robot-secondary');
        root.style.removeProperty('--app-bg');
        root.style.removeProperty('--app-bg-img');

        // Avatar Style
        const avatarItem = ShopItems.find(i => i.id === this.#data.equipped.avatar);
        if (avatarItem && avatarItem.style) {
            Object.entries(avatarItem.style).forEach(([key, val]) => {
                root.style.setProperty(key, val);
            });
        }

        // Background Style
        const bgItem = ShopItems.find(i => i.id === this.#data.equipped.background);
        if (bgItem && bgItem.style) {
            Object.entries(bgItem.style).forEach(([key, val]) => {
                root.style.setProperty(key, val);
            });
        }

        // Toggle Canvas Background Effects
        if (window.appSetBgMode) {
            window.appSetBgMode(this.#data.equipped.background);
        }
    }

    // --- Achievements ---

    unlockAchievement(achId) {
        if (!this.#data.achievements.includes(achId)) {
            this.#data.achievements.push(achId);
            this.saveData();
            EventBus.emit('achievement:unlocked', achId);
            return true;
        }
        return false;
    }

    getData() {
        return this.#data;
    }
}

export default new GamificationService();
