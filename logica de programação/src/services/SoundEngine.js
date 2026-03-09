/**
 * SoundEngine — Web Audio API wrapper (OOP)
 *
 * OOP Paradigms:
 * - Encapsulation: AudioContext is private
 * - Abstraction: callers use named methods (ok, error, drag, win)
 */
class SoundEngine {
    #ctx = null;
    #muted = false;

    constructor() {
        // Lazy init on first user interaction
        document.addEventListener('click', () => this.#ensureCtx(), { once: true });
        document.addEventListener('touchstart', () => this.#ensureCtx(), { once: true });
    }

    #ensureCtx() {
        if (!this.#ctx) {
            this.#ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.#ctx.state === 'suspended') this.#ctx.resume();
    }

    get muted() { return this.#muted; }

    toggleMute() {
        this.#muted = !this.#muted;
        return this.#muted;
    }

    /** Low-level beep */
    #beep(freq, dur, type = 'sine', vol = 0.2) {
        if (this.#muted || !this.#ctx) return;
        try {
            const g = this.#ctx.createGain();
            const o = this.#ctx.createOscillator();
            o.type = type;
            o.frequency.value = freq;
            g.gain.setValueAtTime(vol, this.#ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.#ctx.currentTime + dur);
            o.connect(g);
            g.connect(this.#ctx.destination);
            o.start(this.#ctx.currentTime);
            o.stop(this.#ctx.currentTime + dur);
        } catch { /* ignore audio errors */ }
    }

    /** Correct answer — ascending chord */
    ok() {
        [440, 550, 660, 880].forEach((f, i) =>
            setTimeout(() => this.#beep(f, 0.1), i * 65)
        );
    }

    /** Wrong answer */
    error() { this.#beep(180, 0.3, 'sawtooth', 0.15); }

    /** Card drag */
    drag() { this.#beep(600, 0.04, 'triangle', 0.06); }

    /** Level complete — victory fanfare */
    win() {
        [660, 784, 1047, 1319, 1568].forEach((f, i) =>
            setTimeout(() => this.#beep(f, 0.16, 'sine', 0.18), i * 85)
        );
    }

    /** Combo! */
    combo(count) {
        const base = 440 + (count * 80);
        this.#beep(Math.min(base, 1200), 0.08, 'sine', 0.15);
    }
}

export default new SoundEngine();
