/**
 * GameEngine — Finite State Machine
 * Controls all valid state transitions in the game.
 *
 * OOP Paradigms Applied:
 * - Encapsulation: private state (#state, #transitions)
 * - Single Responsibility: only manages state
 */
import EventBus from './EventBus.js';

export const GameState = Object.freeze({
    LANG_PICK: 'LANG_PICK',
    MENU: 'MENU',
    GAME: 'GAME',
    RESULT: 'RESULT',
    RANKING: 'RANKING',
    AUTH: 'AUTH',
    SHOP: 'SHOP',
    ACHIEVEMENTS: 'ACHIEVEMENTS',
});

class GameEngine {
    #state = GameState.LANG_PICK;
    #previousState = null;

    #transitions = {
        [GameState.LANG_PICK]: [GameState.MENU, GameState.RANKING, GameState.AUTH],
        [GameState.MENU]: [GameState.GAME, GameState.RANKING, GameState.LANG_PICK, GameState.SHOP, GameState.ACHIEVEMENTS],
        [GameState.GAME]: [GameState.RESULT, GameState.MENU],
        [GameState.RESULT]: [GameState.GAME, GameState.MENU, GameState.RANKING],
        [GameState.RANKING]: [GameState.LANG_PICK, GameState.MENU, GameState.GAME],
        [GameState.AUTH]: [GameState.LANG_PICK, GameState.MENU],
        [GameState.SHOP]: [GameState.MENU],
        [GameState.ACHIEVEMENTS]: [GameState.MENU],
    };

    /**
     * Transition to a new state.
     * @param {string} newState — one of GameState enum values
     * @param {object} payload  — optional data to pass with event
     */
    transition(newState, payload = {}) {
        const allowed = this.#transitions[this.#state] ?? [];
        if (!allowed.includes(newState)) {
            console.warn(`[GameEngine] Invalid transition: ${this.#state} → ${newState}`);
            return false;
        }
        this.#previousState = this.#state;
        this.#state = newState;
        EventBus.emit('state:change', { from: this.#previousState, to: newState, ...payload });
        return true;
    }

    get currentState() { return this.#state; }
    get previousState() { return this.#previousState; }

    /** Force-reset to initial state (e.g., on logout) */
    reset() {
        this.#state = GameState.LANG_PICK;
        this.#previousState = null;
        EventBus.emit('state:reset', {});
    }
}

// Singleton
export default new GameEngine();
