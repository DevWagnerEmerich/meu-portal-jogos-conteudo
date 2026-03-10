/**
 * app.js — Application Bootstrap / Dependency Injection Container
 *
 * OOP Paradigms:
 * - Composition Root: wires all services and controllers together
 * - Facade: single initialization point
 */
import { firebaseConfig, FIREBASE_CONFIGURED } from '../firebase-config.js';
import EventBus from './core/EventBus.js';
import GameEngine, { GameState } from './core/GameEngine.js';
import StateManager from './core/StateManager.js';
import AuthService from './services/AuthService.js';
import RankingService from './services/RankingService.js';
import ProgressService from './services/ProgressService.js';
import SoundEngine from './services/SoundEngine.js';
import GameController from './controllers/GameController.js';
import QuestionBank from './data/QuestionBank.js';
import { LANG_META, LANGS } from './data/LanguageMeta.js';
import SyntaxHighlighter from './ui/SyntaxHighlighter.js';
import DragDropController from './controllers/DragDropController.js';
import GamificationService from './services/GamificationService.js';
import AchievementSystem from './services/AchievementSystem.js';
import ToastManager from './ui/ToastManager.js'; // Toasts initialize automatically on import
import ShopView from './ui/ShopView.js'; // View initializes and registers its EventBus
import AchievementsView from './ui/AchievementsView.js'; // View initializes and registers its EventBus

// ── Firebase Initialization ──────────────────────────────────
async function initFirebase() {
    if (!FIREBASE_CONFIGURED) {
        console.info('[App] Firebase not configured — running in offline mode.');
        return;
    }
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        AuthService.init(auth);
        RankingService.init(db);
        ProgressService.init(db);

        console.info('[App] Firebase initialized.');
    } catch (err) {
        console.error('[App] Firebase init failed:', err);
    }
}

// ── UI Rendering ──────────────────────────────────────────────

/** Format seconds as M:SS */
function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// Confetti
function boom(modal, langCor) {
    modal.querySelectorAll('.confete').forEach(c => c.remove());
    const cores = [langCor, '#FFD700', '#FF6B6B', '#C792EA', '#00E5CC', '#FF6B9D'];
    for (let i = 0; i < 70; i++) {
        const c = document.createElement('div');
        c.className = 'confete';
        c.style.cssText = `left:${Math.random() * 100}%;top:-20px;background:${cores[~~(Math.random() * cores.length)]};animation-duration:${1.5 + Math.random() * 2.5}s;animation-delay:${Math.random() * 1.5}s;width:${4 + Math.random() * 8}px;height:${8 + Math.random() * 10}px;transform:rotate(${Math.random() * 360}deg);border-radius:${Math.random() > .5 ? '50%' : '2px'};`;
        modal.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
}

// ── View Renderers ────────────────────────────────────────────

function renderLangPick() {
    LANGS.forEach(lang => {
        const meta = LANG_META[lang];
        const player = AuthService.player;
        const totalQ = QuestionBank.totalCount;
        const conc = player.totalConc(lang);
        const stars = player.totalStars(lang);
        const pct = totalQ ? Math.round(conc / totalQ * 100) : 0;

        const starsEl = document.getElementById(`${lang}-stars`);
        const progEl = document.getElementById(`${lang}-prog`);
        const statsEl = document.getElementById(`${lang}-stats`);

        if (starsEl) starsEl.textContent = stars > 0 ? '★'.repeat(Math.min(stars, 5)) : '○○○';
        if (progEl) progEl.style.width = pct + '%';
        if (statsEl) statsEl.textContent = `${conc}/${totalQ} questões concluídas`;
    });
}

function renderMenu() {
    const lang = StateManager.lang;
    if (!lang) return;
    const meta = LANG_META[lang];
    const player = AuthService.player;
    const progMap = player.progressMap;

    document.getElementById('activeLangBadge').innerHTML =
        `<span style="color:${meta.cor};font-weight:900">● ${meta.nome}</span>`;
    document.getElementById('menuHeroTitle').textContent = `${meta.nome} — Code Chain`;
    document.getElementById('menuHeroSub').textContent = `Ordene as linhas e aprenda ${meta.nome} do zero ao avançado!`;

    const totalQ = QuestionBank.totalCount;
    const conc = player.totalConc(lang);
    const stars = player.totalStars(lang);
    const pts = (() => { let p = 0; for (const [k, v] of progMap) if (k.startsWith(lang + ':')) p += (v.pts || 0); return p; })();

    document.getElementById('statsStrip').innerHTML = `
    <div class="stat-pill"><span class="sv" style="color:${meta.cor}">${conc}/${totalQ}</span><span class="sl">Questões</span></div>
    <div class="stat-pill"><span class="sv" style="color:var(--ouro)">${stars}</span><span class="sl">Estrelas</span></div>
    <div class="stat-pill"><span class="sv" style="color:var(--ouro)">${pts.toLocaleString('pt-BR')}</span><span class="sl">XP</span></div>
    <div class="stat-pill"><span class="sv">${player.nome || '?'}</span><span class="sl">Jogador</span></div>`;

    // Inject Gamification Menu Wrap
    let gamiMenu = document.getElementById('gamiMenuWrap');
    if (!gamiMenu) {
        gamiMenu = document.createElement('div');
        gamiMenu.id = 'gamiMenuWrap';
        gamiMenu.style.display = 'flex';
        gamiMenu.style.gap = '15px';
        gamiMenu.style.marginTop = '20px';
        gamiMenu.style.marginBottom = '10px';
        gamiMenu.style.justifyContent = 'center';
        gamiMenu.style.width = '100%';

        const btnShop = document.createElement('button');
        btnShop.className = 'btn-gami';
        btnShop.innerHTML = '🛒 Loja (Coins)';
        btnShop.onclick = () => GameEngine.transition(GameState.SHOP);

        const btnAch = document.createElement('button');
        btnAch.className = 'btn-gami';
        btnAch.innerHTML = '🏆 Conquistas';
        btnAch.onclick = () => GameEngine.transition(GameState.ACHIEVEMENTS);

        gamiMenu.appendChild(btnAch);
        gamiMenu.appendChild(btnShop);

        document.getElementById('statsStrip').after(gamiMenu);
    }

    renderModulos();
}

function renderModulos() {
    const lang = StateManager.lang;
    const cat = StateManager.catFilter;
    const meta = LANG_META[lang];
    const grid = document.getElementById('modulosGrid');
    const player = AuthService.player;
    const progMap = player.progressMap;
    const allMods = QuestionBank.getAll();

    grid.innerHTML = '';
    allMods.forEach((mod, mi) => {
        if (cat !== 'todos' && mod.cat !== cat) return;
        const { done, total, pct } = mod.computeProgress(lang, progMap);
        const locked = GameController.isModuleLocked(mi);

        const questoesHTML = mod.getAll().map((q, qi) => {
            const qLocked = GameController.isQuestionLocked(mi, qi);
            const prog = player.getProgress(lang, q.id);
            const conc = !!prog?.concluida;
            const st = prog?.stars ?? 0;
            const sStr = conc ? '★'.repeat(st) + '☆'.repeat(3 - st) : '○○○';
            const isNext = !conc && !qLocked && qi === done;
            return `<button class="q-card ${qLocked ? 'bloq' : ''} ${conc ? 'conc' : ''}" style="--lang-color:${meta.cor}" data-midx="${mi}" data-qid="${q.id}">
        ${isNext ? '<span class="qc-new">▶</span>' : ''}
        <span class="qc-num" style="color:${meta.cor}">${qi + 1}</span>
        <span class="qc-nome">${q.nome}</span>
        <span class="qc-stars">${sStr}</span>
      </button>`;
        }).join('');

        const el = document.createElement('div');
        el.className = 'modulo';
        el.style.cssText = `animation-delay:${mi * .06}s;border-top:3px solid ${mod.cor};${locked ? 'opacity:0.38' : ''}`;
        el.innerHTML = `
      <div class="mod-header">
        <div class="mod-ico">${mod.ico}</div>
        <div class="mod-info">
          <h3>${mod.nome}<span class="dif-tag ${mod.difClass}">${mod.difTag}</span></h3>
          <p>${total} questões • ${done} concluídas</p>
        </div>
        <div class="mod-prog">
          <div class="mod-prog-pct">${pct}%</div>
          <div class="mod-prog-bar"><div class="mod-prog-fill" style="width:${pct}%;background:${mod.cor}"></div></div>
        </div>
      </div>
      <div class="questoes-row">${questoesHTML}</div>`;
        grid.appendChild(el);
    });

    // Bind question card clicks
    grid.querySelectorAll('.q-card:not(.bloq)').forEach(btn => {
        btn.addEventListener('click', () => {
            GameController.startQuestion(+btn.dataset.midx, btn.dataset.qid);
        });
    });
}

function renderGameScreen() {
    const lang = StateManager.lang;
    const question = StateManager.question;
    const mod = StateManager.module;
    const meta = LANG_META[lang];
    const allMods = QuestionBank.getAll();
    const modIdx = QuestionBank.indexOfModule(mod);
    const qIdx = mod.indexOf(question);
    const totM = mod.count;

    document.getElementById('jProgFill').style.cssText = `width:${((qIdx + 1) / totM) * 100}%;background:linear-gradient(90deg,${meta.cor},${meta.cor}88)`;
    document.getElementById('jProgLbl').textContent = `${qIdx + 1}/${totM}`;

    const numEl = document.getElementById('qctxNum');
    numEl.textContent = qIdx + 1;
    numEl.style.cssText = `background:linear-gradient(135deg,${meta.cor}44,${meta.cor}22);color:${meta.cor};border:2px solid ${meta.cor}44`;

    document.getElementById('qctxBadge').textContent = `${mod.ico} ${mod.nome} • ${lang.toUpperCase()}`;
    document.getElementById('qctxNome').textContent = question.nome;
    document.getElementById('enunciado').innerHTML = question.enunciado;
    document.getElementById('dicaBox').style.display = 'none';
    document.getElementById('fbErro').style.display = 'none';

    renderCodeCards();
}

function renderCodeCards() {
    const lang = StateManager.lang;
    const order = StateManager.order;
    const question = StateManager.question;
    const meta = LANG_META[lang];
    const zona = document.getElementById('zonaCodigo');
    const lines = question.getLines(lang);

    zona.innerHTML = '';
    DragDropController.attach(zona);

    order.forEach((id, idx) => {
        const line = lines.find(l => l.id === id);
        const indent = '\u00a0\u00a0'.repeat(line.ind || 0); // non-breaking spaces for indent
        const hlCode = SyntaxHighlighter.highlight(line.code, lang);

        // Build card using DOM API to avoid template literal HTML escaping issues
        const card = document.createElement('div');
        card.className = 'code-card';
        card.style.setProperty('--lang-color', meta.cor);

        const lineNum = document.createElement('span');
        lineNum.className = 'cc-linenum';
        lineNum.textContent = idx + 1;

        const codeEl = document.createElement('code');
        codeEl.className = 'cc-code';
        // innerHTML is safe here — hlCode only contains our own controlled span tags
        codeEl.innerHTML = indent + hlCode;

        const drag = document.createElement('span');
        drag.className = 'cc-drag';
        drag.textContent = '⠿';

        card.dataset.lineid = id;   // ← DragDropController reads this for final order
        card.appendChild(lineNum);
        card.appendChild(codeEl);
        card.appendChild(drag);

        DragDropController.bindCard(card, idx);
        zona.appendChild(card);
    });

    document.getElementById('fbErro').style.display = 'none';
}


// ── View Switching ────────────────────────────────────────────
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('ativa'));
    document.getElementById(id)?.classList.add('ativa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Ranking Renderer ─────────────────────────────────────────
async function renderRanking(langMode = 'global') {
    const lista = document.getElementById('rkLista');
    const hdr = document.querySelector('.rk-title');

    hdr.textContent = langMode === 'global' ? '🏆 Ranking Global' : `🏆 Ranking - ${LANG_META[langMode]?.nome}`;

    lista.innerHTML = '<div class="rk-loading">⏳ Carregando ranking...</div>';

    await RankingService.subscribeGlobal((entries, activeLangMode) => {
        // Prevent race conditions showing wrong list if user backed out fast
        if (!document.getElementById('ranking').classList.contains('ativa')) return;

        if (!entries.length) {
            lista.innerHTML = '<div class="rk-vazio"><span>🏆</span>Nenhum score ainda!<br>Complete questões para aparecer aqui.</div>';
            return;
        }

        const isGlobal = activeLangMode === 'global';
        const med = ['🥇', '🥈', '🥉'];
        lista.innerHTML = entries.slice(0, 30).map((r, i) => {
            const displayPts = isGlobal ? (r.pts || 0) : (r[`pts_${activeLangMode}`] || 0);

            return `
      <div class="rk-item ${i < 3 ? 'r' + (i + 1) : ''}" style="animation-delay:${i * .05}s">
        <div class="rk-pos">${i + 1}º</div>
        <div class="rk-med">${med[i] || '🎖️'}</div>
        <div class="rk-info">
          <div class="rk-nome">${r.nome || 'Anônimo'}</div>
          <div class="rk-det">⭐${r.estrelas || 0} estrelas • 🎮${r.questoes || 0} questões</div>
        </div>
        <div class="rk-pts">${displayPts.toLocaleString('pt-BR')} XP</div>
      </div>`;
        }).join('');
    }, langMode);
}

// ── Game Events ───────────────────────────────────────────────
EventBus.on('state:change', ({ to, stars, pts, coins, langMode }) => {
    switch (to) {
        case GameState.LANG_PICK:
            renderLangPick();
            showView('lang-pick');
            break;
        case GameState.MENU:
            renderMenu();
            showView('menu');
            break;
        case GameState.GAME:
            renderGameScreen();
            showView('jogo');
            break;
        case GameState.RANKING:
            renderRanking(langMode);
            showView('ranking');
            break;
        case GameState.RESULT:
            showResult(stars, pts, coins);
            break;
    }
});

EventBus.on('game:renderCards', () => renderCodeCards());
EventBus.on('state:timerTick', ({ secs }) => {
    const el = document.getElementById('jTimerNum');
    if (el) {
        el.textContent = fmt(secs);
        el.className = 'j-timer-num' + (secs > 120 ? ' danger' : '');
    }
});

EventBus.on('game:hintShown', ({ hint }) => {
    const db = document.getElementById('dicaBox');
    if (db) { db.textContent = `💡 ${hint}`; db.style.display = 'block'; }
});

EventBus.on('game:wrong', () => {
    const fb = document.getElementById('fbErro');
    if (fb) {
        fb.style.display = 'block';
        fb.style.animation = 'none';
        void fb.offsetWidth;
        fb.style.animation = 'shake 0.4s ease';
    }
});

function showResult(stars, pts, coins) {
    SoundEngine.win ? SoundEngine.win() : null;
    const lang = StateManager.lang;
    const question = StateManager.question;
    const meta = LANG_META[lang];
    const emojis = ['🥉', '🥈', '🏆'];
    const msgs = [
        'Código correto! Você é um programador nato! 💻',
        'Perfeito! O compilador aprovou! ✅',
        'Sequência impecável! Continue codando! 🚀',
        'Incrível! Você entende lógica de verdade! 🧠',
        'Excelente! Algoritmo aprovado com louvor! 🏆',
    ];

    document.getElementById('celEmoji').textContent = emojis[stars - 1];
    const title = document.getElementById('celTitle');
    title.textContent = stars === 3 ? 'Código Perfeito! 🌟' : stars === 2 ? 'Muito bem! 2 Estrelas!' : 'Conseguiu! 1 Estrela!';
    title.style.color = meta.cor;
    document.getElementById('celMsg').textContent = msgs[~~(Math.random() * msgs.length)];
    document.getElementById('celStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('celTime').textContent = `⏱️ Tempo: ${fmt(StateManager.timerSecs)}`;

    // Create new element for coins if it doesn't exist yet, or just inject HTML over 'celPts'
    celPts.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:12px; align-items:center;">
            <span style="color:var(--ouro)">+${pts.toLocaleString('pt-BR')} XP</span>
            <span style="color:#F6E05E; background:rgba(255,215,0,0.1); padding:4px 12px; border-radius:12px; border:1px solid rgba(255,215,0,0.3); white-space:nowrap;">
                🟡 +${coins} Coins
            </span>
        </div>
    `;

    const order = question.getOrder(lang);
    const lines = question.getLines(lang);
    document.getElementById('celCodeHeader').textContent = `✅ Código correto (${meta.nome}):`;
    document.getElementById('celCodeBody').innerHTML = order.map((id, i) => {
        const l = lines.find(x => x.id === id);
        const indent = '  '.repeat(l.ind || 0);
        return `<div class="cp-line"><span class="cp-ln">${i + 1}</span><span class="cp-code">${indent}${SyntaxHighlighter.highlight(l.code, lang)}</span></div>`;
    }).join('');

    const allMods = QuestionBank.getAll();
    const mod = StateManager.module;
    const modIdx = QuestionBank.indexOfModule(mod);
    const qIdx = mod.indexOf(question);
    const hasNext = qIdx < mod.count - 1 || modIdx < allMods.length - 1;
    const btnNext = document.getElementById('btnNext');
    btnNext.style.cssText = hasNext ? '' : 'display:none';

    boom(document.getElementById('modalCel'), meta.cor);
    document.getElementById('overlay').classList.add('on');
}

// ── Auth Modal ────────────────────────────────────────────────
function showAuthModal() {
    document.getElementById('overlayNome')?.classList.add('on');
    setTimeout(() => document.getElementById('inputNome')?.focus(), 300);
}

EventBus.on('auth:loggedOut', () => {
    if (!AuthService.player.nome) showAuthModal();
});

EventBus.on('auth:loggedIn', () => {
    document.getElementById('overlayNome')?.classList.remove('on');
    renderLangPick();
});

// ── Global Onclick Bindings (legacy HTML onclick compatibility) ──
window.appGoLangPick = () => GameController.goToLangPick();
window.appGoMenu = () => GameController.goToMenu();
// In selection we want 'global', in menu we want the 'lang' specific board.
window.appGoRanking = () => GameController.goToRanking(document.getElementById('lang-pick').classList.contains('ativa') ? 'global' : StateManager.lang);
window.appChooseLang = (l) => GameController.chooseLang(l);
window.appVerify = () => GameController.verify();
window.appHint = () => GameController.showHint();
window.appShuffle = () => GameController.shuffle();
window.appNextQuestion = () => { document.getElementById('overlay').classList.remove('on'); GameController.nextQuestion(); };
window.appCatFilter = (btn) => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    GameController.setCatFilter(btn.dataset.cat);
    renderModulos();
};
window.appSaveName = () => {
    const v = document.getElementById('inputNome')?.value.trim();
    if (!v) return;
    AuthService.setGuestName(v);
    document.getElementById('overlayNome')?.classList.remove('on');
    renderLangPick();
};

document.getElementById('inputNome')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.appSaveName();
});
document.getElementById('overlay')?.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('on');
});

// ── INIT ─────────────────────────────────────────────────────
(async () => {
    await initFirebase();
    await GamificationService.init();
    AchievementSystem.init();

    // Load saved progress for guest/auth player
    const savedProg = localStorage.getItem('cc_prog');
    if (savedProg) {
        try { AuthService.player.loadProgress(JSON.parse(savedProg)); } catch { }
    }

    renderLangPick();
    if (!AuthService.player.nome) showAuthModal();
})();
