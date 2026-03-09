import EventBus from '../core/EventBus.js';
import GameEngine, { GameState } from '../core/GameEngine.js';
import GamificationService from '../services/GamificationService.js';
import { ShopItems } from '../data/ShopItems.js';
import SoundEngine from '../services/SoundEngine.js';

class ShopView {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'shop-view';
        this.container.className = 'view';
        this.container.innerHTML = `
            <div class="shop-header">
                <button class="btn-jback" id="shopBtnBack">← Voltar</button>
                <h2 style="margin:0;font-size:1.8rem;display:flex;align-items:center;gap:15px;color:var(--fg);">🛒 Loja de Cosméticos</h2>
                <div class="wallet-badge">🟡 <span id="shopWalletBalance">0</span> Coins</div>
            </div>
            <div class="shop-categories">
                <button class="cat-btn ativo" data-type="avatar">Robôs</button>
                <button class="cat-btn" data-type="background">Temas</button>
                <button class="cat-btn" data-type="title">Títulos</button>
            </div>
            <div class="shop-grid" id="shopGrid"></div>
        `;

        document.body.appendChild(this.container);

        this.container.querySelector('#shopBtnBack').addEventListener('click', () => {
            GameEngine.transition(GameState.MENU);
        });

        this.container.querySelectorAll('.shop-categories .cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.container.querySelectorAll('.shop-categories .cat-btn').forEach(b => b.classList.remove('ativo'));
                btn.classList.add('ativo');
                this.renderGrid(btn.dataset.type);
            });
        });

        EventBus.on('state:change', ({ to }) => {
            if (to === GameState.SHOP) {
                this.show();
            }
        });

        EventBus.on('gamification:loaded', () => this.refreshUI());
        EventBus.on('gamification:updated', () => this.refreshUI());
    }

    show() {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('ativa'));
        this.container.classList.add('ativa');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.refreshUI();
        this.renderGrid('avatar'); // Default category
    }

    refreshUI() {
        if (!this.container.classList.contains('ativa')) return;
        const data = GamificationService.getData();
        this.container.querySelector('#shopWalletBalance').textContent = data.coins;
    }

    renderGrid(type) {
        const grid = this.container.querySelector('#shopGrid');
        grid.innerHTML = '';

        const data = GamificationService.getData();
        const items = ShopItems.filter(i => i.type === type);

        items.forEach(item => {
            const isOwned = data.inventory.includes(item.id);
            const isEquipped = data.equipped[type] === item.id;

            const card = document.createElement('div');
            card.className = `shop-item ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`;

            const actionHtml = isEquipped
                ? `<button class="btn-shop equipped" disabled>Equipado</button>`
                : isOwned
                    ? `<button class="btn-shop equip" data-id="${item.id}">Equipar</button>`
                    : `<button class="btn-shop buy" data-id="${item.id}" data-price="${item.price}">🟡 ${item.price}</button>`;

            card.innerHTML = `
                <div class="si-icon">${item.icon}</div>
                <div class="si-info">
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                </div>
                <div class="si-actions">
                    ${actionHtml}
                </div>
            `;

            grid.appendChild(card);
        });

        // Bind events
        grid.querySelectorAll('.btn-shop.buy').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const price = parseInt(btn.dataset.price, 10);
                if (GamificationService.getData().coins >= price) {
                    if (confirm(`Comprar este item por ${price} Coins?`)) {
                        SoundEngine.drag(); // Or a custom buy sound
                        GamificationService.buyItem(id);
                        this.renderGrid(type);
                    }
                } else {
                    alert('Moedas insuficientes!');
                }
            });
        });

        grid.querySelectorAll('.btn-shop.equip').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                GamificationService.equipItem(id);
                SoundEngine.ok();
                this.renderGrid(type);
            });
        });
    }
}

export default new ShopView();
