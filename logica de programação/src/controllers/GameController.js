/**
 * GameController — Orchestrates game logic and wires all services
 *
 * OOP Paradigms:
 * - Facade pattern: single-entry-point for game actions
 * - Encapsulation: private services and state references
 */
import EventBus from '../core/EventBus.js';
import GameEngine, { GameState } from '../core/GameEngine.js';
import StateManager from '../core/StateManager.js';
import QuestionBank from '../data/QuestionBank.js';
import { LANG_META } from '../data/LanguageMeta.js';
import AuthService from '../services/AuthService.js';
import RankingService from '../services/RankingService.js';
import ProgressService from '../services/ProgressService.js';
import SoundEngine from '../services/SoundEngine.js';
import DragDropController from './DragDropController.js';
import SyntaxHighlighter from '../ui/SyntaxHighlighter.js';
import GamificationService from '../services/GamificationService.js';

class GameController {
    #timerInterval = null;

    constructor() {
        // Wire drag-orderChanged event (emitted by DragDropController securely on dragend)
        EventBus.on('drag:orderChanged', ({ order }) => {
            StateManager.setOrder(order);
            SoundEngine.drag();
            // We DO NOT call #renderCodeCards() here! DragDropController
            // already did an in-place DOM swap natively. Re-rendering would glitch visually.
        });
    }

    // ══ NAVIGATION ═══════════════════════════════════════════════

    goToLangPick() {
        this.#stopTimer();
        this.#hideOverlay();
        GameEngine.transition(GameState.LANG_PICK, {});
    }

    goToMenu(lang = null) {
        this.#stopTimer();
        this.#hideOverlay();
        if (lang) StateManager.setLang(lang);
        if (!StateManager.lang) return;
        GameEngine.transition(GameState.MENU, { lang: StateManager.lang });
    }

    goToRanking(langMode = 'global') {
        this.#stopTimer();
        GameEngine.transition(GameState.RANKING, { langMode });
    }

    // ══ GAME ACTIONS ═════════════════════════════════════════════

    chooseLang(lang) {
        StateManager.setLang(lang);
        // Apply CSS variable
        const meta = LANG_META[lang];
        document.documentElement.style.setProperty('--lang-color', meta.cor);
        document.documentElement.style.setProperty('--lang-glow', meta.glow);
        this.goToMenu(lang);
    }

    startQuestion(moduleIdx, questionId) {
        const mod = QuestionBank.getModuleByIndex(moduleIdx);
        if (!mod) return;
        const question = mod.getQuestion(questionId);
        if (!question) return;

        StateManager.setModule(mod);
        StateManager.setQuestion(question);

        const shuffled = question.shuffleFor(StateManager.lang);
        StateManager.setOrder(shuffled);

        this.#startTimer();
        GameEngine.transition(GameState.GAME, { mod, question });
    }

    verify() {
        StateManager.incrementAttempts();
        const lang = StateManager.lang;
        const question = StateManager.question;
        const order = StateManager.order;
        const correct = question.validate(order, lang);

        if (correct) {
            this.#stopTimer();
            SoundEngine.ok();

            const stars = this.#calcStars();
            const pts = this.#calcPts(stars, StateManager.timerSecs, order.length);

            // Economy Payout
            const baseCoins = 10;
            const starBonus = stars === 3 ? 15 : stars === 2 ? 5 : 0;
            const timeBonus = StateManager.timerSecs < 10 ? 10 : 0;
            const comboBonus = StateManager.combo > 0 ? (StateManager.combo + 1) * 2 : 0;
            let earnedCoins = baseCoins + starBonus + timeBonus + comboBonus;

            // [RESTORE] Amuleto de Ouro Multiplier (2x)
            if (AuthService.player.hasItem('special_amulet')) {
                earnedCoins *= 2;
            }

            const uid = AuthService.player.uid;
            const prevProg = AuthService.player.getProgress(lang, question.id);
            const finalCoins = prevProg && prevProg.concluida ? Math.floor(earnedCoins / 2) : earnedCoins;
            GamificationService.addCoins(finalCoins);

            // Record progress
            const progData = { concluida: true, stars, pts, tempo: StateManager.timerSecs };
            AuthService.player.recordProgress(lang, question.id, progData);
            ProgressService.save(uid, lang, question.id, progData);

            // Update ranking
            const pub = AuthService.player.toPublic();
            if (pub.nome) RankingService.updateEntry(uid ?? pub.nome, pub);

            // Combo
            StateManager.incrementCombo();
            if (StateManager.combo > 1) SoundEngine.combo(StateManager.combo);

            EventBus.emit('game:correct', {
                stars, pts, finalCoins, question, lang,
                time: StateManager.timerSecs,
                combo: StateManager.combo
            });
            GameEngine.transition(GameState.RESULT, { stars, pts, coins: finalCoins });
        } else {
            SoundEngine.error();
            StateManager.resetCombo();
            EventBus.emit('game:wrong', {});
        }
    }

    showHint() {
        StateManager.useHint();
        EventBus.emit('game:hintShown', { hint: StateManager.question?.dica });
    }

    shuffle() {
        const lang = StateManager.lang;
        const question = StateManager.question;
        if (!question) return;
        StateManager.setOrder(question.shuffleFor(lang));
        this.#renderCodeCards();
    }

    nextQuestion() {
        const mod = StateManager.module;
        const question = StateManager.question;
        const allMods = QuestionBank.getAll();
        const modIdx = QuestionBank.indexOfModule(mod);
        const qIdx = mod.indexOf(question);

        if (qIdx < mod.count - 1) {
            this.startQuestion(modIdx, mod.getByIndex(qIdx + 1).id);
        } else if (modIdx < allMods.length - 1) {
            this.startQuestion(modIdx + 1, allMods[modIdx + 1].getByIndex(0).id);
        } else {
            this.goToMenu();
        }
    }

    setCatFilter(cat) {
        StateManager.setCatFilter(cat);
    }

    // ══ TIMER ════════════════════════════════════════════════════

    #startTimer() {
        this.#stopTimer();
        StateManager.resetTimer();
        this.#timerInterval = setInterval(() => StateManager.tickTimer(), 1000);
    }

    #stopTimer() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    // ══ SCORING ══════════════════════════════════════════════════

    #calcStars() {
        const { attempts, hintUsed } = StateManager;
        if (attempts === 1 && !hintUsed) return 3;
        if (attempts <= 2 && !hintUsed) return 2;
        return 1;
    }

    #calcPts(stars, secs, lineCount) {
        return lineCount * 150
            + (stars === 3 ? 500 : stars === 2 ? 250 : 0)
            + Math.max(0, 800 - secs * 5);
    }

    // ══ HELPERS ══════════════════════════════════════════════════

    #hideOverlay() {
        document.getElementById('overlay')?.classList.remove('on');
    }

    #renderCodeCards() {
        EventBus.emit('game:renderCards', {
            order: StateManager.order,
            question: StateManager.question,
            lang: StateManager.lang,
        });
    }

    /** Check if a module is locked (previous not complete) */
    isModuleLocked(moduleIdx) {
        if (moduleIdx === 0) return false;
        const lang = StateManager.lang;
        const prevMod = QuestionBank.getModuleByIndex(moduleIdx - 1);
        const progMap = AuthService.player.progressMap;
        return !prevMod?.isComplete(lang, progMap);
    }

    /** Check if a question within a module is locked */
    isQuestionLocked(moduleIdx, questionIdx) {
        if (this.isModuleLocked(moduleIdx)) return true;
        if (questionIdx === 0) return false;
        const mod = QuestionBank.getModuleByIndex(moduleIdx);
        const prevQ = mod?.getByIndex(questionIdx - 1);
        if (!prevQ) return false;
        const lang = StateManager.lang;
        return !AuthService.player.getProgress(lang, prevQ.id)?.concluida;
    }

    get highlighter() { return SyntaxHighlighter; }
    get questionBank() { return QuestionBank; }
    get langMeta() { return LANG_META; }
    get state() { return StateManager; }
    get player() { return AuthService.player; }
}

export default new GameController();
