/**
 * QuestionBank — Registry of all game modules and questions
 *
 * OOP Paradigms:
 * - Registry Pattern: centralized repository of all modules
 * - Factory methods: buildModule() encapsulates construction
 * - Encapsulation: modules stored in private Map
 */
import { CodeOrderQuestion } from '../entities/Question.js';
import { Module } from '../entities/Module.js';
import { extras_m1, extras_m2, extras_m3, extras_m4, extras_m5, extras_m6, extras_m7, extras_m8 } from './ExtendedQuestions.js';

class QuestionBank {
    #modules = [];  // ordered array for UI
    #index = new Map();  // id → Module for fast lookup

    constructor() {
        this.#build();
    }

    /** Access all modules (defensive copy) */
    getAll() { return [...this.#modules]; }

    /** Get module by id */
    getModule(id) { return this.#index.get(id) ?? null; }

    /** Get module by index */
    getModuleByIndex(idx) { return this.#modules[idx] ?? null; }

    /** Find module index */
    indexOfModule(mod) { return this.#modules.indexOf(mod); }

    /** Total question count across all modules */
    get totalCount() {
        return this.#modules.reduce((s, m) => s + m.count, 0);
    }

    // ── Private Builder ─────────────────────────────────────────

    #addModule(config, questions) {
        const mod = new Module(config);
        questions.forEach(q => mod.addQuestion(new CodeOrderQuestion(q)));
        this.#modules.push(mod);
        this.#index.set(mod.id, mod);
        return mod;
    }

    #build() {

        // ══ MÓDULO 1: VARIÁVEIS E ATRIBUIÇÃO ══
        this.#addModule(
            {
                id: 'm1', nome: 'Variáveis e Atribuição', ico: '📦', cat: 'variaveis',
                dif: 'init', difTag: 'Iniciante', difClass: 'dt-init', cor: 'var(--green)'
            },
            [
                {
                    id: 'm1q1', nome: 'Olá, Mundo!', num: 1,
                    enunciado: 'Escreva um programa que <strong>exiba a mensagem</strong> "Olá, Mundo!" na tela.',
                    dica: 'Em VisualG: escreval() | Python: print() | JS: console.log()',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "OlaMundo"', ind: 0 },
                            { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'inicio', ind: 0 },
                            { id: 'd', code: 'escreval("Olá, Mundo!")', ind: 1 },
                            { id: 'e', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [{ id: 'a', code: 'print("Olá, Mundo!")', ind: 0 }],
                        js: [{ id: 'a', code: 'console.log("Olá, Mundo!");', ind: 0 }],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e'], python: ['a'], js: ['a'] },
                },
                {
                    id: 'm1q2', nome: 'Declarar Variável Inteira', num: 2,
                    enunciado: 'Declare uma variável inteira chamada <strong>idade</strong>, atribua o valor <strong>18</strong> e exiba-a.',
                    dica: 'Em VisualG declare na seção "var". Em Python e JS basta atribuir.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Idade"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'idade : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'idade <- 18', ind: 1 }, { id: 'f', code: 'escreval(idade)', ind: 1 },
                            { id: 'g', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [{ id: 'a', code: 'idade = 18', ind: 0 }, { id: 'b', code: 'print(idade)', ind: 0 }],
                        js: [{ id: 'a', code: 'let idade = 18;', ind: 0 }, { id: 'b', code: 'console.log(idade);', ind: 0 }],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], python: ['a', 'b'], js: ['a', 'b'] },
                },
                {
                    id: 'm1q3', nome: 'Múltiplas Variáveis', num: 3,
                    enunciado: 'Declare variáveis <strong>nome</strong> (texto) e <strong>nota</strong> (real), atribua valores e exiba-as.',
                    dica: "Atenção ao tipo 'caractere' no VisualG e 'real' para decimais!",
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Aluno"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'nome : caractere', ind: 1 }, { id: 'd', code: 'nota : real', ind: 1 },
                            { id: 'e', code: 'inicio', ind: 0 }, { id: 'f', code: 'nome <- "Ana"', ind: 1 },
                            { id: 'g', code: 'nota <- 9.5', ind: 1 }, { id: 'h', code: 'escreval(nome, nota)', ind: 1 },
                            { id: 'i', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'nome = "Ana"', ind: 0 }, { id: 'b', code: 'nota = 9.5', ind: 0 },
                            { id: 'c', code: 'print(nome, nota)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let nome = "Ana";', ind: 0 }, { id: 'b', code: 'let nota = 9.5;', ind: 0 },
                            { id: 'c', code: 'console.log(nome, nota);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], python: ['a', 'b', 'c'], js: ['a', 'b', 'c'] },
                },
                {
                    id: 'm1q4', nome: 'Troca de Variáveis', num: 4,
                    enunciado: 'Troque o conteúdo de duas variáveis <strong>a = 10</strong> e <strong>b = 20</strong> usando uma variável auxiliar.',
                    dica: "Use uma variável 'aux' para guardar o valor temporariamente!",
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Troca"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'a, b, aux : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'a <- 10', ind: 1 }, { id: 'f', code: 'b <- 20', ind: 1 },
                            { id: 'g', code: 'aux <- a', ind: 1 }, { id: 'h', code: 'a <- b', ind: 1 },
                            { id: 'i', code: 'b <- aux', ind: 1 }, { id: 'j', code: 'escreval(a, b)', ind: 1 },
                            { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'a = 10', ind: 0 }, { id: 'b', code: 'b = 20', ind: 0 },
                            { id: 'c', code: 'aux = a', ind: 0 }, { id: 'd', code: 'a = b', ind: 0 },
                            { id: 'e', code: 'b = aux', ind: 0 }, { id: 'f', code: 'print(a, b)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let a = 10;', ind: 0 }, { id: 'b', code: 'let b = 20;', ind: 0 },
                            { id: 'c', code: 'let aux = a;', ind: 0 }, { id: 'd', code: 'a = b;', ind: 0 },
                            { id: 'e', code: 'b = aux;', ind: 0 }, { id: 'f', code: 'console.log(a, b);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd', 'e', 'f'], js: ['a', 'b', 'c', 'd', 'e', 'f'] },
                },
                ...extras_m1
            ]
        );

        // ══ MÓDULO 2: ENTRADA E SAÍDA ══
        this.#addModule(
            {
                id: 'm2', nome: 'Entrada e Saída', ico: '📥', cat: 'io',
                dif: 'init', difTag: 'Iniciante', difClass: 'dt-init', cor: 'var(--blue)'
            },
            [
                {
                    id: 'm2q1', nome: 'Ler e Exibir Nome', num: 1,
                    enunciado: 'Peça ao usuário que <strong>digite seu nome</strong> e exiba uma saudação.',
                    dica: 'Use leia() / input() / prompt() para capturar o valor.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Saudacao"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'nome : caractere', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'escreva("Digite seu nome: ")', ind: 1 }, { id: 'f', code: 'leia(nome)', ind: 1 },
                            { id: 'g', code: 'escreval("Olá, ", nome)', ind: 1 }, { id: 'h', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'nome = input("Digite seu nome: ")', ind: 0 },
                            { id: 'b', code: 'print("Olá,", nome)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let nome = prompt("Digite seu nome:");', ind: 0 },
                            { id: 'b', code: 'console.log("Olá, " + nome);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], python: ['a', 'b'], js: ['a', 'b'] },
                },
                {
                    id: 'm2q2', nome: 'Soma de Dois Números', num: 2,
                    enunciado: 'Peça ao usuário <strong>dois números inteiros</strong>, some-os e exiba o resultado.',
                    dica: 'Lembre de converter a entrada para inteiro (int() no Python, parseInt() no JS)!',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Soma"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'a, b, soma : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'escreva("Primeiro número: ")', ind: 1 }, { id: 'f', code: 'leia(a)', ind: 1 },
                            { id: 'g', code: 'escreva("Segundo número: ")', ind: 1 }, { id: 'h', code: 'leia(b)', ind: 1 },
                            { id: 'i', code: 'soma <- a + b', ind: 1 }, { id: 'j', code: 'escreval("Soma: ", soma)', ind: 1 },
                            { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'a = int(input("Primeiro número: "))', ind: 0 },
                            { id: 'b', code: 'b = int(input("Segundo número: "))', ind: 0 },
                            { id: 'c', code: 'soma = a + b', ind: 0 }, { id: 'd', code: 'print("Soma:", soma)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let a = parseInt(prompt("Primeiro número:"));', ind: 0 },
                            { id: 'b', code: 'let b = parseInt(prompt("Segundo número:"));', ind: 0 },
                            { id: 'c', code: 'let soma = a + b;', ind: 0 }, { id: 'd', code: 'console.log("Soma:", soma);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd'], js: ['a', 'b', 'c', 'd'] },
                },
                {
                    id: 'm2q3', nome: 'Cálculo de Área', num: 3,
                    enunciado: 'Leia <strong>base</strong> e <strong>altura</strong> de um retângulo e calcule a área (base × altura).',
                    dica: 'A área é base multiplicada pela altura.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Area"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'base, altura, area : real', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'escreva("Base: ")', ind: 1 }, { id: 'f', code: 'leia(base)', ind: 1 },
                            { id: 'g', code: 'escreva("Altura: ")', ind: 1 }, { id: 'h', code: 'leia(altura)', ind: 1 },
                            { id: 'i', code: 'area <- base * altura', ind: 1 }, { id: 'j', code: 'escreval("Área: ", area)', ind: 1 },
                            { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'base = float(input("Base: "))', ind: 0 },
                            { id: 'b', code: 'altura = float(input("Altura: "))', ind: 0 },
                            { id: 'c', code: 'area = base * altura', ind: 0 }, { id: 'd', code: 'print("Área:", area)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let base = parseFloat(prompt("Base:"));', ind: 0 },
                            { id: 'b', code: 'let altura = parseFloat(prompt("Altura:"));', ind: 0 },
                            { id: 'c', code: 'let area = base * altura;', ind: 0 }, { id: 'd', code: 'console.log("Área:", area);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd'], js: ['a', 'b', 'c', 'd'] },
                },
                ...extras_m2
            ]
        );

        // ══ MÓDULO 3: OPERAÇÕES MATEMÁTICAS ══
        this.#addModule(
            {
                id: 'm3', nome: 'Operações Matemáticas', ico: '➗', cat: 'operacoes',
                dif: 'bas', difTag: 'Básico', difClass: 'dt-bas', cor: 'var(--yellow)'
            },
            [
                {
                    id: 'm3q1', nome: 'Média de Três Notas', num: 1,
                    enunciado: 'Leia <strong>três notas</strong> de um aluno e calcule a média aritmética.',
                    dica: 'Média = (nota1 + nota2 + nota3) / 3',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Media"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'n1, n2, n3, media : real', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(n1, n2, n3)', ind: 1 }, { id: 'f', code: 'media <- (n1 + n2 + n3) / 3', ind: 1 },
                            { id: 'g', code: 'escreval("Média: ", media)', ind: 1 }, { id: 'h', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'n1 = float(input("Nota 1: "))', ind: 0 },
                            { id: 'b', code: 'n2 = float(input("Nota 2: "))', ind: 0 },
                            { id: 'c', code: 'n3 = float(input("Nota 3: "))', ind: 0 },
                            { id: 'd', code: 'media = (n1 + n2 + n3) / 3', ind: 0 },
                            { id: 'e', code: 'print("Média:", media)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let n1 = parseFloat(prompt("Nota 1:"));', ind: 0 },
                            { id: 'b', code: 'let n2 = parseFloat(prompt("Nota 2:"));', ind: 0 },
                            { id: 'c', code: 'let n3 = parseFloat(prompt("Nota 3:"));', ind: 0 },
                            { id: 'd', code: 'let media = (n1 + n2 + n3) / 3;', ind: 0 },
                            { id: 'e', code: 'console.log("Média:", media);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], python: ['a', 'b', 'c', 'd', 'e'], js: ['a', 'b', 'c', 'd', 'e'] },
                },
                {
                    id: 'm3q2', nome: 'Resto e Quociente', num: 2,
                    enunciado: 'Leia dois inteiros e exiba o <strong>quociente</strong> e o <strong>resto</strong> da divisão.',
                    dica: 'Quociente = a div b | Resto = a mod b (VisualG), a // b e a % b (Python/JS)',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Divisao"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'a, b : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(a, b)', ind: 1 },
                            { id: 'f', code: 'escreval("Quociente: ", a div b)', ind: 1 },
                            { id: 'g', code: 'escreval("Resto: ", a mod b)', ind: 1 },
                            { id: 'h', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'a = int(input("Dividendo: "))', ind: 0 },
                            { id: 'b', code: 'b = int(input("Divisor: "))', ind: 0 },
                            { id: 'c', code: 'print("Quociente:", a // b)', ind: 0 },
                            { id: 'd', code: 'print("Resto:", a % b)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let a = parseInt(prompt("Dividendo:"));', ind: 0 },
                            { id: 'b', code: 'let b = parseInt(prompt("Divisor:"));', ind: 0 },
                            { id: 'c', code: 'console.log("Quociente:", Math.floor(a / b));', ind: 0 },
                            { id: 'd', code: 'console.log("Resto:", a % b);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], python: ['a', 'b', 'c', 'd'], js: ['a', 'b', 'c', 'd'] },
                },
                {
                    id: 'm3q3', nome: 'Conversão de Temperatura', num: 3,
                    enunciado: 'Converta temperatura de <strong>Celsius para Fahrenheit</strong>: F = C × 1.8 + 32',
                    dica: 'Leia Celsius, aplique a fórmula e exiba Fahrenheit.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Temperatura"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'celsius, fahrenheit : real', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'escreva("Celsius: ")', ind: 1 }, { id: 'f', code: 'leia(celsius)', ind: 1 },
                            { id: 'g', code: 'fahrenheit <- celsius * 1.8 + 32', ind: 1 },
                            { id: 'h', code: 'escreval("Fahrenheit: ", fahrenheit)', ind: 1 },
                            { id: 'i', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'celsius = float(input("Celsius: "))', ind: 0 },
                            { id: 'b', code: 'fahrenheit = celsius * 1.8 + 32', ind: 0 },
                            { id: 'c', code: 'print("Fahrenheit:", fahrenheit)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let celsius = parseFloat(prompt("Celsius:"));', ind: 0 },
                            { id: 'b', code: 'let fahrenheit = celsius * 1.8 + 32;', ind: 0 },
                            { id: 'c', code: 'console.log("Fahrenheit:", fahrenheit);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], python: ['a', 'b', 'c'], js: ['a', 'b', 'c'] },
                },
                ...extras_m3
            ]
        );

        // ══ MÓDULO 4: CONDICIONAIS ══
        this.#addModule(
            {
                id: 'm4', nome: 'Condicionais (Se/Senão)', ico: '🔀', cat: 'condicionais',
                dif: 'bas', difTag: 'Básico', difClass: 'dt-bas', cor: 'var(--purple)'
            },
            [
                {
                    id: 'm4q1', nome: 'Par ou Ímpar', num: 1,
                    enunciado: 'Leia um número e diga se é <strong>par</strong> ou <strong>ímpar</strong>.',
                    dica: 'Um número é par se o resto da divisão por 2 for zero!',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "ParImpar"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'n : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(n)', ind: 1 }, { id: 'f', code: 'se (n mod 2 = 0) entao', ind: 1 },
                            { id: 'g', code: 'escreval("Par")', ind: 2 }, { id: 'h', code: 'senao', ind: 1 },
                            { id: 'i', code: 'escreval("Ímpar")', ind: 2 }, { id: 'j', code: 'fimse', ind: 1 },
                            { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'n = int(input("Número: "))', ind: 0 },
                            { id: 'b', code: 'if n % 2 == 0:', ind: 0 }, { id: 'c', code: 'print("Par")', ind: 1 },
                            { id: 'd', code: 'else:', ind: 0 }, { id: 'e', code: 'print("Ímpar")', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'let n = parseInt(prompt("Número:"));', ind: 0 },
                            { id: 'b', code: 'if (n % 2 === 0) {', ind: 0 }, { id: 'c', code: 'console.log("Par");', ind: 1 },
                            { id: 'd', code: '} else {', ind: 0 }, { id: 'e', code: 'console.log("Ímpar");', ind: 1 },
                            { id: 'f', code: '}', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd', 'e'], js: ['a', 'b', 'c', 'd', 'e', 'f'] },
                },
                {
                    id: 'm4q2', nome: 'Maior de Dois', num: 2,
                    enunciado: 'Leia dois números e exiba o <strong>maior</strong> deles.',
                    dica: 'Compare com if/se e escolha o maior para exibir.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "MaiorDois"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'a, b : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(a, b)', ind: 1 }, { id: 'f', code: 'se (a > b) entao', ind: 1 },
                            { id: 'g', code: 'escreval("Maior: ", a)', ind: 2 }, { id: 'h', code: 'senao', ind: 1 },
                            { id: 'i', code: 'escreval("Maior: ", b)', ind: 2 }, { id: 'j', code: 'fimse', ind: 1 },
                            { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'a = int(input("A: "))', ind: 0 }, { id: 'b', code: 'b = int(input("B: "))', ind: 0 },
                            { id: 'c', code: 'if a > b:', ind: 0 }, { id: 'd', code: 'print("Maior:", a)', ind: 1 },
                            { id: 'e', code: 'else:', ind: 0 }, { id: 'f', code: 'print("Maior:", b)', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'let a = parseInt(prompt("A:"));', ind: 0 },
                            { id: 'b', code: 'let b = parseInt(prompt("B:"));', ind: 0 },
                            { id: 'c', code: 'if (a > b) {', ind: 0 }, { id: 'd', code: 'console.log("Maior:", a);', ind: 1 },
                            { id: 'e', code: '} else {', ind: 0 }, { id: 'f', code: 'console.log("Maior:", b);', ind: 1 },
                            { id: 'g', code: '}', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd', 'e', 'f'], js: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
                },
                {
                    id: 'm4q3', nome: 'Classificação de Aluno', num: 3,
                    enunciado: 'Leia a média de um aluno e exiba: <strong>Aprovado</strong> (≥7), <strong>Recuperação</strong> (≥5) ou <strong>Reprovado</strong> (<5).',
                    dica: 'Use se/senão encadeado para verificar múltiplas condições.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Classificacao"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'media : real', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(media)', ind: 1 },
                            { id: 'f', code: 'se (media >= 7) entao', ind: 1 }, { id: 'g', code: 'escreval("Aprovado")', ind: 2 },
                            { id: 'h', code: 'senao', ind: 1 }, { id: 'i', code: 'se (media >= 5) entao', ind: 2 },
                            { id: 'j', code: 'escreval("Recuperação")', ind: 3 }, { id: 'k', code: 'senao', ind: 2 },
                            { id: 'l', code: 'escreval("Reprovado")', ind: 3 }, { id: 'm', code: 'fimse', ind: 2 },
                            { id: 'n', code: 'fimse', ind: 1 }, { id: 'o', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'media = float(input("Média: "))', ind: 0 },
                            { id: 'b', code: 'if media >= 7:', ind: 0 }, { id: 'c', code: 'print("Aprovado")', ind: 1 },
                            { id: 'd', code: 'elif media >= 5:', ind: 0 }, { id: 'e', code: 'print("Recuperação")', ind: 1 },
                            { id: 'f', code: 'else:', ind: 0 }, { id: 'g', code: 'print("Reprovado")', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'let media = parseFloat(prompt("Média:"));', ind: 0 },
                            { id: 'b', code: 'if (media >= 7) {', ind: 0 }, { id: 'c', code: 'console.log("Aprovado");', ind: 1 },
                            { id: 'd', code: '} else if (media >= 5) {', ind: 0 }, { id: 'e', code: 'console.log("Recuperação");', ind: 1 },
                            { id: 'f', code: '} else {', ind: 0 }, { id: 'g', code: 'console.log("Reprovado");', ind: 1 },
                            { id: 'h', code: '}', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'], python: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], js: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
                },
                ...extras_m4
            ]
        );

        // ══ MÓDULO 5: LAÇOS DE REPETIÇÃO ══
        this.#addModule(
            {
                id: 'm5', nome: 'Laços de Repetição', ico: '🔄', cat: 'lacos',
                dif: 'int', difTag: 'Intermediário', difClass: 'dt-int', cor: 'var(--teal)'
            },
            [
                {
                    id: 'm5q1', nome: 'Contagem de 1 a 10', num: 1,
                    enunciado: 'Exiba os números de <strong>1 a 10</strong> usando um laço de repetição.',
                    dica: 'Use para/for com intervalo definido.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Contagem"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'i : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'para i de 1 ate 10 faca', ind: 1 },
                            { id: 'f', code: 'escreval(i)', ind: 2 },
                            { id: 'g', code: 'fimpara', ind: 1 }, { id: 'h', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'for i in range(1, 11):', ind: 0 },
                            { id: 'b', code: 'print(i)', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'for (let i = 1; i <= 10; i++) {', ind: 0 },
                            { id: 'b', code: 'console.log(i);', ind: 1 }, { id: 'c', code: '}', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], python: ['a', 'b'], js: ['a', 'b', 'c'] },
                },
                {
                    id: 'm5q2', nome: 'Fatorial', num: 2,
                    enunciado: 'Calcule o <strong>fatorial</strong> de um número N lido do usuário.',
                    dica: 'Fatorial: multiplique todos os números de 1 até N.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "Fatorial"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'n, fat, i : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(n)', ind: 1 }, { id: 'f', code: 'fat <- 1', ind: 1 },
                            { id: 'g', code: 'para i de 1 ate n faca', ind: 1 },
                            { id: 'h', code: 'fat <- fat * i', ind: 2 },
                            { id: 'i', code: 'fimpara', ind: 1 },
                            { id: 'j', code: 'escreval(fat)', ind: 1 }, { id: 'k', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'n = int(input("N: "))', ind: 0 }, { id: 'b', code: 'fat = 1', ind: 0 },
                            { id: 'c', code: 'for i in range(1, n + 1):', ind: 0 },
                            { id: 'd', code: 'fat *= i', ind: 1 }, { id: 'e', code: 'print(fat)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let n = parseInt(prompt("N:"));', ind: 0 },
                            { id: 'b', code: 'let fat = 1;', ind: 0 },
                            { id: 'c', code: 'for (let i = 1; i <= n; i++) {', ind: 0 },
                            { id: 'd', code: 'fat *= i;', ind: 1 }, { id: 'e', code: '}', ind: 0 },
                            { id: 'f', code: 'console.log(fat);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], python: ['a', 'b', 'c', 'd', 'e'], js: ['a', 'b', 'c', 'd', 'e', 'f'] },
                },
                {
                    id: 'm5q3', nome: 'Soma Acumulada', num: 3,
                    enunciado: 'Leia <strong>N números</strong> e exiba a soma de todos eles.',
                    dica: 'Use uma variável acumuladora e some cada número lido.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "SomaAcumulada"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'n, i, num, soma : inteiro', ind: 1 }, { id: 'd', code: 'inicio', ind: 0 },
                            { id: 'e', code: 'leia(n)', ind: 1 }, { id: 'f', code: 'soma <- 0', ind: 1 },
                            { id: 'g', code: 'para i de 1 ate n faca', ind: 1 },
                            { id: 'h', code: 'leia(num)', ind: 2 }, { id: 'i', code: 'soma <- soma + num', ind: 2 },
                            { id: 'j', code: 'fimpara', ind: 1 },
                            { id: 'k', code: 'escreval(soma)', ind: 1 }, { id: 'l', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'n = int(input("Quantidade: "))', ind: 0 },
                            { id: 'b', code: 'soma = 0', ind: 0 },
                            { id: 'c', code: 'for _ in range(n):', ind: 0 },
                            { id: 'd', code: 'soma += int(input())', ind: 1 },
                            { id: 'e', code: 'print(soma)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let n = parseInt(prompt("Quantidade:"));', ind: 0 },
                            { id: 'b', code: 'let soma = 0;', ind: 0 },
                            { id: 'c', code: 'for (let i = 0; i < n; i++) {', ind: 0 },
                            { id: 'd', code: 'soma += parseInt(prompt("Número:"));', ind: 1 },
                            { id: 'e', code: '}', ind: 0 }, { id: 'f', code: 'console.log(soma);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], python: ['a', 'b', 'c', 'd', 'e'], js: ['a', 'b', 'c', 'd', 'e', 'f'] },
                },
                ...extras_m5
            ]
        );

        // ══ MÓDULO 6: FUNÇÕES ══
        this.#addModule(
            {
                id: 'm6', nome: 'Funções e Procedimentos', ico: '🔧', cat: 'funcoes',
                dif: 'int', difTag: 'Intermediário', difClass: 'dt-int', cor: 'var(--coral)'
            },
            [
                {
                    id: 'm6q1', nome: 'Função Soma', num: 1,
                    enunciado: 'Crie uma <strong>função</strong> que receba dois números e retorne a soma.',
                    dica: 'Defina a função antes de chamá-la (em Python). No JS e VisualG pode chamar antes.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "FuncaoSoma"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'resultado : inteiro', ind: 1 },
                            { id: 'd', code: 'funcao soma(a, b : inteiro) : inteiro', ind: 0 },
                            { id: 'e', code: 'retorne a + b', ind: 1 }, { id: 'f', code: 'fimfuncao', ind: 0 },
                            { id: 'g', code: 'inicio', ind: 0 },
                            { id: 'h', code: 'resultado <- soma(3, 5)', ind: 1 },
                            { id: 'i', code: 'escreval(resultado)', ind: 1 }, { id: 'j', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'def soma(a, b):', ind: 0 }, { id: 'b', code: 'return a + b', ind: 1 },
                            { id: 'c', code: 'resultado = soma(3, 5)', ind: 0 },
                            { id: 'd', code: 'print(resultado)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'function soma(a, b) {', ind: 0 },
                            { id: 'b', code: 'return a + b;', ind: 1 }, { id: 'c', code: '}', ind: 0 },
                            { id: 'd', code: 'let resultado = soma(3, 5);', ind: 0 },
                            { id: 'e', code: 'console.log(resultado);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], python: ['a', 'b', 'c', 'd'], js: ['a', 'b', 'c', 'd', 'e'] },
                },
                {
                    id: 'm6q2', nome: 'Função Máximo', num: 2,
                    enunciado: 'Crie uma função <strong>máximo</strong> que retorne o maior entre dois valores.',
                    dica: 'Use um condicional dentro da função para comparar os valores.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'funcao maximo(a, b : inteiro) : inteiro', ind: 0 },
                            { id: 'b', code: 'se a > b entao', ind: 1 }, { id: 'c', code: 'retorne a', ind: 2 },
                            { id: 'd', code: 'senao', ind: 1 }, { id: 'e', code: 'retorne b', ind: 2 },
                            { id: 'f', code: 'fimse', ind: 1 }, { id: 'g', code: 'fimfuncao', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'def maximo(a, b):', ind: 0 },
                            { id: 'b', code: 'if a > b:', ind: 1 }, { id: 'c', code: 'return a', ind: 2 },
                            { id: 'd', code: 'return b', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'function maximo(a, b) {', ind: 0 },
                            { id: 'b', code: 'if (a > b) return a;', ind: 1 },
                            { id: 'c', code: 'return b;', ind: 1 }, { id: 'd', code: '}', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], python: ['a', 'b', 'c', 'd'], js: ['a', 'b', 'c', 'd'] },
                },
                ...extras_m6
            ]
        );

        // ══ MÓDULO 7: VETORES ══
        this.#addModule(
            {
                id: 'm7', nome: 'Vetores e Arrays', ico: '📋', cat: 'vetores',
                dif: 'av', difTag: 'Avançado', difClass: 'dt-av', cor: 'var(--purple)'
            },
            [
                {
                    id: 'm7q1', nome: 'Somar Elementos', num: 1,
                    enunciado: 'Declare um vetor de <strong>5 inteiros</strong>, leia os valores e exiba a soma.',
                    dica: 'Percorra o vetor com um for e acumule os valores.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "SomaVetor"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'v : vetor[1..5] de inteiro', ind: 1 },
                            { id: 'd', code: 'i, soma : inteiro', ind: 1 }, { id: 'e', code: 'inicio', ind: 0 },
                            { id: 'f', code: 'soma <- 0', ind: 1 },
                            { id: 'g', code: 'para i de 1 ate 5 faca', ind: 1 },
                            { id: 'h', code: 'leia(v[i])', ind: 2 }, { id: 'i', code: 'soma <- soma + v[i]', ind: 2 },
                            { id: 'j', code: 'fimpara', ind: 1 }, { id: 'k', code: 'escreval(soma)', ind: 1 },
                            { id: 'l', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'v = [int(input()) for _ in range(5)]', ind: 0 },
                            { id: 'b', code: 'soma = sum(v)', ind: 0 }, { id: 'c', code: 'print(soma)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let v = [];', ind: 0 },
                            { id: 'b', code: 'for (let i=0;i<5;i++) v.push(parseInt(prompt(`v[${i}]:`)));', ind: 0 },
                            { id: 'c', code: 'let soma = v.reduce((a,b) => a+b, 0);', ind: 0 },
                            { id: 'd', code: 'console.log(soma);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], python: ['a', 'b', 'c'], js: ['a', 'b', 'c', 'd'] },
                },
                {
                    id: 'm7q2', nome: 'Maior Elemento', num: 2,
                    enunciado: 'Encontre o <strong>maior elemento</strong> de um vetor de 5 inteiros.',
                    dica: 'Inicialize "maior" com o primeiro elemento e compare com os demais.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "MaiorVetor"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'v : vetor[1..5] de inteiro', ind: 1 },
                            { id: 'd', code: 'i, maior : inteiro', ind: 1 }, { id: 'e', code: 'inicio', ind: 0 },
                            { id: 'f', code: 'para i de 1 ate 5 faca leia(v[i]) fimpara', ind: 1 },
                            { id: 'g', code: 'maior <- v[1]', ind: 1 },
                            { id: 'h', code: 'para i de 2 ate 5 faca', ind: 1 },
                            { id: 'i', code: 'se v[i] > maior entao', ind: 2 },
                            { id: 'j', code: 'maior <- v[i]', ind: 3 }, { id: 'k', code: 'fimse', ind: 2 },
                            { id: 'l', code: 'fimpara', ind: 1 }, { id: 'm', code: 'escreval(maior)', ind: 1 },
                            { id: 'n', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'v = [int(input(f"v[{i}]: ")) for i in range(5)]', ind: 0 },
                            { id: 'b', code: 'maior = v[0]', ind: 0 },
                            { id: 'c', code: 'for x in v:', ind: 0 }, { id: 'd', code: 'if x > maior:', ind: 1 },
                            { id: 'e', code: 'maior = x', ind: 2 }, { id: 'f', code: 'print(maior)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let v = [];', ind: 0 },
                            { id: 'b', code: 'for (let i=0;i<5;i++) v.push(parseInt(prompt(`v[${i}]:`)));', ind: 0 },
                            { id: 'c', code: 'let maior = v[0];', ind: 0 },
                            { id: 'd', code: 'for (let x of v) {', ind: 0 },
                            { id: 'e', code: 'if (x > maior) maior = x;', ind: 1 },
                            { id: 'f', code: '}', ind: 0 }, { id: 'g', code: 'console.log(maior);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'], python: ['a', 'b', 'c', 'd', 'e', 'f'], js: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
                },
                ...extras_m7
            ]
        );

        // ══ MÓDULO 8: ALGORITMOS CLÁSSICOS ══
        this.#addModule(
            {
                id: 'm8', nome: 'Algoritmos Clássicos', ico: '⚙️', cat: 'algoritmos',
                dif: 'exp', difTag: 'Expert', difClass: 'dt-exp', cor: 'var(--yellow)'
            },
            [
                {
                    id: 'm8q1', nome: 'Busca Linear', num: 1,
                    enunciado: 'Implemente a <strong>busca linear</strong> em um vetor de 5 elementos.',
                    dica: 'Percorra o vetor do início ao fim comparando cada elemento com o buscado.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "BuscaLinear"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'v : vetor[1..5] de inteiro', ind: 1 },
                            { id: 'd', code: 'i, chave, pos : inteiro', ind: 1 }, { id: 'e', code: 'inicio', ind: 0 },
                            { id: 'f', code: 'para i de 1 ate 5 faca leia(v[i]) fimpara', ind: 1 },
                            { id: 'g', code: 'leia(chave)', ind: 1 }, { id: 'h', code: 'pos <- -1', ind: 1 },
                            { id: 'i', code: 'para i de 1 ate 5 faca', ind: 1 },
                            { id: 'j', code: 'se v[i] = chave entao pos <- i fimse', ind: 2 },
                            { id: 'k', code: 'fimpara', ind: 1 },
                            { id: 'l', code: 'se pos > 0 entao', ind: 1 },
                            { id: 'm', code: 'escreval("Encontrado na pos: ", pos)', ind: 2 },
                            { id: 'n', code: 'senao escreval("Não encontrado") fimse', ind: 1 },
                            { id: 'o', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'v = [int(input(f"v[{i}]: ")) for i in range(5)]', ind: 0 },
                            { id: 'b', code: 'chave = int(input("Buscar: "))', ind: 0 },
                            { id: 'c', code: 'pos = -1', ind: 0 },
                            { id: 'd', code: 'for i in range(5):', ind: 0 },
                            { id: 'e', code: 'if v[i] == chave:', ind: 1 },
                            { id: 'f', code: 'pos = i', ind: 2 }, { id: 'g', code: 'break', ind: 2 },
                            { id: 'h', code: 'if pos >= 0:', ind: 0 },
                            { id: 'i', code: 'print(f"Encontrado na posição {pos}")', ind: 1 },
                            { id: 'j', code: 'else:', ind: 0 }, { id: 'k', code: 'print("Não encontrado")', ind: 1 },
                        ],
                        js: [
                            { id: 'a', code: 'let v = [];', ind: 0 },
                            { id: 'b', code: 'for (let i=0;i<5;i++) v.push(parseInt(prompt(`v[${i}]:`)));', ind: 0 },
                            { id: 'c', code: 'let chave = parseInt(prompt("Buscar:"));', ind: 0 },
                            { id: 'd', code: 'let pos = -1;', ind: 0 },
                            { id: 'e', code: 'for (let i=0;i<5;i++) {', ind: 0 },
                            { id: 'f', code: 'if (v[i] === chave) { pos = i; break; }', ind: 1 },
                            { id: 'g', code: '}', ind: 0 },
                            { id: 'h', code: 'console.log(pos >= 0 ? `Posição: ${pos}` : "Não encontrado");', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'], python: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], js: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
                },
                {
                    id: 'm8q2', nome: 'Bubble Sort', num: 2,
                    enunciado: 'Implemente o <strong>Bubble Sort</strong> para ordenar um vetor de 5 elementos.',
                    dica: 'Compare pares adjacentes e troque se estiver fora de ordem. Repita N-1 vezes.',
                    linhas: {
                        visualg: [
                            { id: 'a', code: 'algoritmo "BubbleSort"', ind: 0 }, { id: 'b', code: 'var', ind: 0 },
                            { id: 'c', code: 'v: vetor[1..5] de inteiro', ind: 1 },
                            { id: 'd', code: 'i, j, aux : inteiro', ind: 1 }, { id: 'e', code: 'inicio', ind: 0 },
                            { id: 'f', code: 'para i de 1 ate 5 faca leia(v[i]) fimpara', ind: 1 },
                            { id: 'g', code: 'para i de 1 ate 4 faca', ind: 1 },
                            { id: 'h', code: 'para j de 1 ate 5-i faca', ind: 2 },
                            { id: 'i', code: 'se v[j] > v[j+1] entao', ind: 3 },
                            { id: 'j', code: 'aux <- v[j]', ind: 4 }, { id: 'k', code: 'v[j] <- v[j+1]', ind: 4 },
                            { id: 'l', code: 'v[j+1] <- aux', ind: 4 }, { id: 'm', code: 'fimse', ind: 3 },
                            { id: 'n', code: 'fimpara', ind: 2 }, { id: 'o', code: 'fimpara', ind: 1 },
                            { id: 'p', code: 'para i de 1 ate 5 faca escreval(v[i]) fimpara', ind: 1 },
                            { id: 'q', code: 'fimalgoritmo', ind: 0 },
                        ],
                        python: [
                            { id: 'a', code: 'v = [int(input(f"v[{i}]: ")) for i in range(5)]', ind: 0 },
                            { id: 'b', code: 'for i in range(4):', ind: 0 },
                            { id: 'c', code: 'for j in range(4 - i):', ind: 1 },
                            { id: 'd', code: 'if v[j] > v[j+1]:', ind: 2 },
                            { id: 'e', code: 'v[j], v[j+1] = v[j+1], v[j]', ind: 3 },
                            { id: 'f', code: 'print(v)', ind: 0 },
                        ],
                        js: [
                            { id: 'a', code: 'let v = [];', ind: 0 },
                            { id: 'b', code: 'for (let i=0;i<5;i++) v.push(parseInt(prompt(`v[${i}]:`)));', ind: 0 },
                            { id: 'c', code: 'for (let i=0;i<4;i++) {', ind: 0 },
                            { id: 'd', code: 'for (let j=0;j<4-i;j++) {', ind: 1 },
                            { id: 'e', code: 'if (v[j] > v[j+1]) {', ind: 2 },
                            { id: 'f', code: 'let aux = v[j];', ind: 3 }, { id: 'g', code: 'v[j] = v[j+1];', ind: 3 },
                            { id: 'h', code: 'v[j+1] = aux;', ind: 3 }, { id: 'i', code: '}', ind: 2 },
                            { id: 'j', code: '}', ind: 1 }, { id: 'k', code: '}', ind: 0 },
                            { id: 'l', code: 'console.log(v);', ind: 0 },
                        ],
                    },
                    ordem: { visualg: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'], python: ['a', 'b', 'c', 'd', 'e', 'f'], js: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'] },
                },
                ...extras_m8
            ]
        );

        }
}

export default new QuestionBank();
