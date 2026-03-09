/**
 * LanguageMeta — Configuration objects for each supported language.
 * Implements an "enum-like" objects pattern with value objects.
 */
export class LangConfig {
    #key;
    #nome;
    #cor;
    #glow;
    #ext;
    #icon;
    #desc;

    constructor({ key, nome, cor, glow, ext, icon, desc }) {
        this.#key = key;
        this.#nome = nome;
        this.#cor = cor;
        this.#glow = glow;
        this.#ext = ext;
        this.#icon = icon;
        this.#desc = desc;
        Object.freeze(this);
    }

    get key() { return this.#key; }
    get nome() { return this.#nome; }
    get cor() { return this.#cor; }
    get glow() { return this.#glow; }
    get ext() { return this.#ext; }
    get icon() { return this.#icon; }
    get desc() { return this.#desc; }
}

export const LANG_META = Object.freeze({
    visualg: new LangConfig({
        key: 'visualg',
        nome: 'VisualG',
        cor: 'var(--green)',
        glow: 'var(--glow-g)',
        ext: 'alg',
        icon: 'VG',
        desc: 'Pseudocódigo em português. Ideal para iniciantes!',
    }),
    python: new LangConfig({
        key: 'python',
        nome: 'Python',
        cor: 'var(--blue)',
        glow: 'var(--glow-b)',
        ext: 'py',
        icon: '🐍',
        desc: 'Sintaxe limpa e poderosa. A linguagem do futuro!',
    }),
    js: new LangConfig({
        key: 'js',
        nome: 'JavaScript',
        cor: 'var(--yellow)',
        glow: 'var(--glow-y)',
        ext: 'js',
        icon: 'JS',
        desc: 'A linguagem da web. Roda em qualquer navegador!',
    }),
});

export const LANGS = Object.keys(LANG_META);
