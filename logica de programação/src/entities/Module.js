/**
 * Module — Groups related questions and tracks progress
 *
 * OOP Paradigms:
 * - Encapsulation: private question collection
 * - Composition: has-a collection of Questions
 */
export class Module {
    #id;
    #nome;
    #ico;
    #cat;
    #dif;
    #difTag;
    #difClass;
    #cor;
    #questoes = [];

    constructor({ id, nome, ico, cat, dif, difTag, difClass, cor }) {
        this.#id = id;
        this.#nome = nome;
        this.#ico = ico;
        this.#cat = cat;
        this.#dif = dif;
        this.#difTag = difTag;
        this.#difClass = difClass;
        this.#cor = cor;
    }

    get id() { return this.#id; }
    get nome() { return this.#nome; }
    get ico() { return this.#ico; }
    get cat() { return this.#cat; }
    get dif() { return this.#dif; }
    get difTag() { return this.#difTag; }
    get difClass() { return this.#difClass; }
    get cor() { return this.#cor; }
    get count() { return this.#questoes.length; }

    addQuestion(question) {
        this.#questoes.push(question);
        return this;  // fluent API
    }

    getQuestion(id) {
        return this.#questoes.find(q => q.id === id) ?? null;
    }

    getAll() {
        return [...this.#questoes];  // defensive copy
    }

    getByIndex(idx) {
        return this.#questoes[idx] ?? null;
    }

    indexOf(question) {
        return this.#questoes.indexOf(question);
    }

    /**
     * Compute module progress for a given language.
     * @param {string} lang
     * @param {Map<string,{concluida,stars,pts}>} progressMap
     * @returns {{ done:number, total:number, pct:number }}
     */
    computeProgress(lang, progressMap) {
        const total = this.#questoes.length;
        const done = this.#questoes.filter(
            q => progressMap.get(`${lang}:${q.id}`)?.concluida
        ).length;
        return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    }

    /**
     * Check if all questions in this module are completed.
     */
    isComplete(lang, progressMap) {
        return this.#questoes.every(
            q => progressMap.get(`${lang}:${q.id}`)?.concluida === true
        );
    }
}
