/**
 * StateManager — Centralized mutable game state (Encapsulation)
 * All state changes go through this class; no direct mutation allowed outside.
 */
import EventBus from './EventBus.js';

class StateManager {
    // Private fields — strict encapsulation
    #langAtual = null;
    #moduloAtual = null;
    #questaoAtual = null;
    #ordemAtual = [];
    #tentativas = 0;
    #dicaUsada = false;
    #timerSeg = 0;
    #catFiltro = 'todos';
    #comboCount = 0;

    // ── Getters (read-only access) ──────────────────────────────
    get lang() { return this.#langAtual; }
    get module() { return this.#moduloAtual; }
    get question() { return this.#questaoAtual; }
    get order() { return [...this.#ordemAtual]; }  // defensive copy
    get attempts() { return this.#tentativas; }
    get hintUsed() { return this.#dicaUsada; }
    get timerSecs() { return this.#timerSeg; }
    get catFilter() { return this.#catFiltro; }
    get combo() { return this.#comboCount; }

    // ── Setters with validation ─────────────────────────────────
    setLang(lang) {
        const valid = ['visualg', 'python', 'js'];
        if (!valid.includes(lang)) throw new Error(`Invalid lang: ${lang}`);
        this.#langAtual = lang;
        EventBus.emit('state:langChanged', { lang });
    }

    setModule(mod) {
        this.#moduloAtual = mod;
        EventBus.emit('state:moduleChanged', { mod });
    }

    setQuestion(question) {
        this.#questaoAtual = question;
        this.#tentativas = 0;
        this.#dicaUsada = false;
        this.#ordemAtual = [];
        EventBus.emit('state:questionChanged', { question });
    }

    setOrder(order) {
        if (!Array.isArray(order)) throw new TypeError('order must be Array');
        this.#ordemAtual = [...order];
        EventBus.emit('state:orderChanged', { order: this.#ordemAtual });
    }

    swapOrder(idxA, idxB) {
        const arr = [...this.#ordemAtual];
        [arr[idxA], arr[idxB]] = [arr[idxB], arr[idxA]];
        this.#ordemAtual = arr;
        EventBus.emit('state:orderChanged', { order: this.#ordemAtual });
    }

    incrementAttempts() {
        this.#tentativas++;
        EventBus.emit('state:attemptMade', { attempts: this.#tentativas });
    }

    useHint() {
        this.#dicaUsada = true;
        EventBus.emit('state:hintUsed', {});
    }

    tickTimer() {
        this.#timerSeg++;
        EventBus.emit('state:timerTick', { secs: this.#timerSeg });
    }

    resetTimer() { this.#timerSeg = 0; }

    setCatFilter(cat) {
        this.#catFiltro = cat;
        EventBus.emit('state:catFilterChanged', { cat });
    }

    incrementCombo() {
        this.#comboCount++;
        EventBus.emit('state:comboChanged', { combo: this.#comboCount });
    }

    resetCombo() {
        this.#comboCount = 0;
        EventBus.emit('state:comboChanged', { combo: 0 });
    }

    /** Full reset for new game session */
    resetSession() {
        this.#moduloAtual = null;
        this.#questaoAtual = null;
        this.#ordemAtual = [];
        this.#tentativas = 0;
        this.#dicaUsada = false;
        this.#timerSeg = 0;
    }
}

export default new StateManager();
