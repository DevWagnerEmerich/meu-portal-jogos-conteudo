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

            const actionHtml = (item.type === 'special' && isOwned)
                ? `<button class="btn-shop owned" disabled>Adquirido</button>`
                : isEquipped
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
                    this.showConfirm('Confirmar Compra', `Deseja comprar este item por 🟡 ${price.toLocaleString('pt-BR')}?`, () => {
                        SoundEngine.ok();
                        GamificationService.buyItem(id);
                        this.renderGrid(type);
                    });
                } else {
                    this.showAlert('Saldo Insuficiente', `Você precisa de 🟡 ${price.toLocaleString('pt-BR')} moedas.`);
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
            ? `<div class="si-status esgotado" style="color:var(--ouro); font-weight:900; background:rgba(255,215,0,0.1); padding:10px; border-radius:8px; border:2px solid var(--ouro); text-align:center">🔥 ESGOTADO!</div>`
            : `
                <button class="btn-shop buy btn-custom-pay" style="width:100%; padding:12px; margin:0; font-size:1rem">💳 Contribuir Agora</button>
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
                    this.showAlert('Saldo Insuficiente', 'Você não tem moedas suficientes para esta contribuição.');
                }
            });
        });

        card.querySelector('.btn-custom-pay')?.addEventListener('click', () => {
            this.showContributionModal(item);
        });

        grid.appendChild(card);
    }

    showContributionModal(item) {
        const communityData = CommunityService.getData();
        const goal = item.price || 1000000;
        const paid = communityData.total_paid || 0;
        const remaining = Math.max(0, goal - paid);
        const playerCoins = GamificationService.getData().coins;

        const overlay = document.createElement('div');
        overlay.className = 'overlay-nome on'; // Reusing standard overlay styles
        overlay.style.zIndex = '2000';
        overlay.innerHTML = `
            <div class="modal-nome" style="max-width:320px">
                <h3 style="margin-top:0; color:var(--ouro)">💰 Contribuir</h3>
                <p style="font-size:0.85rem; margin-bottom:15px; opacity:0.8">
                    Quanto deseja doar para <b>${item.name}</b>?<br>
                    <small>Seu saldo: 🟡 ${playerCoins.toLocaleString('pt-BR')}</small>
                </p>
                <input type="number" id="inputContrib" placeholder="Ex: 5000" 
                    style="width:100%; padding:12px; background:rgba(0,0,0,0.3); border:1px solid var(--ouro); color:#fff; border-radius:8px; margin-bottom:15px">
                <div style="display:flex; gap:10px">
                    <button class="btn-jback" id="btnCancelContrib" style="flex:1">Cancelar</button>
                    <button class="btn-gami" id="btnConfirmContrib" style="flex:2; padding:10px">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const input = overlay.querySelector('#inputContrib');
        input.focus();

        const close = () => overlay.remove();

        overlay.querySelector('#btnCancelContrib').onclick = close;
        overlay.querySelector('#btnConfirmContrib').onclick = async () => {
            const val = parseInt(input.value, 10);
            if (isNaN(val) || val <= 0) {
                this.showAlert('Atenção', 'Digite um valor válido!');
                return;
            }
            if (val > playerCoins) {
                this.showAlert('Saldo Insuficiente', `Você precisa de 🟡 ${val.toLocaleString('pt-BR')} moedas, mas tem apenas 🟡 ${playerCoins.toLocaleString('pt-BR')}.`);
                return;
            }
            if (val > remaining) {
                this.showAlert('Limite Excedido', `O valor máximo necessário para completar a meta é 🟡 ${remaining.toLocaleString('pt-BR')}.`);
                input.value = remaining;
                return;
            }

            if (GamificationService.spendCoins(val)) {
                SoundEngine.ok();
                const playerName = AuthService.player.nome || 'Anônimo';
                await CommunityService.contribute(AuthService.player.uid, playerName, val);
                close();
                this.showAlert('Sucesso!', 'Sua contribuição foi registrada. Obrigado!');
            }
        };

        input.onkeydown = (e) => { if (e.key === 'Enter') overlay.querySelector('#btnConfirmContrib').onclick(); };
    }

    showAlert(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay-nome on';
        overlay.style.zIndex = '3000';
        overlay.innerHTML = `
            <div class="modal-nome" style="max-width:300px; text-align:center">
                <h3 style="margin-top:0; color:var(--ouro)">${title}</h3>
                <p style="font-size:0.9rem; margin-bottom:20px; opacity:0.9">${message}</p>
                <button class="btn-gami" style="width:100%; padding:10px" onclick="this.closest('.overlay-nome').remove()">OK</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showConfirm(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay-nome on';
        overlay.style.zIndex = '3000';
        overlay.innerHTML = `
            <div class="modal-nome" style="max-width:300px; text-align:center">
                <h3 style="margin-top:0; color:var(--ouro)">${title}</h3>
                <p style="font-size:0.9rem; margin-bottom:20px; opacity:0.9">${message}</p>
                <div style="display:flex; gap:10px">
                    <button class="btn-jback" style="flex:1" onclick="this.closest('.overlay-nome').remove()">Não</button>
                    <button class="btn-gami" id="btnConf" style="flex:1; padding:10px">Sim</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#btnConf').onclick = () => {
            overlay.remove();
            onConfirm();
        };
    }
}

export default new ShopView();
