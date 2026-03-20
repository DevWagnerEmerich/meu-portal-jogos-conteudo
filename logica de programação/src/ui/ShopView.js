import EventBus from '../core/EventBus.js';
import GameEngine, { GameState } from '../core/GameEngine.js';
import GamificationService from '../services/GamificationService.js';
import { ShopItems } from '../data/ShopItems.js';
import SoundEngine from '../services/SoundEngine.js';
import CommunityService from '../services/CommunityService.js';

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
                <button class="cat-btn" data-type="special">Extras</button>
                <button class="cat-btn" data-type="community">🌍 Comunidade</button>
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
        
        // Subscribe to real-time community goal
        CommunityService.subscribe(() => {
            const activeTab = this.container.querySelector('.cat-btn.ativo')?.dataset.type;
            if (activeTab === 'community') this.renderGrid('community');
        });
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
            if (item.isCollective) {
                this.renderCommunityItem(grid, item);
                return;
            }

            const isOwned = data.inventory.includes(item.id);
            const isEquipped = data.equipped[type] === item.id;

            const card = document.createElement('div');
            card.className = `shop-item ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`;

            const actionHtml = isEquipped
                ? `<button class="btn-shop equipped" disabled>Equipado</button>`
                : isOwned
                    ? (item.type === 'special' || item.type === 'community'
                        ? `<button class="btn-shop owned" disabled>Adquirido</button>`
                        : `<button class="btn-shop equip" data-id="${item.id}">Equipar</button>`)
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

    renderCommunityItem(grid, item) {
        const communityData = CommunityService.getData();
        const goal = item.price || 1000000;
        const paid = communityData.total_paid || 0;
        const pct = Math.min(100, Math.floor((paid / goal) * 100));
        const remaining = Math.max(0, goal - paid);
        const isComplete = paid >= goal;

        const card = document.createElement('div');
        card.className = `shop-item collective ${isComplete ? 'complete' : ''}`;
        
        const actionHtml = isComplete 
            ? `<div class="si-complete-msg">🏆 Meta Atingida!</div>`
            : `
                <div class="si-contrib-btns">
                    <button class="btn-contrib" data-amt="1000">🪙 1k</button>
                    <button class="btn-contrib" data-amt="10000">🪙 10k</button>
                    <button class="btn-contrib" data-amt="${remaining}">💰 Pagar Restante</button>
                </div>
              `;

        card.innerHTML = `
            <div class="si-icon" style="border-radius:12px; overflow:hidden">
                <img src="${item.thumb}" style="width:100%; height:100%; object-fit:cover">
            </div>
            <div class="si-info">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <div class="si-progress-container">
                    <div class="si-progress-fill" style="width:${pct}%"></div>
                </div>
                <div class="si-progress-text">
                    <span>${pct}%</span>
                    <span>Meta: ${goal.toLocaleString('pt-BR')}</span>
                </div>
                <div class="si-last-contributor">
                    👤 Último a pagar: ${communityData.last_contributor}
                </div>
            </div>
            <div class="si-actions" style="flex-direction:column; gap:8px">
                ${actionHtml}
            </div>
        `;

        // Bind contribution clicks
        card.querySelectorAll('.btn-contrib').forEach(btn => {
            btn.addEventListener('click', async () => {
                const amount = parseInt(btn.dataset.amt, 10);
                if (GamificationService.spendCoins(amount)) {
                    SoundEngine.ok();
                    const playerName = AuthService.player.nome || 'Anônimo';
                    await CommunityService.contribute(AuthService.player.uid, playerName, amount);
                    // Subscription will trigger re-render
                } else {
                    alert('Moedas insuficientes!');
                }
            });
        });

        grid.appendChild(card);
    }
}

export default new ShopView();
