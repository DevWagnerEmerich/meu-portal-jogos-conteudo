import EventBus from '../core/EventBus.js';
import GameEngine, { GameState } from '../core/GameEngine.js';
import GamificationService from '../services/GamificationService.js';
import { ACHIEVEMENTS_DATA } from '../services/AchievementSystem.js';

class AchievementsView {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'achievements-view';
        this.container.className = 'view';
        this.container.innerHTML = `
            <div class="shop-header">
                <button class="btn-jback" id="achBtnBack">← Voltar</button>
                <h2 style="margin:0;font-size:1.8rem;display:flex;align-items:center;gap:15px;color:var(--fg);">🏆 Suas Conquistas</h2>
                <div class="wallet-badge" style="border-color:var(--primary);color:var(--primary);background:rgba(49,130,206,0.1)">
                    🏆 <span id="achvCount">0/0</span>
                </div>
            </div>
            <div class="shop-grid" id="achGrid"></div>
        `;

        document.body.appendChild(this.container);

        this.container.querySelector('#achBtnBack').addEventListener('click', () => {
            GameEngine.transition(GameState.MENU);
        });

        EventBus.on('state:change', ({ to }) => {
            if (to === GameState.ACHIEVEMENTS) {
                this.show();
            }
        });

        EventBus.on('achievement:unlocked', () => this.refreshUI());
        EventBus.on('gamification:loaded', () => this.refreshUI());
    }

    show() {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('ativa'));
        this.container.classList.add('ativa');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.refreshUI();
    }

    refreshUI() {
        if (!this.container.classList.contains('ativa')) return;

        const data = GamificationService.getData();
        const grid = this.container.querySelector('#achGrid');
        grid.innerHTML = '';

        let earnedCount = 0;

        ACHIEVEMENTS_DATA.forEach(ach => {
            const isUnlocked = data.achievements.includes(ach.id);
            if (isUnlocked) earnedCount++;

            const card = document.createElement('div');
            card.className = `shop-item ${isUnlocked ? 'equipped' : ''}`;
            card.style.filter = isUnlocked ? 'none' : 'grayscale(1) opacity(0.4)';

            card.innerHTML = `
                <div class="si-icon">${ach.icon}</div>
                <div class="si-info">
                    <h4>${ach.name}</h4>
                    <p>${isUnlocked ? ach.desc : '???'}</p>
                </div>
                <div class="si-actions">
                    ${isUnlocked
                    ? '<span style="color:var(--primary);font-weight:700;font-size:0.8rem">DESBLOQUEADO ✔</span>'
                    : '<span style="color:var(--muted);font-weight:700;font-size:0.8rem">BLOQUEADO 🔒</span>'}
                </div>
            `;
            grid.appendChild(card);
        });

        this.container.querySelector('#achvCount').textContent = `${earnedCount}/${ACHIEVEMENTS_DATA.length}`;
    }
}

export default new AchievementsView();
