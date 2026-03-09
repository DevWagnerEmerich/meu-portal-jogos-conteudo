/**
 * SyntaxHighlighter — Tokenizer-based code highlight
 *
 * Uses a proper tokenizer (single-pass regex) that prevents patterns
 * from matching inside already-inserted span tags.
 *
 * Strategy: build one mega-regex, scan left-to-right, emit spans.
 */
class SyntaxHighlighter {

    // Each language defines an ordered list of [cls, pattern] pairs.
    // The FIRST pattern that matches wins (no double-matching).
    #rules = {
        visualg: [
            ['cmt', /\/\/.*/],
            ['str', /"[^"]*"/],
            ['str', /'[^']*'/],
            ['kw', /\b(algoritmo|fimalgoritmo|var|inicio|fimse|fimpara|fimenquanto|fimfuncao|fimrepita|fim|inteiro|real|logico|caractere|vetor|de|repita|ate|escreva|escreval|leia|se|entao|senao|fimse|para|faca|fimpara|enquanto|e|ou|nao|verdadeiro|falso|mod|div|funcao|procedimento|retorne)\b/i],
            ['num', /\b\d+\.?\d*\b/],
        ],
        python: [
            ['cmt', /#.*/],
            ['str', /"""[\s\S]*?"""/],
            ['str', /'''[\s\S]*?'''/],
            ['str', /"[^"]*"/],
            ['str', /'[^']*'/],
            ['kw', /\b(def|class|if|elif|else|for|while|return|import|from|in|not|and|or|True|False|None|break|continue|pass|lambda|try|except|with|as|is|yield|raise|global|nonlocal|del|assert|async|await)\b/],
            ['fn', /\b(print|input|int|float|str|list|dict|tuple|set|len|range|sorted|reversed|sum|min|max|abs|type|isinstance|enumerate|zip|map|filter|open|super)\b/],
            ['num', /\b\d+\.?\d*\b/],
        ],
        js: [
            ['cmt', /\/\/.*/],
            ['cmt', /\/\*[\s\S]*?\*\//],
            ['str', /`[^`]*`/],
            ['str', /"[^"]*"/],
            ['str', /'[^']*'/],
            ['kw', /\b(var|let|const|function|if|else|for|while|return|true|false|null|undefined|new|class|import|export|from|of|in|typeof|instanceof|break|continue|switch|case|default|do|try|catch|finally|async|await|void|delete|throw|this|super)\b/],
            ['fn', /\b(console\.log|console\.error|console\.warn|alert|prompt|confirm|parseInt|parseFloat|Math\.\w+|Array\.\w+|Object\.\w+|JSON\.\w+|document\.\w+|window\.\w+|setTimeout|setInterval|clearTimeout|clearInterval|fetch|Promise|querySelector|getElementById)\b/],
            ['num', /\b\d+\.?\d*\b/],
        ],
    };

    /**
     * Highlight a code string with a single-pass tokenizer.
     * @param {string} code   — raw source code
     * @param {string} lang   — 'visualg' | 'python' | 'js'
     * @returns {string}      — safe HTML string with <span> tags
     */
    highlight(code, lang) {
        const rules = this.#rules[lang];
        if (!rules || !code) return this.#escape(code || '');

        // Build a single combined regex: each group corresponds to one rule
        const combined = new RegExp(
            rules.map(([, re]) => `(${re.source})`).join('|'),
            'g'
        );

        let result = '';
        let lastIdx = 0;
        let m;

        while ((m = combined.exec(code)) !== null) {
            // Emit plain text before this match (HTML-escaped)
            if (m.index > lastIdx) {
                result += this.#escape(code.slice(lastIdx, m.index));
            }

            // Find which group matched (groups are 1-indexed)
            let cls = 'plain';
            for (let i = 0; i < rules.length; i++) {
                if (m[i + 1] !== undefined) { cls = rules[i][0]; break; }
            }

            result += `<span class="${cls}">${this.#escape(m[0])}</span>`;
            lastIdx = combined.lastIndex;
        }

        // Emit any remaining plain text
        if (lastIdx < code.length) {
            result += this.#escape(code.slice(lastIdx));
        }

        return result;
    }

    /** Escape HTML special characters */
    #escape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

export default new SyntaxHighlighter();
