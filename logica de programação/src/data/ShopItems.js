export const ShopItems = [
    // ══ AVATARS ══════════════════════════════════════════════════
    {
        id: 'avatar_blue',
        type: 'avatar',
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
        price: 2500,
        icon: '🏅',
        style: { '--robot-primary': '#F6E05E', '--robot-secondary': '#D69E2E' }
    },
    {
        id: 'avatar_green',
        type: 'avatar',
        name: 'Androide Verde',
        desc: 'Para quem curte o estilo terminal retro.',
        price: 2500,
        icon: '📟',
        style: { '--robot-primary': '#00FFA3', '--robot-secondary': '#00B373' }
    },
    {
        id: 'avatar_magenta',
        type: 'avatar',
        name: 'Cyber Rosa',
        desc: 'Estilo neon futurista.',
        price: 2500,
        icon: '🌸',
        style: { '--robot-primary': '#ED64A6', '--robot-secondary': '#B83280' }
    },
    {
        id: 'avatar_ruby',
        type: 'avatar',
        name: 'Vermelho Ruby',
        desc: 'Um clássico ardente e rápido.',
        price: 2500,
        icon: '🔴',
        style: { '--robot-primary': '#F56565', '--robot-secondary': '#C53030' }
    },
    {
        id: 'avatar_luxury_gold',
        type: 'avatar',
        name: 'Robô de Ouro Puro',
        desc: 'Ostente suas habilidades com ouro 24k.',
        price: 10000,
        icon: '🟡',
        style: { '--robot-primary': '#FFD700', '--robot-secondary': '#B8860B', 'box-shadow': '0 0 15px #FFD700' }
    },
    {
        id: 'avatar_luxury_diamond',
        type: 'avatar',
        name: 'Robô de Diamante',
        desc: 'O ápice da perfeição e resistência.',
        price: 25000,
        icon: '💎',
        style: { '--robot-primary': '#E0FEFF', '--robot-secondary': '#9DE1EB', 'box-shadow': '0 0 15px #00F2FF' }
    },

    // ══ BACKGROUNDS ══════════════════════════════════════════════
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
        price: 10000,
        icon: '🟩',
        style: { '--app-bg-img': 'radial-gradient(circle at center, #022c16 0%, #000000 100%)', '--app-bg': '#000000' }
    },
    {
        id: 'bg_cyber',
        type: 'background',
        name: 'Hexágonos de Silício',
        desc: 'Estruturas roxas flutuando suavemente.',
        price: 10000,
        icon: '🌆',
        style: { '--app-bg-img': 'linear-gradient(135deg, #2d0a31 0%, #0f172a 100%)', '--app-bg': '#0f172a' }
    },
    {
        id: 'bg_space',
        type: 'background',
        name: 'Espaço Profundo',
        desc: 'O infinito escuro com estrelas ao fundo.',
        price: 10000,
        icon: '🌌',
        style: { '--app-bg-img': 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)', '--app-bg': '#090a0f' }
    },
    {
        id: 'bg_portal',
        type: 'background',
        name: 'Portão Dimensional (GIF)',
        desc: 'Um portal animado para outras realidades de código.',
        price: 15000,
        icon: '🌀',
        style: { '--app-bg-img': 'url("./assets/133C.gif")', 'background-size': 'cover', 'background-position': 'center' }
    },

    // ══ TITLES ═══════════════════════════════════════════════════
    {
        id: 'title_rookie',
        type: 'title',
        name: 'Novato (Padrão)',
        desc: 'O início de tudo.',
        price: 0,
        icon: '🔰',
        style: {}
    },
    {
        id: 'title_hacker',
        type: 'title',
        name: 'Hacker',
        desc: 'Mostre que você conhece os bastidores.',
        price: 5000,
        icon: '🥷',
        style: { 'color': '#00FF41' }
    },
    {
        id: 'title_wizard',
        type: 'title',
        name: 'Mago dos Códigos',
        desc: 'Transmuta bugs em soluções elegantes.',
        price: 5000,
        icon: '🧙‍♂️',
        style: { 'color': '#A78BFA' }
    },
    {
        id: 'title_neon',
        type: 'title',
        name: 'Lenda do Cyber-Espaço',
        desc: 'Título raro com brilho neon pulsante.',
        price: 8000,
        icon: '🌌',
        className: 'title-neon',
        style: { 'color': '#fff', 'text-shadow': '0 0 10px #ff00de' }
    },

    // ══ SPECIAL ITEMS (POWER-UPS) ════════════════════════════════
    {
        id: 'special_amulet',
        type: 'special',
        name: 'Amuleto de Ouro',
        desc: 'Item Lendário! DOBRA permanentemente seus ganhos de moedas.',
        price: 50000,
        icon: '✨',
        style: { 'border': '2px solid #FFD700', 'box-shadow': '0 0 10px #FFD700' }
    },
    {
        id: 'special_3pts',
        type: 'special',
        name: '3 Pontos Extras',
        desc: 'Desejo de todo aluno! Ganhe 3 pontos na nota escolar.',
        price: 100000,
        icon: '🎓',
        thumb: './assets/items/3_pontos_extras.png'
    },

    // ══ COMMUNITY (COLLECTIVE) ═══════════════════════════════════
    {
        id: 'community_movie',
        type: 'community',
        name: 'Dia de Filme na Escola',
        desc: 'Meta Coletiva! Colabore com 1 MILHÃO de moedas e ganhe um dia de cinema para a turma.',
        price: 1000000,
        icon: '🎬',
        thumb: './assets/items/dia_de_filme.png',
        isCollective: true
    }
];
