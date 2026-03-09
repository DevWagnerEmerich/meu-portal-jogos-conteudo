import EventBus from '../core/EventBus.js';
import { ACHIEVEMENTS_DATA } from '../services/AchievementSystem.js';

class ToastManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);

        EventBus.on('achievement:unlocked', achId => {
            const ach = ACHIEVEMENTS_DATA.find(a => a.id === achId);
            if (ach) this.showToast(ach);
        });
    }

    showToast(ach) {
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.innerHTML = `
            <div class="tm-icon">${ach.icon}</div>
            <div class="tm-info">
                <h4>Conquista Desbloqueada!</h4>
                <p>${ach.name}</p>
            </div>
        `;
        this.container.appendChild(toast);

        // Slide in
        requestAnimationFrame(() => toast.style.transform = 'translateY(0)');

        // Play sound if available
        import('./gamificationSoundHelper.js').then(module => module.playAchievementSound()).catch(() => { });

        setTimeout(() => {
            toast.style.transform = 'translateY(-150%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

export default new ToastManager();
