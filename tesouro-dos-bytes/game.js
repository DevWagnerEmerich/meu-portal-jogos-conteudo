/* ════════════════════════════════════════
       ESTADO GLOBAL
    ════════════════════════════════════════ */
const R = { bal: 46, ov: 44, virgula: 280, ponto: 420, aposTexto: 750, entreOp: 340, aposResp: 700, aposEnt: 500, aposOv: 800 };
let trilhaAtual = null, PERGUNTAS = [], NIVEIS = [];
let idx = 0, acertos = 0, erros = 0, moedas = 0, vidas = 3, bloqueado = false;
let assocSelecionadoEsq = null, assocFeitos = 0;
let edTrilhaId = null, edEmoji = '🎯', edCor = '#5bcbff', edPerguntas = [], editandoPergIdx = null, tipoAtual = 'multipla';

/* ════ STORAGE ════ */
function getMoedas() { return parseInt(localStorage.getItem('bytes_moedas') || '0'); }
function setMoedas(v) { localStorage.setItem('bytes_moedas', v); }
function getProgresso(id) { return JSON.parse(localStorage.getItem('bytes_prog_' + id) || '{}'); }
function setProgresso(id, pct, ac) { const a = getProgresso(id); localStorage.setItem('bytes_prog_' + id, JSON.stringify({ pct: Math.max(pct, a.pct || 0), acertos: Math.max(ac, a.acertos || 0), jogadas: (a.jogadas || 0) + 1 })); }
function getCustomTrilhas() { return JSON.parse(localStorage.getItem('bytes_custom') || '[]'); }
function setCustomTrilhas(arr) { localStorage.setItem('bytes_custom', JSON.stringify(arr)); }
function getItensComprados() { return JSON.parse(localStorage.getItem('bytes_inventario') || '[]'); }
function setItensComprados(arr) { localStorage.setItem('bytes_inventario', JSON.stringify(arr)); }
function getPetEquipado() { return localStorage.getItem('bytes_pet') || 'robo'; }
function setPetEquipado(id) { localStorage.setItem('bytes_pet', id); }
function getPoderesAtivos() { return JSON.parse(localStorage.getItem('bytes_poderes') || '[]'); }
function getNomeJogador() { return localStorage.getItem('bytes_nome') || ''; }
function setNomeJogador(n) { localStorage.setItem('bytes_nome', n); }
function isFirstVisit() { return !localStorage.getItem('bytes_nome'); }
function getAllTrilhas() { return [...TRILHAS_FIXAS, ...getCustomTrilhas()]; }

/* ════ PERSONALIDADES DOS APRESENTADORES ════ */
const PET_PERSONALIDADE = {
  robo: {
    saudacao: (trilha, total) => `Olá! Sou o BYTE-BOT! Pronto para a trilha de ${trilha}? São ${total} desafios! BEEP-BOP!`,
    entrePergunta: ['Processando resposta... Próxima pergunta!', 'BEEP! Continue assim, humano-aluno!', 'Dados analisados! Vamos mais um!', 'Circuitos a todo vapor! Próximo!', 'BEEEP! Você está indo bem!'],
    vitoria: 'CÁLCULO FINALIZADO: você foi incrível! BYTE-BOT aprova! 🤖',
    gameover: 'Sem energia... Mas errar é parte do aprendizado! Recarregue e tente de novo! 🔋'
  },
  gato: {
    saudacao: (trilha, total) => `Miau! 🐱 Sou o Gatinho e adorei essa trilha de ${trilha}! São ${total} perguntas fofas! Vamos nessa!`,
    entrePergunta: ['Miau! Essa foi boa! Próxima!', 'Purrrr! Continue assim!', 'Miau miau! Mais uma pergunta!', 'Ronron... Você está arrasando!', 'Nyaa! Mais um desafio para o(a) campeão(ã)!'],
    vitoria: 'MIAU! Que jogador(a) incrível! Você me conquistou! 🐾',
    gameover: 'Miau triste... 🙀 Mas não desiste! Me pata-confortando, tente de novo!'
  },
  cao: {
    saudacao: (trilha, total) => `Au au! 🐶 Boa tarde! Sou o Cachorrão! Trilha de ${trilha} com ${total} bolas para buscar! VAMOs!`,
    entrePergunta: ['Au au! Isso mesmo! Próxima!', 'Bom menino/menina! Continue!', 'AU! Você arrasou! Bora mais!', 'Latiu certo! Mais uma!', 'Au au au! Conseguiu! Próxima pergunta!'],
    vitoria: 'AU AU AU! Você é o melhor humano do mundo! Quero ser seu amigo forever! 🦮',
    gameover: 'Au triste... 🐕 Não esquenta! Cachorros bons caem e levantam a rabinho! Tente de novo!'
  },
  panda: {
    saudacao: (trilha, total) => `Oi oi! 🐼 Sou o Pandinha, o mais fofinho! Trilha de ${trilha} com ${total} perguntinhas deliciosas como bambu! Vamos lá!`,
    entrePergunta: ['Eba! Muito bem! Próxima!', 'Rolo-panda de felicidade! Continue!', 'Fofooooo! Mais uma!', 'Que fase boa! Vamos mais!', 'Pandinha aprova! Próximo desafio!'],
    vitoria: 'INCRÍVEL! Você é mais fofinho que eu! E isso é muito! 🎋',
    gameover: 'Ooooh nooo... 😢 Mas Pandinha acredita em você! Bambu e tente de novo!'
  },
  dragao: {
    saudacao: (trilha, total) => `RRROAAR! 🐲 Sou o Dragãozinho! A trilha de ${trilha} tem ${total} desafios de FOGO! Prepare-se!`,
    entrePergunta: ['RROAAR! Isso mesmo! Queimou!', 'Fogo nos acertos! Continue!', 'GRAAR! Mais um desafio de fogo!', 'Dragão aprova! Próximo!', 'ROAAR! Imparável! Vamos lá!'],
    vitoria: 'ROOOOAR! ÉPICO! Você derrotou todos os desafios! Lendário! 🔥',
    gameover: 'Dragão entristece... 😔 Mas até dragões treinam para ficar mais fortes! Tente de novo!'
  },
  unicorn: {
    saudacao: (trilha, total) => `✨ Sou o Unicórnio mágico! A trilha de ${trilha} tem ${total} perguntas encantadas! Prepare sua magia!`,
    entrePergunta: ['✨ Magia do acerto! Próxima!', 'Arco-íris de sabedoria! Continue!', '🌈 Mais uma pergunta encantada!', 'Que mágico você é! Vamos lá!', '✨ Encantado! Próximo desafio!'],
    vitoria: '🦄✨ INCRÍVEL! Você tem magia verdadeira! Arco-íris para sempre!',
    gameover: '🌧️ Uhh... Nem toda poção funciona na 1ª vez! Mais magia e tente de novo!'
  },
  alien: {
    saudacao: (trilha, total) => `👾 BZZZT... Análise iniciada! Sou o Alienígena! Trilha ${trilha} com ${total} questões identificadas! Missão aceita!`,
    entrePergunta: ['👾 Transmissão recebida! Próxima!', 'BZZZT! Conhecimento absorvido!', 'Planeta Terra é incrível! Mais uma!', '👾 Missão continuando! Vamos!', 'Análise concluída! Próxima questão!'],
    vitoria: '👾 BZZZT! MISSÃO COMPLETA! Humano aprovado para explorar o universo!',
    gameover: '📡 Sinal perdido... Mas alienígenas nunca desistem! Conecte de novo!'
  },
  dinossauro: {
    saudacao: (trilha, total) => `🦕 RAWRR! Sou o Dinossauro, mais antigo que a internet! Trilha de ${trilha} com ${total} perguntas pré-históricas! RAWRR!`,
    entrePergunta: ['RAWRR! Isso mesmo! Próxima!', 'Dino aprova! Continue rugindo!', '🦕 RAWRR! Mais uma questão!', 'Ancestral e sábio! Vamos mais!', 'RAWRR RAWRR! Imparável!'],
    vitoria: '🦕 RAWRR RAWRR RAWRR! Você sobreviveu ao asteroide dos estudos! ÉPICO!',
    gameover: 'RAWRR triste... 🦖 Nem os dinos acertaram tudo de primeira! Fossilize e tente de novo!'
  },
};

function getPetFala(tipo, trilhaNome, total) {
  const pet = getPetEquipado();
  const p = PET_PERSONALIDADE[pet] || PET_PERSONALIDADE.robo;
  if (tipo === 'saudacao') return p.saudacao(trilhaNome, total);
  if (tipo === 'vitoria') return p.vitoria;
  if (tipo === 'gameover') return p.gameover;
  // entre_pergunta: array aleatório
  const arr = p.entrePergunta;
  return arr[~~(Math.random() * arr.length)];
}

/* ════ UTILITÁRIOS ════ */
const $ = id => document.getElementById(id);
const esperar = ms => new Promise(r => setTimeout(r, ms));
function animarRobo(cls) {
  const r = $('robo-svg'); if (r) { r.className = ''; void r.offsetWidth; r.className = cls; }
  const p = $('pet-arena'); if (p) { p.className = ''; void p.offsetWidth; p.className = cls; }
}
function atualizarMoedas() { $('val-moedas').textContent = moedas + ' BM'; }
function atualizarVidas() { $('val-vidas').textContent = '❤️'.repeat(vidas) + '🖤'.repeat(Math.max(0, 3 - vidas)); }
function embaralharArr(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = ~~(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } }
function getPetEmoji() { const pet = LOJA_PETS.find(p => p.id === getPetEquipado()); return pet ? pet.emoji : '🤖'; }
function atualizarPets() {
  const eq = getPetEquipado();
  const e = getPetEmoji();
  const isRobo = eq === 'robo';

  const hs = document.querySelector('.hero-robo-wrap svg'); if (hs) hs.style.display = isRobo ? 'block' : 'none';
  const hp = $('pet-hero-el'); if (hp) { hp.style.display = isRobo ? 'none' : 'block'; hp.textContent = e; }

  const as = $('robo-svg'); if (as) as.style.display = isRobo ? 'block' : 'none';
  const ap = $('pet-arena'); if (ap) { ap.style.display = isRobo ? 'none' : 'block'; ap.textContent = e; }

  const os = $('robo-ov'); if (os) os.style.display = isRobo ? 'block' : 'none';
  const op = $('pet-ov'); if (op) { op.style.display = isRobo ? 'none' : 'block'; op.textContent = e; }

  const f = $('fim-pet-celebra'); if (f) f.textContent = isRobo ? '🤖' : e;
  const s = $('stat-pet'); if (s) s.textContent = isRobo ? '🤖' : e;
}
function piscarOlhos() { ['ol-e', 'ol-d', 'ov-e', 'ov-d'].forEach(id => { const el = $(id); if (!el) return; const c = el.getAttribute('fill'); el.setAttribute('fill', '#10102a'); setTimeout(() => el.setAttribute('fill', c), 120); }); }
setInterval(() => piscarOlhos(), 4200 + Math.random() * 3000);
function confetes() { const cores = ['#ffd700', '#3ddc84', '#5bcbff', '#c084fc', '#ff5c5c', '#ffb347', '#ff79c6']; for (let i = 0; i < 26; i++)setTimeout(() => { const c = document.createElement('div'); c.className = 'confete'; c.style.cssText = `left:${Math.random() * 100}vw;top:-10px;width:${5 + Math.random() * 9}px;height:${5 + Math.random() * 9}px;background:${cores[~~(Math.random() * cores.length)]};animation-duration:${1 + Math.random() * 1}s;`; document.body.appendChild(c); setTimeout(() => c.remove(), 2200); }, i * 40); }
function notifBM(ref, qtd = 10) { const rect = ref.getBoundingClientRect(); const n = document.createElement('div'); n.className = 'notif-bm'; n.textContent = '+' + qtd + ' 💰'; n.style.left = (rect.left + rect.width / 2 - 35) + 'px'; n.style.top = (rect.top + window.scrollY - 10) + 'px'; document.body.appendChild(n); setTimeout(() => n.remove(), 1600); }
function maq(elTxt, elCur, texto, ms) { return new Promise(async res => { elTxt.textContent = ''; elCur.classList.remove('off'); for (let i = 0; i < texto.length; i++) { const c = texto[i]; elTxt.textContent += c; let p = ms; if (c === ',' || c === ';') p += R.virgula; else if (c === '.' || c === '!' || c === '?') p += R.ponto; await esperar(p); } elCur.classList.add('off'); res(); }); }
function showTela(id) { document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativo')); const el = $(id); if (el) el.classList.add('ativo'); }
function toast(msg, erro = false) { const el = $('toast'); el.textContent = msg; el.className = 'toast' + (erro ? ' erro-t' : ''); void el.offsetWidth; el.classList.add('ativo'); setTimeout(() => el.classList.remove('ativo'), 2600); }
function mostrarSec(sec) { $('sec-trilhas').style.display = sec === 'trilhas' ? 'block' : 'none'; $('sec-loja').style.display = sec === 'loja' ? 'block' : 'none'; $('tab-trilhas').classList.toggle('ativo', sec === 'trilhas'); $('tab-loja').classList.toggle('ativo', sec === 'loja'); if (sec === 'loja') renderizarLoja(); }

/* ════════════════════════════════════════
   TELA INICIAL
════════════════════════════════════════ */
function mostrarTelaInicio() {
  showTela('tela-inicio');
  $('tela-fim').style.display = 'none';
  $('overlay').classList.remove('ativo');
  $('btn-home').classList.remove('vis');
  $('btn-loja-cab').classList.remove('vis');
  moedas = getMoedas(); atualizarMoedas(); atualizarPets();
  $('stat-moedas').textContent = moedas;
  const todas = getAllTrilhas();
  $('stat-trilhas').textContent = todas.filter(t => getProgresso(t.id).pct === 100).length;
  const wrap = $('trilhas-wrap'); wrap.innerHTML = '';
  todas.forEach(t => wrap.appendChild(criarCardTrilha(t)));
  const nova = document.createElement('div'); nova.className = 'card-nova';
  nova.innerHTML = '<span>➕</span><span>CRIAR TRILHA</span>';
  nova.onclick = () => abrirEditor();
  wrap.appendChild(nova);
  mostrarSec('trilhas');
}

function abrirLoja() { mostrarTelaInicio(); mostrarSec('loja'); }
function irLojaFim() { mostrarTelaInicio(); mostrarSec('loja'); }

function criarCardTrilha(t) {
  const prog = getProgresso(t.id); const pct = prog.pct || 0;
  let sc, st;
  if (pct === 100) { sc = 'ok'; st = '✅ Completo'; }
  else if (pct > 0) { sc = 'parcial'; st = '⏳ ' + pct + '%'; }
  else { sc = 'novo'; st = '🆕 Novo'; }
  const isC = !!t.isCustom;
  const card = document.createElement('div');
  card.className = 'card-trilha' + (isC ? ' custom-card' : '');
  card.style.setProperty('--ct', t.cor);
  card.innerHTML = `
    <div class="ct-top"><div class="ct-emoji">${t.emoji}</div><div class="ct-info"><div class="ct-nome">${t.nome}</div><div class="ct-desc">${t.desc}</div></div></div>
    <div class="ct-bar-bg"><div class="ct-bar-fill" style="width:${pct}%"></div></div>
    <div class="ct-meta"><span class="ct-pergs">📝 ${(t.perguntas || []).length || 20} pergs</span><span class="ct-status ${sc}">${st}</span></div>
    ${isC ? `<div style="display:flex;gap:5px;margin-top:4px"><button style="flex:1;font-family:var(--px);font-size:4px;padding:4px;border:1px solid var(--muted);border-radius:4px;background:none;color:var(--muted);cursor:pointer" onclick="event.stopPropagation();editarTrilha('${t.id}')">✏️ EDITAR</button></div>` : ''}
  `;
  card.onclick = () => iniciarTrilha(t.id);
  return card;
}

/* ════════════════════════════════════════
   LOJA
════════════════════════════════════════ */
function renderizarLoja() {
  const comprados = getItensComprados();
  const petAtual = getPetEquipado();
  moedas = getMoedas();
  $('loja-saldo').textContent = '💰 Seu saldo: ' + moedas + ' Bytes-Moedas';

  // PETS
  const gPets = $('grid-pets'); gPets.innerHTML = '';
  LOJA_PETS.forEach(pet => {
    const comprado = pet.gratis || comprados.includes(pet.id);
    const equipado = petAtual === pet.id;
    const semMoeda = !comprado && moedas < pet.preco;
    const div = document.createElement('div');
    div.className = 'item-loja' + (comprado ? ' comprado' : '') + (equipado ? ' equipado' : '') + (semMoeda ? ' sem-moeda' : '');
    if (equipado) div.innerHTML += '<div class="il-badge equipado-b">EQUIPADO</div>';
    if (!comprado && pet.preco <= 80) div.innerHTML += '<div class="il-badge novo-b">NOVO!</div>';
    div.innerHTML += `
      <span class="il-emoji">${pet.emoji}</span>
      <div class="il-nome">${pet.nome}</div>
      <div class="il-desc">${pet.desc}</div>
      ${pet.gratis ? '<div class="il-preco" style="color:var(--green)">✅ GRÁTIS</div>' :
        comprado ? '<div class="il-preco" style="color:var(--green)">✅ COMPRADO</div>' :
          `<div class="il-preco">💰 ${pet.preco} BM</div>`}
    `;
    if (comprado && !equipado) {
      const btn = document.createElement('button'); btn.className = 'il-btn equipar'; btn.textContent = '🐾 EQUIPAR';
      btn.onclick = () => { setPetEquipado(pet.id); atualizarPets(); renderizarLoja(); toast('🎉 ' + pet.nome + ' equipado!'); };
      div.appendChild(btn);
    } else if (equipado) {
      const btn = document.createElement('button'); btn.className = 'il-btn equipado-btn'; btn.textContent = '⭐ USANDO';
      div.appendChild(btn);
    } else if (!comprado) {
      const btn = document.createElement('button'); btn.className = 'il-btn comprar'; btn.textContent = '🛒 COMPRAR';
      btn.disabled = semMoeda;
      btn.onclick = () => comprarItem(pet.id, pet.preco, pet.nome, 'pet');
      div.appendChild(btn);
    }
    gPets.appendChild(div);
  });

  // PODERES
  const gPod = $('grid-poderes'); gPod.innerHTML = '';
  LOJA_PODERES.forEach(pod => {
    const comprado = comprados.includes(pod.id);
    const semMoeda = !comprado && moedas < pod.preco;
    const div = document.createElement('div');
    div.className = 'item-loja' + (comprado ? ' comprado' : '') + (semMoeda ? ' sem-moeda' : '');
    if (!comprado && pod.preco <= 80) div.innerHTML = '<div class="il-badge novo-b">NOVO!</div>';
    div.innerHTML += `
      <span class="il-emoji">${pod.emoji}</span>
      <div class="il-nome">${pod.nome}</div>
      <div class="il-desc">${pod.desc}</div>
      ${comprado ? '<div class="il-preco" style="color:var(--green)">✅ ATIVO</div>' :
        `<div class="il-preco">💰 ${pod.preco} BM</div>`}
    `;
    if (!comprado) {
      const btn = document.createElement('button'); btn.className = 'il-btn comprar'; btn.textContent = '🛒 COMPRAR';
      btn.disabled = semMoeda;
      btn.onclick = () => comprarItem(pod.id, pod.preco, pod.nome, 'poder');
      div.appendChild(btn);
    } else {
      const btn = document.createElement('button'); btn.className = 'il-btn equipado-btn'; btn.textContent = '⚡ ATIVO';
      div.appendChild(btn);
    }
    gPod.appendChild(div);
  });
}

function comprarItem(id, preco, nome, tipo) {
  moedas = getMoedas();
  if (moedas < preco) { toast('💸 Moedas insuficientes!', true); return; }
  moedas -= preco; setMoedas(moedas); atualizarMoedas();
  const inv = getItensComprados(); inv.push(id); setItensComprados(inv);
  if (tipo === 'pet') { setPetEquipado(id); atualizarPets(); }
  confetes();
  toast('🎉 ' + nome + ' comprado!');
  renderizarLoja();
  $('loja-saldo').textContent = '💰 Seu saldo: ' + moedas + ' Bytes-Moedas';
}

/* ════════════════════════════════════════
   INICIAR TRILHA
════════════════════════════════════════ */
async function iniciarTrilha(id) {
  trilhaAtual = id;
  const todas = getAllTrilhas();
  const meta = todas.find(t => t.id === id);
  if (!meta) { toast('Trilha não encontrada!', true); return; }
  if (BANCO[id]) {
    // Embaralha o pool e seleciona 20 perguntas aleatórias — garante variedade em cada repetição
    const pool = [...BANCO[id].perguntas];
    embaralharArr(pool);
    PERGUNTAS = pool.slice(0, 20);
    NIVEIS = BANCO[id].niveis;
  }
  else { PERGUNTAS = meta.perguntas || []; NIVEIS = meta.niveis || []; }
  if (!PERGUNTAS.length) { toast('Esta trilha não tem perguntas ainda!', true); return; }

  // Poder: vidas extra
  const poderes = getItensComprados();
  acertos = 0; erros = 0; idx = 0; bloqueado = false;
  vidas = poderes.includes('vidas_extra') ? 4 : 3;
  moedas = getMoedas();
  atualizarMoedas(); atualizarVidas(); atualizarPets();

  showTela('arena');
  $('tela-fim').style.display = 'none';
  $('overlay').classList.remove('ativo');
  $('nivel-badge').style.display = 'none';
  $('area-resposta').innerHTML = '';
  $('btn-home').classList.add('vis');
  $('btn-loja-cab').classList.add('vis');

  const tb = $('trilha-badge');
  tb.style.display = 'block';
  tb.style.background = `linear-gradient(135deg,${meta.cor}22,${meta.cor}11)`;
  tb.style.border = `2px solid ${meta.cor}`;
  tb.style.color = meta.cor;
  tb.style.boxShadow = `0 0 16px ${meta.cor}44,4px 4px 0 #000`;
  tb.textContent = meta.emoji + '  TRILHA: ' + meta.nome;

  animarRobo('rf');
  await maq($('balao-txt'), $('balao-cur'), getPetFala('saudacao', meta.nome, PERGUNTAS.length), R.bal);
  animarRobo('ri');
  await esperar(1500);
  await carregarPergunta();
}

function reiniciarTrilha() { if (trilhaAtual) iniciarTrilha(trilhaAtual); }
function voltarInicio() { mostrarTelaInicio(); }

/* ════════════════════════════════════════
   JOGO
════════════════════════════════════════ */
async function carregarPergunta() {
  if (idx >= PERGUNTAS.length) { mostrarFim(); return; }
  bloqueado = true;
  const p = PERGUNTAS[idx]; const total = PERGUNTAS.length;
  const nivel = NIVEIS.find(n => n.inicio === idx);
  if (nivel) {
    $('nivel-badge').style.display = 'block';
    $('nivel-nome-txt').textContent = nivel.nome;
    animarRobo('rf');
    await maq($('balao-txt'), $('balao-cur'), nivel.fala, R.bal);
    animarRobo('ri');
    await esperar(1700);
    $('nivel-badge').style.display = 'none';
  }
  $('num-pergunta').textContent = `PERGUNTA ${idx + 1} DE ${total}`;
  $('barra-fill').style.width = ((idx / total) * 100) + '%';
  const TIPOS = { multipla: ['multipla', 'MÚLTIPLA ESCOLHA'], vf: ['vf', 'VERDADEIRO / FALSO'], completar: ['completar', 'COMPLETAR A FRASE'], ordenar: ['ordenar', 'COLOCAR EM ORDEM'], associar: ['associar', 'ASSOCIAR PARES'], lacuna: ['lacuna', 'PREENCHER LACUNA'] };
  const [tc, tn] = TIPOS[p.tipo] || ['multipla', 'MÚLTIPLA ESCOLHA'];
  const tb = $('tipo-badge'); tb.className = `tipo-badge ${tc}`; tb.textContent = tn;
  $('area-resposta').innerHTML = '';
  animarRobo('rf');
  await maq($('balao-txt'), $('balao-cur'), p.pergunta, R.bal);
  animarRobo('ri');
  await esperar(R.aposTexto);
  await renderizarTipo(p);
  bloqueado = false;
}

async function renderizarTipo(p) {
  const ar = $('area-resposta'); const letras = ['A', 'B', 'C', 'D'];
  if (p.tipo === 'multipla') {
    for (let i = 0; i < p.opcoes.length; i++) {
      const btn = document.createElement('button'); btn.className = 'btn-op';
      btn.innerHTML = `<span class="letra">${letras[i]}</span>${p.opcoes[i]}`;
      btn.onclick = () => resolverMultipla(i, btn, p);
      ar.appendChild(btn); await esperar(55); btn.classList.add('vis');
      if (i < p.opcoes.length - 1) await esperar(R.entreOp);
    }
  }
  else if (p.tipo === 'vf') {
    const wrap = document.createElement('div'); wrap.id = 'vf-wrap';
    const btnV = document.createElement('button'); btnV.className = 'btn-vf';
    btnV.innerHTML = '<span class="vf-emoji">✅</span>VERDADEIRO';
    btnV.onclick = () => resolverVF(true, btnV, btnF, p);
    const btnF = document.createElement('button'); btnF.className = 'btn-vf';
    btnF.innerHTML = '<span class="vf-emoji">❌</span>FALSO';
    btnF.onclick = () => resolverVF(false, btnF, btnV, p);
    wrap.appendChild(btnV); wrap.appendChild(btnF); ar.appendChild(wrap);
    await esperar(55); btnV.classList.add('vis'); await esperar(R.entreOp); btnF.classList.add('vis');
  }
  else if (p.tipo === 'completar') {
    const wrap = document.createElement('div'); wrap.id = 'completar-wrap';
    if (p.dica) { const d = document.createElement('p'); d.style.cssText = 'font-family:var(--px);font-size:5px;color:var(--muted);margin-bottom:4px'; d.textContent = p.dica; wrap.appendChild(d); }
    const inp = document.createElement('input'); inp.type = 'text'; inp.id = 'input-completar'; inp.placeholder = 'Digite sua resposta...';
    const btn = document.createElement('button'); btn.id = 'btn-confirmar-completar'; btn.textContent = '✅ CONFIRMAR';
    btn.onclick = () => resolverCompletar(inp.value.trim(), inp, p);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    wrap.appendChild(inp); wrap.appendChild(btn); ar.appendChild(wrap);
    await esperar(300); inp.focus();
  }
  else if (p.tipo === 'ordenar') {
    const inst = document.createElement('p'); inst.id = 'ordenar-instrucao'; inst.textContent = '☝️ Arraste os itens para reordenar';
    const lista = document.createElement('ul'); lista.id = 'ordenar-lista';
    const indices = [...Array(p.itens.length).keys()]; embaralharArr(indices);
    for (const oi of indices) {
      const li = document.createElement('li'); li.className = 'item-ordenar'; li.dataset.orig = oi; li.draggable = true;
      li.innerHTML = `<span class="drag-handle">⠿</span>${p.itens[oi]}`;
      configurarDrag(li, lista); lista.appendChild(li);
    }
    const btn = document.createElement('button'); btn.id = 'btn-confirmar-ordenar'; btn.textContent = '✅ CONFIRMAR ORDEM';
    btn.onclick = () => resolverOrdenar(lista, p);
    ar.appendChild(inst); ar.appendChild(lista); ar.appendChild(btn);
    const items = lista.querySelectorAll('.item-ordenar');
    for (const it of items) { await esperar(55); it.classList.add('vis'); await esperar(R.entreOp); }
    btn.classList.add('vis');
  }
  else if (p.tipo === 'associar') {
    assocSelecionadoEsq = null; assocFeitos = 0;
    const wrap = document.createElement('div'); wrap.id = 'associar-wrap';
    const colE = document.createElement('div'); colE.className = 'col-assoc';
    const colD = document.createElement('div'); colD.className = 'col-assoc';
    const titE = document.createElement('div'); titE.className = 'col-titulo esq'; titE.textContent = 'COLUNA A';
    const titD = document.createElement('div'); titD.className = 'col-titulo dir'; titD.textContent = 'COLUNA B';
    colE.appendChild(titE); colD.appendChild(titD);
    const iD = [...Array(p.pares.length).keys()]; embaralharArr(iD);
    for (let i = 0; i < p.pares.length; i++) {
      const elE = document.createElement('div'); elE.className = 'item-assoc'; elE.dataset.idx = i; elE.dataset.lado = 'esq'; elE.textContent = p.pares[i].esq;
      elE.onclick = () => clicarAssoc(elE, 'esq', p); colE.appendChild(elE);
      const j = iD[i]; const elD = document.createElement('div'); elD.className = 'item-assoc'; elD.dataset.idx = j; elD.dataset.lado = 'dir'; elD.textContent = p.pares[j].dir;
      elD.onclick = () => clicarAssoc(elD, 'dir', p); colD.appendChild(elD);
    }
    wrap.appendChild(colE); wrap.appendChild(colD); ar.appendChild(wrap);
    const items = wrap.querySelectorAll('.item-assoc');
    for (const it of items) { await esperar(35); it.classList.add('vis'); }
  }
  else if (p.tipo === 'lacuna') {
    const wrap = document.createElement('div'); wrap.id = 'completar-wrap';
    const frase = document.createElement('div'); frase.className = 'frase-lacuna';
    frase.innerHTML = (p.frase || p.pergunta).replace('_____', '<span class="lacuna-slot" id="lacuna-val">?</span>');
    wrap.appendChild(frase);
    for (let i = 0; i < p.opcoes.length; i++) {
      const btn = document.createElement('button'); btn.className = 'btn-op';
      btn.innerHTML = `<span class="letra">${letras[i]}</span>${p.opcoes[i]}`;
      btn.onclick = () => resolverLacuna(i, btn, p);
      wrap.appendChild(btn); await esperar(55); btn.classList.add('vis');
      if (i < p.opcoes.length - 1) await esperar(R.entreOp);
    }
    ar.appendChild(wrap);
  }
}

/* ════ DRAG ════ */
let dragSrc = null;
function configurarDrag(li, lista) {
  li.addEventListener('dragstart', e => { dragSrc = li; li.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
  li.addEventListener('dragend', () => { li.classList.remove('dragging'); lista.querySelectorAll('.item-ordenar').forEach(i => i.classList.remove('drag-over')); });
  li.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (li !== dragSrc) { lista.querySelectorAll('.item-ordenar').forEach(i => i.classList.remove('drag-over')); li.classList.add('drag-over'); } });
  li.addEventListener('drop', e => { e.preventDefault(); if (dragSrc && dragSrc !== li) { const its = [...lista.querySelectorAll('.item-ordenar')]; const iA = its.indexOf(dragSrc), iB = its.indexOf(li); if (iA < iB) li.after(dragSrc); else li.before(dragSrc); } lista.querySelectorAll('.item-ordenar').forEach(i => i.classList.remove('drag-over')); });
}

/* ════ ASSOCIAR ════ */
function clicarAssoc(el, lado, p) {
  if (bloqueado || el.classList.contains('correto') || el.classList.contains('par-a')) return;
  if (lado === 'esq') { document.querySelectorAll('.item-assoc[data-lado="esq"]').forEach(e => e.classList.remove('selecionado')); assocSelecionadoEsq = el; el.classList.add('selecionado'); }
  else {
    if (!assocSelecionadoEsq) return;
    const iE = parseInt(assocSelecionadoEsq.dataset.idx), iD = parseInt(el.dataset.idx);
    if (iE === iD) { assocSelecionadoEsq.classList.remove('selecionado'); assocSelecionadoEsq.classList.add('correto'); el.classList.add('par-a'); assocSelecionadoEsq = null; assocFeitos++; if (assocFeitos === p.pares.length) setTimeout(() => terminarQuestao(true, el, p), 500); }
    else { assocSelecionadoEsq.classList.add('errado'); el.classList.add('errado'); setTimeout(() => { assocSelecionadoEsq?.classList.remove('selecionado', 'errado'); el.classList.remove('errado'); assocSelecionadoEsq = null; }, 700); }
  }
}

/* ════ RESOLVERS ════ */
async function resolverMultipla(escolha, btnClicado, p) {
  if (bloqueado) return; bloqueado = true;
  document.querySelectorAll('.btn-op').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
  const ok = escolha === p.correta;
  btnClicado.classList.add(ok ? 'correta' : 'errada');
  if (!ok) document.querySelectorAll('.btn-op')[p.correta].classList.add('correta');
  await terminarQuestao(ok, btnClicado, p);
}
async function resolverVF(escolha, btnClicado, btnOutro, p) {
  if (bloqueado) return; bloqueado = true;
  document.querySelectorAll('.btn-vf').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
  const ok = escolha === p.correta;
  btnClicado.classList.add(ok ? 'verdadeiro' : 'falso');
  if (!ok) btnOutro.classList.add(p.correta ? 'verdadeiro' : 'falso');
  await terminarQuestao(ok, btnClicado, p);
}
async function resolverCompletar(valor, inp, p) {
  if (bloqueado) return; bloqueado = true;
  inp.disabled = true; $('btn-confirmar-completar').disabled = true;
  const ok = valor.toLowerCase().trim() === p.resposta.toLowerCase().trim();
  inp.style.borderColor = ok ? 'var(--green)' : 'var(--red)';
  inp.style.color = ok ? 'var(--green)' : 'var(--red)';
  if (!ok) inp.value = p.resposta;
  await terminarQuestao(ok, inp, p);
}
async function resolverOrdenar(lista, p) {
  if (bloqueado) return; bloqueado = true;
  $('btn-confirmar-ordenar').disabled = true;
  const items = [...lista.querySelectorAll('.item-ordenar')];
  const atual = items.map(it => parseInt(it.dataset.orig));
  const ok = atual.every((v, i) => v === p.ordemCorreta[i]);
  items.forEach((it) => { it.style.borderColor = it.dataset.orig == p.ordemCorreta[items.indexOf(it)] ? 'var(--green)' : 'var(--red)'; it.style.color = it.dataset.orig == p.ordemCorreta[items.indexOf(it)] ? 'var(--green)' : 'var(--red)'; });
  await terminarQuestao(ok, lista, p);
}
async function resolverLacuna(escolha, btnClicado, p) {
  if (bloqueado) return; bloqueado = true;
  document.querySelectorAll('#completar-wrap .btn-op').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
  const ok = escolha === p.correta;
  btnClicado.classList.add(ok ? 'correta' : 'errada');
  if (!ok) document.querySelectorAll('#completar-wrap .btn-op')[p.correta]?.classList.add('correta');
  const slot = $('lacuna-val'); if (slot) { slot.textContent = p.opcoes[p.correta]; slot.style.color = ok ? 'var(--green)' : 'var(--red)'; }
  await terminarQuestao(ok, btnClicado, p);
}

async function terminarQuestao(ok, ref, p) {
  const poderes = getItensComprados();
  const dobraMoeda = poderes.includes('dobro_moedas');
  const ganho = dobraMoeda ? 20 : 10;
  if (ok) {
    acertos++; moedas += ganho; setMoedas(moedas);
    animarRobo('rp'); atualizarMoedas(); confetes();
    if (ref && ref.getBoundingClientRect) notifBM(ref, ganho);
  } else {
    erros++; vidas = Math.max(0, vidas - 1); atualizarVidas(); animarRobo('re');
  }
  await esperar(R.aposResp);
  await abrirOverlay(p, ok, ref);
}

async function abrirOverlay(p, ok, ref) {
  const badge = $('ov-badge'); const divMoe = $('ov-moedas'); const btnCon = $('btn-continuar');
  const roboOv = $('robo-ov'); const petOv = $('pet-ov');
  badge.className = ''; badge.textContent = ''; badge.style.display = 'none';
  divMoe.style.display = 'none'; btnCon.style.display = 'none';
  $('ov-texto').textContent = ''; $('ov-cursor').classList.add('off');
  roboOv.className = 'ov-entra'; petOv.className = 'ov-entra';
  $('overlay').classList.add('ativo');
  await esperar(R.aposEnt);
  badge.textContent = (ok ? '🎉  ' : '😅  ') + (ok ? p.reacao_acerto : p.reacao_erro);
  badge.className = ok ? 'acerto' : 'erro'; badge.style.display = 'block';
  const poderes = getItensComprados();
  const ganho = poderes.includes('dobro_moedas') ? 20 : 10;
  if (ok) { divMoe.textContent = '💰  +' + ganho + ' Bytes-Moedas!'; divMoe.style.display = 'block'; }
  await esperar(1100);
  roboOv.className = 'ov-fala'; petOv.className = 'ov-fala';
  const cur = p.curiosidade ? '💡 ' + p.curiosidade : '💡 Muito bem! Continue assim!';
  await maq($('ov-texto'), $('ov-cursor'), cur, R.ov);
  roboOv.className = ok ? 'ov-pulo' : 'ov-idle'; petOv.className = ok ? 'ov-pulo' : 'ov-idle';
  await esperar(R.aposOv);
  roboOv.className = 'ov-idle'; petOv.className = 'ov-idle';
  btnCon.style.display = 'block';
}

async function fecharOverlay() {
  $('overlay').classList.remove('ativo');
  $('btn-continuar').style.display = 'none';
  idx++;
  if (vidas === 0) { mostrarFim(); return; }
  const msgs = ['Boa! Próxima chegando!', 'Arrasou! Continue assim!', 'Você é demais!', 'Mais um desafio!', 'Que concentração!', 'Incrível! Siga em frente!'];
  animarRobo('rf');
  await maq($('balao-txt'), $('balao-cur'), getPetFala('entre_pergunta'), R.bal);
  animarRobo('ri');
  await esperar(1100);
  await carregarPergunta();
}

function mostrarFim() {
  showTela('tela-fim');
  $('tela-fim').style.display = 'block';
  $('btn-home').classList.remove('vis');
  $('btn-loja-cab').classList.remove('vis');
  atualizarPets();
  const pct = Math.round((acertos / PERGUNTAS.length) * 100);
  const todas = getAllTrilhas();
  const meta = todas.find(t => t.id === trilhaAtual);
  setProgresso(trilhaAtual, pct, acertos);
  const prog = getProgresso(trilhaAtual);
  $('fim-trilha').textContent = meta ? meta.emoji + ' ' + meta.nome : '—';
  $('fim-ac').textContent = acertos;
  $('fim-er').textContent = erros;
  $('fim-mo').textContent = moedas + ' BM';
  $('fim-pc').textContent = pct + '%';
  $('fim-rec').textContent = (prog.pct || 0) + '%';
  let msg = '';
  if (vidas === 0) msg = getPetFala('gameover');
  else if (pct === 100) { msg = getPetFala('vitoria') + ' 🌟 PERFEITO!'; confetes(); setTimeout(confetes, 700); setTimeout(confetes, 1400); }
  else if (pct >= 85) { msg = '🎉 Incrível! Faltou pouquinho para o perfeito! ' + getPetFala('vitoria'); confetes(); }
  else if (pct >= 70) msg = '😊 Muito bem! Jogue de novo para melhorar!';
  else if (pct >= 50) msg = '💪 Boa! Com mais estudo você vai mandar bem!';
  else msg = '🎯 Não desista! Cada erro é uma lição!';
  $('fim-msg').textContent = msg;
}

/* ════════════════════════════════════════
   EDITOR DE TRILHAS CUSTOM
════════════════════════════════════════ */
document.querySelectorAll('.ep-btn').forEach(btn => { btn.onclick = () => { edEmoji = btn.dataset.emoji; atualizarEmojiPicker(); }; });
document.querySelectorAll('.cp-btn').forEach(btn => { btn.onclick = () => { edCor = btn.dataset.cor; atualizarCorPicker(); }; });

function atualizarEmojiPicker() { document.querySelectorAll('.ep-btn').forEach(btn => btn.classList.toggle('selecionado', btn.dataset.emoji === edEmoji)); }
function atualizarCorPicker() { document.querySelectorAll('.cp-btn').forEach(btn => btn.classList.toggle('selecionado', btn.dataset.cor === edCor)); }

function abrirEditor(id = null) {
  edTrilhaId = id; edPerguntas = []; editandoPergIdx = null;
  if (id) {
    const t = getCustomTrilhas().find(x => x.id === id); if (!t) return;
    $('ed-titulo').textContent = '✏️ EDITAR TRILHA';
    $('ed-nome').value = t.nome; $('ed-desc').value = t.desc;
    edEmoji = t.emoji; edCor = t.cor;
    edPerguntas = JSON.parse(JSON.stringify(t.perguntas || []));
    $('btn-del-trilha').style.display = 'block';
  } else {
    $('ed-titulo').textContent = '✏️ CRIAR TRILHA';
    $('ed-nome').value = ''; $('ed-desc').value = '';
    edEmoji = '🎯'; edCor = '#5bcbff';
    $('btn-del-trilha').style.display = 'none';
  }
  atualizarEmojiPicker(); atualizarCorPicker(); fecharFormPerg(); renderizarPergsList();
  $('modal-editor').classList.add('ativo');
}
function fecharEditor() { $('modal-editor').classList.remove('ativo'); }
function editarTrilha(id) { abrirEditor(id); }

function renderizarPergsList() {
  const lista = $('pergs-lista'); lista.innerHTML = '';
  $('ed-count').textContent = '(' + edPerguntas.length + ')';
  const TC = { multipla: ['#5bcbff', 'rgba(91,203,255,.1)'], vf: ['#3ddc84', 'rgba(61,220,132,.1)'], completar: ['#ffb347', 'rgba(255,179,71,.1)'], lacuna: ['#ff5c5c', 'rgba(255,92,92,.1)'], ordenar: ['#c084fc', 'rgba(192,132,252,.1)'], associar: ['#ffd700', 'rgba(255,215,0,.1)'] };
  const TN = { multipla: 'MÚLTIPLA', vf: 'V/F', completar: 'COMPLETAR', lacuna: 'LACUNA', ordenar: 'ORDENAR', associar: 'ASSOCIAR' };
  edPerguntas.forEach((p, i) => {
    const [cor, bg] = TC[p.tipo] || ['#5bcbff', 'rgba(91,203,255,.1)'];
    const card = document.createElement('div'); card.className = 'perg-card';
    card.innerHTML = `<div class="perg-num">PERGUNTA ${i + 1}</div><span class="perg-tipo-tag" style="background:${bg};color:${cor};border:1px solid ${cor}">${TN[p.tipo] || p.tipo}</span><div class="perg-resumo">${p.pergunta}</div><div class="perg-actions"><button class="perg-btn up" onclick="editarPerg(${i})">✏️</button><button class="perg-btn" onclick="removerPerg(${i})">🗑️</button></div>`;
    lista.appendChild(card);
  });
}

function removerPerg(i) { edPerguntas.splice(i, 1); renderizarPergsList(); fecharFormPerg(); }
function editarPerg(i) {
  editandoPergIdx = i; const p = edPerguntas[i];
  $('form-perg-titulo').textContent = '✏️ EDITAR PERGUNTA';
  $('form-perg').style.display = 'block';
  $('fp-pergunta').value = p.pergunta || '';
  $('fp-curiosidade').value = p.curiosidade || '';
  selecionarTipo(p.tipo, document.querySelector(`.tipo-tab[data-tipo="${p.tipo}"]`), p);
}

function abrirFormPerg() {
  editandoPergIdx = null;
  $('form-perg-titulo').textContent = '➕ NOVA PERGUNTA';
  $('form-perg').style.display = 'block';
  $('fp-pergunta').value = ''; $('fp-curiosidade').value = '';
  selecionarTipo('multipla', document.querySelector('.tipo-tab[data-tipo="multipla"]'));
  $('form-perg').scrollIntoView({ behavior: 'smooth' });
}
function fecharFormPerg() { $('form-perg').style.display = 'none'; editandoPergIdx = null; }

function selecionarTipo(tipo, btn, dados = null) {
  tipoAtual = tipo;
  document.querySelectorAll('.tipo-tab').forEach(t => t.classList.remove('ativo'));
  if (btn) btn.classList.add('ativo');
  renderizarCamposTipo(tipo, dados);
}

function renderizarCamposTipo(tipo, dados = null) {
  const c = $('campos-tipo'); c.innerHTML = '';
  if (tipo === 'multipla') {
    const opcoes = dados?.opcoes || ['', '', '', '']; const correta = dados?.correta ?? 0;
    const wrap = document.createElement('div'); wrap.className = 'opcoes-wrap';
    wrap.innerHTML = '<span class="ed-label">Opções (marque a correta)</span>';
    ['A', 'B', 'C', 'D'].forEach((l, i) => { const row = document.createElement('div'); row.className = 'opcao-row'; row.innerHTML = `<input type="radio" class="opcao-radio" name="opcao-correta" value="${i}" ${i === correta ? 'checked' : ''}/><input class="ed-input opcao-txt" type="text" placeholder="Opção ${l}..." value="${opcoes[i] || ''}" id="opcao-${i}"/>`; wrap.appendChild(row); });
    c.appendChild(wrap);
    const r = document.createElement('div'); r.className = 'ed-row'; r.innerHTML = `<div class="ed-campo"><span class="ed-label">Reação acerto</span><input id="fp-rac" class="ed-input" type="text" placeholder="Boa! Correto!" value="${dados?.reacao_acerto || ''}"/></div><div class="ed-campo"><span class="ed-label">Reação erro</span><input id="fp-rer" class="ed-input" type="text" placeholder="Era XXXX!" value="${dados?.reacao_erro || ''}"/></div>`;
    c.appendChild(r);
  }
  else if (tipo === 'vf') {
    const correta = dados?.correta ?? true;
    const div = document.createElement('div');
    div.innerHTML = `<span class="ed-label">Resposta correta</span><div style="display:flex;gap:12px;margin-bottom:10px"><label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-weight:700;font-size:15px"><input type="radio" name="vf-correta" value="true" ${correta === true ? 'checked' : ''} style="accent-color:var(--green);width:16px;height:16px"/> ✅ VERDADEIRO</label><label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-weight:700;font-size:15px"><input type="radio" name="vf-correta" value="false" ${correta === false ? 'checked' : ''} style="accent-color:var(--red);width:16px;height:16px"/> ❌ FALSO</label></div>`;
    const r = document.createElement('div'); r.className = 'ed-row'; r.innerHTML = `<div class="ed-campo"><span class="ed-label">Reação acerto</span><input id="fp-rac" class="ed-input" type="text" value="${dados?.reacao_acerto || ''}"/></div><div class="ed-campo"><span class="ed-label">Reação erro</span><input id="fp-rer" class="ed-input" type="text" value="${dados?.reacao_erro || ''}"/></div>`;
    div.appendChild(r); c.appendChild(div);
  }
  else if (tipo === 'completar') {
    const div = document.createElement('div');
    div.innerHTML = `<div class="ed-campo" style="margin-bottom:8px"><span class="ed-label">Resposta correta</span><input id="fp-resposta" class="ed-input" type="text" value="${dados?.resposta || ''}"/></div><div class="ed-campo" style="margin-bottom:8px"><span class="ed-label">Dica (opcional)</span><input id="fp-dica" class="ed-input" type="text" value="${dados?.dica || ''}"/></div>`;
    const r = document.createElement('div'); r.className = 'ed-row'; r.innerHTML = `<div class="ed-campo"><span class="ed-label">Reação acerto</span><input id="fp-rac" class="ed-input" type="text" value="${dados?.reacao_acerto || ''}"/></div><div class="ed-campo"><span class="ed-label">Reação erro</span><input id="fp-rer" class="ed-input" type="text" value="${dados?.reacao_erro || ''}"/></div>`;
    div.appendChild(r); c.appendChild(div);
  }
  else if (tipo === 'lacuna') {
    const opcoes = dados?.opcoes || ['', '', '', '']; const correta = dados?.correta ?? 0;
    const div = document.createElement('div');
    div.innerHTML = `<div class="ed-campo" style="margin-bottom:8px"><span class="ed-label">Frase com _____ (5 underlines)</span><input id="fp-frase" class="ed-input" type="text" placeholder="Ex: O Brasil tem _____ estados." value="${dados?.frase || ''}"/></div>`;
    const wrap = document.createElement('div'); wrap.className = 'opcoes-wrap'; wrap.innerHTML = '<span class="ed-label">Opções (marque a correta)</span>';
    ['A', 'B', 'C', 'D'].forEach((l, i) => { const row = document.createElement('div'); row.className = 'opcao-row'; row.innerHTML = `<input type="radio" class="opcao-radio" name="opcao-correta" value="${i}" ${i === correta ? 'checked' : ''}/><input class="ed-input opcao-txt" type="text" placeholder="Opção ${l}..." value="${opcoes[i] || ''}" id="opcao-${i}"/>`; wrap.appendChild(row); });
    div.appendChild(wrap);
    const r = document.createElement('div'); r.className = 'ed-row'; r.style.marginTop = '8px'; r.innerHTML = `<div class="ed-campo"><span class="ed-label">Reação acerto</span><input id="fp-rac" class="ed-input" type="text" value="${dados?.reacao_acerto || ''}"/></div><div class="ed-campo"><span class="ed-label">Reação erro</span><input id="fp-rer" class="ed-input" type="text" value="${dados?.reacao_erro || ''}"/></div>`;
    div.appendChild(r); c.appendChild(div);
  }
}

function coletarDadosPerg() {
  const pergunta = $('fp-pergunta').value.trim();
  const curiosidade = $('fp-curiosidade').value.trim();
  const rac = $('fp-rac')?.value.trim() || 'Correto!';
  const rer = $('fp-rer')?.value.trim() || 'Errado!';
  if (!pergunta) { toast('⚠️ Escreva o texto da pergunta!', true); return null; }
  if (tipoAtual === 'multipla') {
    const opcoes = [0, 1, 2, 3].map(i => $(`opcao-${i}`)?.value.trim() || '');
    if (opcoes.some(o => !o)) { toast('⚠️ Preencha todas as 4 opções!', true); return null; }
    const ce = document.querySelector('input[name="opcao-correta"]:checked');
    return { tipo: 'multipla', pergunta, opcoes, correta: ce ? parseInt(ce.value) : 0, reacao_acerto: rac, reacao_erro: rer, curiosidade };
  }
  if (tipoAtual === 'vf') {
    const ce = document.querySelector('input[name="vf-correta"]:checked');
    return { tipo: 'vf', pergunta, correta: ce ? ce.value === 'true' : true, reacao_acerto: rac, reacao_erro: rer, curiosidade };
  }
  if (tipoAtual === 'completar') {
    const resposta = $('fp-resposta')?.value.trim() || '';
    if (!resposta) { toast('⚠️ Informe a resposta!', true); return null; }
    return { tipo: 'completar', pergunta, resposta, dica: $('fp-dica')?.value.trim() || '', reacao_acerto: rac, reacao_erro: rer, curiosidade };
  }
  if (tipoAtual === 'lacuna') {
    const frase = $('fp-frase')?.value.trim() || '';
    if (!frase || !frase.includes('_____')) { toast('⚠️ Use _____ (5 underlines) na frase!', true); return null; }
    const opcoes = [0, 1, 2, 3].map(i => $(`opcao-${i}`)?.value.trim() || '');
    if (opcoes.some(o => !o)) { toast('⚠️ Preencha as 4 opções!', true); return null; }
    const ce = document.querySelector('input[name="opcao-correta"]:checked');
    return { tipo: 'lacuna', pergunta, frase, opcoes, correta: ce ? parseInt(ce.value) : 0, reacao_acerto: rac, reacao_erro: rer, curiosidade };
  }
  return null;
}

function salvarPergunta() {
  const dados = coletarDadosPerg(); if (!dados) return;
  if (editandoPergIdx !== null) edPerguntas[editandoPergIdx] = dados;
  else edPerguntas.push(dados);
  renderizarPergsList(); fecharFormPerg(); toast('✅ Pergunta salva!');
}

function salvarTrilha() {
  const nome = $('ed-nome').value.trim(); const desc = $('ed-desc').value.trim();
  if (!nome) { toast('⚠️ Dê um nome à trilha!', true); return; }
  if (edPerguntas.length < 3) { toast('⚠️ Adicione ao menos 3 perguntas!', true); return; }
  const qtd = edPerguntas.length;
  const step = Math.max(1, Math.floor(qtd / 4));
  const nns = ['⭐ INICIANTE', '⭐⭐ MÉDIO', '⭐⭐⭐ AVANÇADO', '💎 MESTRE'];
  const niveis = [];
  for (let i = 0; i < 4; i++) { const inicio = i * step; if (inicio < qtd) niveis.push({ nome: nns[i], inicio, fala: nns[i].replace(/⭐|💎/g, '').trim() + '! Vamos lá!' }); }
  const custom = getCustomTrilhas();
  if (edTrilhaId) {
    const i = custom.findIndex(x => x.id === edTrilhaId);
    if (i >= 0) custom[i] = { ...custom[i], nome, desc, emoji: edEmoji, cor: edCor, isCustom: true, niveis, perguntas: edPerguntas };
    setCustomTrilhas(custom); toast('✅ Trilha atualizada!');
  } else {
    custom.push({ id: 'custom_' + Date.now(), nome, desc, emoji: edEmoji, cor: edCor, isCustom: true, niveis, perguntas: edPerguntas });
    setCustomTrilhas(custom); toast('🚀 Trilha criada!');
  }
  fecharEditor(); mostrarTelaInicio();
}

function deletarTrilhaEditando() {
  if (!edTrilhaId) return;
  if (!confirm('Excluir esta trilha? Não tem como desfazer!')) return;
  setCustomTrilhas(getCustomTrilhas().filter(t => t.id !== edTrilhaId));
  localStorage.removeItem('bytes_prog_' + edTrilhaId);
  fecharEditor(); mostrarTelaInicio(); toast('🗑️ Trilha excluída.');
}

/* ════ TELA DE BOAS-VINDAS ════ */
function abrirBoasVindas() {
  // Renderizar a grade de pets grátis/baratos para escolher ao iniciar
  const grid = $('bv-pets');
  grid.innerHTML = '';
  LOJA_PETS.forEach(pet => {
    const btn = document.createElement('button');
    btn.setAttribute('data-pet', pet.id);
    btn.style.cssText = 'font-size:2.2rem;padding:0.6rem;border-radius:0.8rem;border:0.2rem solid var(--border);background:#080818;cursor:pointer;transition:all .15s;min-width:5rem';
    btn.title = pet.nome;
    btn.textContent = pet.emoji;
    btn.onclick = () => {
      grid.querySelectorAll('button').forEach(b => { b.style.borderColor = 'var(--border)'; b.style.background = '#080818'; });
      btn.style.borderColor = 'var(--purple)';
      btn.style.background = 'rgba(192,132,252,.15)';
    };
    // Selecionar robo por padrão
    if (pet.id === 'robo') { btn.style.borderColor = 'var(--purple)'; btn.style.background = 'rgba(192,132,252,.15)'; }
    grid.appendChild(btn);
  });
  const bv = $('modal-bv');
  bv.style.display = 'flex';
  setTimeout(() => $('bv-nome').focus(), 200);
  $('bv-nome').addEventListener('keydown', e => { if (e.key === 'Enter') confirmarBoasVindas(); });
}

function confirmarBoasVindas() {
  let nome = $('bv-nome').value.trim();
  if (!nome) nome = 'Jogador';
  setNomeJogador(nome);
  // Pegar pet selecionado
  const petBtn = document.querySelector('#bv-pets button[style*="var(--purple)"]');
  if (petBtn) { const petId = petBtn.getAttribute('data-pet'); setPetEquipado(petId); }
  // Garantir que o robo está no inventário
  const inv = getItensComprados();
  if (!inv.includes('robo')) { inv.push('robo'); setItensComprados(inv); }
  // Atualizar o nome no header
  atualizarNomeHeader();
  $('modal-bv').style.display = 'none';
  atualizarPets();
  mostrarTelaInicio();
}

function atualizarNomeHeader() {
  const nome = getNomeJogador();
  const el = $('nome-jogador-cab');
  const txt = $('txt-nome-jogador');
  if (nome && el && txt) { txt.textContent = nome; el.style.display = 'flex'; }
}

// INICIAR
window.onload = () => {
  const inv = getItensComprados();
  if (!inv.includes('robo')) { inv.push('robo'); setItensComprados(inv); }
  atualizarNomeHeader();
  if (isFirstVisit()) {
    // Primeira vez — mostrar boas-vindas
    abrirBoasVindas();
  } else {
    mostrarTelaInicio();
  }
};