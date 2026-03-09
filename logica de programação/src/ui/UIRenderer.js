/**
 * UIRenderer — Abstract base class for all view renderers
 *
 * OOP Paradigms:
 * - Abstraction: enforces contract for all concrete renderers
 * - Template Method pattern: common lifecycle hooks
 * - Inheritance: subclasses extend this
 */
export class UIRenderer {
    #container;
    #visible = false;

    /**
     * @param {HTMLElement|string} container — element or selector
     */
    constructor(container) {
        if (new.target === UIRenderer) {
            throw new Error('UIRenderer is abstract');
        }
        this.#container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.#container) {
            throw new Error(`UIRenderer: container not found — ${container}`);
        }
    }

    get container() { return this.#container; }
    get isVisible() { return this.#visible; }

    /** @abstract — subclasses must implement */
    render(_data) { throw new Error(`${this.constructor.name}.render() not implemented`); }

    /** Show the view */
    show() {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('ativa'));
        this.#container.classList.add('ativa');
        this.#visible = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.onShow();
    }

    /** Hide the view */
    hide() {
        this.#container.classList.remove('ativa');
        this.#visible = false;
        this.onHide();
    }

    /** Clear container innerHTML */
    clear() { this.#container.innerHTML = ''; }

    /** Template method hooks — override in subclasses */
    onShow() { }
    onHide() { }

    /** Helper: create element with optional innerHTML */
    static el(tag, cls = '', html = '') {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    }
}
