# 🧙‍♂️ Forca Mágica — PWA

Jogo da Forca interativo para crianças dos anos iniciais do Ensino Fundamental.

## ✨ Funcionalidades

- **6 categorias temáticas**: Animais, Frutas, Cores, Escola, Natureza, Corpo
- **60 palavras** com dicas contextuais e emojis para cada uma
- **Personagem animado** que aparece progressivamente (6 partes)
- **Sons** de acerto, erro, vitória e derrota
- **Confetes** na vitória
- **Sistema de pontuação** por estrelas
- **Teclado virtual** + suporte ao teclado físico
- **PWA** — funciona offline, pode ser instalado no celular
- **Design responsivo** para mobile e tablet

## 📁 Arquivos

```
forca-pwa/
├── index.html      ← Jogo completo (HTML + CSS + JS)
├── manifest.json   ← Configuração PWA
├── sw.js           ← Service Worker (modo offline)
├── icon-192.png    ← Ícone PWA 192×192
└── icon-512.png    ← Ícone PWA 512×512
```

## 🚀 Como usar

### Opção 1 — Servidor local (para testar)
```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .
```
Acesse: `http://localhost:8080`

### Opção 2 — Deploy gratuito (recomendado)

**Netlify (mais fácil):**
1. Acesse netlify.com
2. Arraste a pasta `forca-pwa` para o site
3. Pronto! URL gerada automaticamente

**Vercel:**
```bash
npx vercel --name forca-magica
```

**GitHub Pages:**
1. Suba os arquivos para um repositório público
2. Ative Pages em Settings > Pages > Branch: main

## 📱 Instalar no celular

1. Abra o jogo no Chrome ou Safari
2. Toque em "Adicionar à tela inicial"
3. O jogo aparece como um app nativo!

## 🎯 Pedagogia

- Palavras selecionadas pelo currículo dos anos 1–3
- Dicas com contexto semântico (não só definição)
- Emojis para reforço visual e associação
- Pontuação incentiva persistência (mais erros = menos pontos, mas nunca zero na vitória)
- Feedback positivo mesmo após derrota

## 🔧 Personalizar

Para adicionar palavras, edite o objeto `categories` no `index.html`:
```js
animais: {
  words: [
    { word: 'DINOSSAURO', hint: 'Animal extinto enorme! 🦕' },
    // ...
  ]
}
```

> Palavras com acento: o jogo trata automaticamente o mapeamento de letras.
> Para palavras com Ã, Ç, etc., inclua a letra sem acento (ex: MAO em vez de MÃO).
