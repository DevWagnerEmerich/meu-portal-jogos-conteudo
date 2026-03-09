export const ShopItems = [
    // Avatars
    {
        id: 'avatar_blue',
        type: 'avatar',
        name: 'Azul Clássico',
        name: 'Robô Azul (Padrão)',
        desc: 'O companheiro clássico de aventuras lógicas.',
        price: 0,
        icon: '🤖',
        style: { '--robot-primary': '#38BEFF', '--robot-secondary': '#1D90D6' }
    },
    {
        id: 'avatar_gold',
        type: 'avatar',
        name: 'Dourado Metálico',
        desc: 'Para os programadores de elite.',
        price: 50,
        icon: '🏅',
        style: { '--robot-primary': '#F6E05E', '--robot-secondary': '#D69E2E' }
    },
    {
        id: 'avatar_green',
        type: 'avatar',
        name: 'Androide Verde',
        desc: 'Para quem curte o estilo terminal retro.',
        price: 50,
        icon: '�',
        style: { '--robot-primary': '#00FFA3', '--robot-secondary': '#00B373' }
    },
    {
        id: 'avatar_magenta',
        type: 'avatar',
        name: 'Cyber Rosa',
        desc: 'Estilo neon futurista.',
        price: 50,
        icon: '🌸',
        style: { '--robot-primary': '#ED64A6', '--robot-secondary': '#B83280' }
    },
    {
        id: 'avatar_ruby',
        type: 'avatar',
        name: 'Vermelho Ruby',
        desc: 'Um clássico ardente e rápido.',
        price: 50,
        icon: '🔴',
        style: { '--robot-primary': '#F56565', '--robot-secondary': '#C53030' }
    },

    // Backgrounds
    {
        id: 'bg_dark',
        type: 'background',
        name: 'Tema Escuro (Padrão)',
        desc: 'Fundo liso perfeito para os olhos noturnos.',
        price: 0,
        icon: '🌙',
        style: { '--app-bg': '#0f172a' }
    },
    {
        id: 'bg_matrix',
        type: 'background',
        name: 'Rede Neural',
        desc: 'Nós interconectados de energia brilhando em verde.',
        price: 150,
        icon: '🟩',
        style: { '--app-bg-img': 'radial-gradient(circle at center, #022c16 0%, #000000 100%)', '--app-bg': '#000000' }
    },
    {
        id: 'bg_cyber',
        type: 'background',
        name: 'Hexágonos de Silício',
        desc: 'Estruturas roxas flutuando suavemente em um vazio digital.',
        price: 150,
        icon: '🌆',
        style: { '--app-bg-img': 'linear-gradient(135deg, #2d0a31 0%, #0f172a 100%)', '--app-bg': '#0f172a' }
    },
    {
        id: 'bg_space',
        type: 'background',
        name: 'Espaço Profundo',
        desc: 'O infinito escuro com estrelas ao fundo.',
        price: 150,
        icon: '🌌',
        style: { '--app-bg-img': 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)', '--app-bg': '#090a0f' }
    },

    // Titles (Text Badges next to name)
    {
        id: 'title_rookie',
        type: 'title',
        name: 'Novato (Padrão)',
        desc: 'O início de tudo.',
        price: 0,
        icon: '🔰',
        style: {} // Handled specially in UI or skipped (just shows the icon/text next to name)
    },
    {
        id: 'title_hacker',
        type: 'title',
        name: 'Hacker',
        desc: 'Mostre que você conhece os bastidores.',
        price: 30,
        icon: '🥷',
        style: {}
    },
    {
        id: 'title_wizard',
        type: 'title',
        name: 'Mago dos Códigos',
        desc: 'Transmuta bugs em soluções elegantes.',
        price: 30,
        icon: '🧙‍♂️',
        style: {}
    }
];
