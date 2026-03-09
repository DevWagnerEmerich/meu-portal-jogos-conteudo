/**
 * Question — Abstract base class + concrete implementation
 *
 * OOP Paradigms:
 * - Abstraction: abstract base enforces contract
 * - Encapsulation: private fields
 * - Polymorphism: subclasses override validate() and getLines()
 */

/** Abstract base */
export class Question {
    #id;
    #nome;
    #enunciado;
    #dica;

    constructor(id, nome, enunciado, dica) {
        if (new.target === Question) {
            throw new Error('Question is abstract — use CodeOrderQuestion');
        }
        this.#id = id;
        this.#nome = nome;
        this.#enunciado = enunciado;
        this.#dica = dica;
    }

    get id() { return this.#id; }
    get nome() { return this.#nome; }
    get enunciado() { return this.#enunciado; }
    get dica() { return this.#dica; }

    /** @abstract — must be overridden */
    validate(_order, _lang) { throw new Error('validate() not implemented'); }
    getLines(_lang) { throw new Error('getLines() not implemented'); }
    getOrder(_lang) { throw new Error('getOrder() not implemented'); }

    toJSON() {
        return { id: this.#id, nome: this.#nome };
    }
}

/**
 * CodeOrderQuestion — Drag-and-drop code ordering exercise
 * Concrete implementation of Question.
 */
export class CodeOrderQuestion extends Question {
    #linhas;      // { visualg: [{id,code,ind}], python:[...], js:[...] }
    #ordem;       // { visualg: ['a','b',...], python:[...], js:[...] }
    #num;

    constructor({ id, nome, enunciado, dica, num, linhas, ordem }) {
        super(id, nome, enunciado, dica);
        this.#linhas = linhas;
        this.#ordem = ordem;
        this.#num = num;
    }

    get num() { return this.#num; }

    /**
     * Validate player's ordering against correct order.
     * @param {string[]} order — player's current line ids
     * @param {string}   lang
     * @returns {boolean}
     */
    validate(order, lang) {
        const correct = this.#ordem[lang] ?? [];
        if (order.length !== correct.length) return false;
        return order.every((id, i) => id === correct[i]);
    }

    /**
     * Get lines for a given language.
     * @param {string} lang
     * @returns {{ id:string, code:string, ind:number }[]}
     */
    getLines(lang) {
        return [...(this.#linhas[lang] ?? [])];  // defensive copy
    }

    /**
     * Get correct order for a given language.
     * @param {string} lang
     * @returns {string[]}
     */
    getOrder(lang) {
        return [...(this.#ordem[lang] ?? [])];
    }

    /** Shuffle lines — never return already-correct order */
    shuffleFor(lang) {
        const order = this.getOrder(lang);
        let arr = [...order];
        if (arr.length > 1) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            // Guarantee it's NOT already correct
            if (arr.every((v, i) => v === order[i])) {
                [arr[0], arr[1]] = [arr[1], arr[0]];
            }
        }
        return arr;
    }
}
