// MORDRED UI — camada compartilhada (Sunnyata, Nexus, Singularidade).
// 1) Centraliza o breakpoint desktop/mobile (antes repetido como 1023/1024 em vários arquivos).
// 2) Reorganiza os painéis em 3 colunas e permite esconder/mostrar a coluna 1 (player + anotações).
// Carregado de forma síncrona, depois dos elementos e antes dos scripts "defer" de cada app.
(() => {
  'use strict';

  const BP_DESKTOP = 1024;   // a partir daqui: layout em colunas
  const BP_COLUNA_ESQ = 1200; // a partir daqui a coluna 1 aparece por padrão
  const CHAVE_PREF = 'mordred.colEsqOculta';

  const mqDesktop = window.matchMedia(`(min-width: ${BP_DESKTOP}px)`);
  const mqLargo = window.matchMedia(`(min-width: ${BP_COLUNA_ESQ}px)`);

  window.MORDRED_UI = {
    BP_DESKTOP,
    isDesktop: () => mqDesktop.matches,
    isMobile: () => !mqDesktop.matches,
  };

  // ---------- preferência salva (localStorage pode estar bloqueado) ----------
  const lerPref = () => {
    try {
      const v = localStorage.getItem(CHAVE_PREF);
      return v === null ? null : v === '1';
    } catch {
      return null;
    }
  };
  const salvarPref = (oculta) => {
    try { localStorage.setItem(CHAVE_PREF, oculta ? '1' : '0'); } catch { /* sem persistência */ }
  };

  // ---------- cabeçalho do painel principal ----------
  // Monta, a partir do que já existe na aba "Ajustes" (campos ajuste-* e seus botões), um cabeçalho
  // fixo com o status vivo e os botões −/+. Os elementos são MOVIDOS, não recriados: ids e
  // handlers (ajustarVida(), ajustarAlma()...) continuam os mesmos, então script.js não muda.
  const ICONES = {
    vida: 'heart', alma: 'fire', energia: 'bolt', eter: 'wand-sparkles',
    sanidade: 'brain', escudo: 'shield-halved', defesa: 'shield-halved',
  };

  function montarCabecalho() {
    const painel = document.querySelector('.container');
    const abas = painel && painel.querySelector(':scope > .tabs');
    const ajustes = document.getElementById('ajustes');
    if (!(painel && abas && ajustes)) return;

    const topo = criarEl('div', { id: 'cab-topo' });
    const cab = criarEl('div', { id: 'cab-painel' });
    const avatar = criarEl('span', { className: 'cab-avatar', textContent: '?' }, { 'aria-hidden': 'true' });
    const nome = criarEl('span', { className: 'cab-nome', textContent: 'Personagem' });
    const engrenagem = criarEl('button', { type: 'button', className: 'cab-engrenagem' },
      { 'aria-label': 'Configurações', title: 'Configurações' });
    engrenagem.innerHTML = '<i class="fa-solid fa-gear" aria-hidden="true"></i>';

    const stats = criarEl('div', { className: 'cab-stats' });
    ajustes.querySelectorAll('input[id^="ajuste-"]').forEach((campo) => {
      const chave = campo.id.replace('ajuste-', '');
      const titulo = campo.previousElementSibling && campo.previousElementSibling.tagName === 'H2'
        ? campo.previousElementSibling : null;
      const rotulo = titulo
        ? titulo.textContent.replace(/^\s*Ajuste\s+/i, '').replace(/:\s*$/, '').trim()
        : chave.charAt(0).toUpperCase() + chave.slice(1);

      const chip = criarEl('div', { className: 'cab-stat', title: rotulo });
      chip.dataset.stat = chave; // a cor vem do ui.css (--stat-*)

      const topoChip = criarEl('div', { className: 'cab-stat-topo' });
      topoChip.innerHTML = `<i class="fa-solid fa-${ICONES[chave] || 'circle'}" aria-hidden="true"></i>`
        + `<b class="cab-stat-valor">–</b>`;

      // os dois botões que vêm logo depois do campo (reduzir e adicionar): lidos ANTES de mover o campo
      let el = campo.nextElementSibling;
      const botoes = [];
      while (el && botoes.length < 2) {
        if (el.tagName === 'BUTTON') botoes.push(el);
        el = el.nextElementSibling;
      }

      const ajuste = criarEl('div', { className: 'cab-stat-ajuste' });
      campo.classList.add('cab-stat-campo');
      campo.placeholder = '1';
      if (!campo.value) campo.value = '1';
      campo.setAttribute('aria-label', `Quantidade de ${rotulo.toLowerCase()} a ajustar`);
      botoes.forEach((b) => {
        const reduz = /\(\s*-1\s*\)/.test(b.getAttribute('onclick') || '');
        const nomeOriginal = b.textContent.trim();
        b.dataset.sinal = reduz ? '-' : '+';
        b.classList.add('cab-stat-btn');
        b.type = 'button';
        b.textContent = reduz ? '−' : '+';
        b.title = nomeOriginal;
        b.setAttribute('aria-label', nomeOriginal);
      });
      // sempre na ordem − , +
      const menos = botoes.find((b) => b.dataset.sinal === '-');
      const mais = botoes.find((b) => b.dataset.sinal === '+');
      ajuste.append(...[menos, campo, mais].filter(Boolean));

      chip.append(topoChip, ajuste);
      stats.append(chip);

      // valor vivo: acompanha o texto que o script.js já mantém em #status-<chave>
      const fonte = document.getElementById(`status-${chave}`);
      const valor = topoChip.querySelector('.cab-stat-valor');
      const sincronizar = () => {
        const txt = fonte ? fonte.textContent : '';
        const num = txt.match(/-?\d+(?:[.,]\d+)?/);
        valor.textContent = num ? num[0] : '–';
        valor.title = txt.trim();
      };
      if (fonte) {
        sincronizar();
        new MutationObserver(sincronizar).observe(fonte, { childList: true, characterData: true, subtree: true });
      }
    });

    // a Vida sempre primeiro; o resto segue a ordem do HTML
    const chips = [...stats.children];
    chips.sort((a, b) => (b.dataset.stat === 'vida') - (a.dataset.stat === 'vida'));
    chips.forEach((c) => stats.append(c));

    // a aba "Ajustes" deixa de existir: sobe pro cabeçalho
    ajustes.remove();
    painel.querySelectorAll('.subtab').forEach((st) => {
      if ((st.getAttribute('onclick') || '').includes("'ajustes'")) st.remove();
    });

    // nome e inicial do avatar acompanham #status-nome
    const fonteNome = document.getElementById('status-nome');
    const sincNome = () => {
      const t = (fonteNome.textContent || '').trim();
      nome.textContent = t || 'Personagem';
      avatar.textContent = (t.charAt(0) || '?').toUpperCase();
    };
    if (fonteNome) {
      sincNome();
      new MutationObserver(sincNome).observe(fonteNome, { childList: true, characterData: true, subtree: true });
    }

    cab.append(avatar, nome, stats, engrenagem);
    abas.parentNode.insertBefore(topo, abas);
    topo.append(cab, abas);

    // ---------- Config: abre pela engrenagem, com botão de voltar ----------
    const config = document.getElementById('config');
    if (!config) return;
    let ultimaAba = 'info';
    const abaAtiva = () => (document.querySelector('.content.active') || {}).id || 'info';
    // openTab vem do script.js do app (carregado depois, com defer): resolve só na hora do clique
    const alternarConfig = () => {
      if (typeof window.openTab !== 'function') return;
      if (config.classList.contains('active')) {
        window.openTab(ultimaAba);
      } else {
        ultimaAba = abaAtiva();
        window.openTab('config');
      }
    };
    engrenagem.addEventListener('click', alternarConfig);
    const voltar = criarEl('button', { type: 'button', className: 'cfg-voltar' });
    voltar.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Voltar';
    voltar.addEventListener('click', alternarConfig);
    config.prepend(voltar);
    new MutationObserver(() => {
      const aberta = config.classList.contains('active');
      engrenagem.classList.toggle('ativa', aberta);
      engrenagem.setAttribute('aria-pressed', String(aberta));
    }).observe(config, { attributes: true, attributeFilter: ['class'] });
  }

  // Mostra a última rolagem (mensagem do DiceBot no chat) logo abaixo dos cartões de ação.
  function montarUltimoResultado() {
    const grade = document.querySelector('#acoes .acoes-grid');
    const chat = document.getElementById('chat-mensagens');
    if (!(grade && chat)) return;
    const faixa = criarEl('div', { className: 'ultimo-resultado' });
    faixa.innerHTML = '<span>Último resultado</span><span class="ur-texto"></span>';
    const texto = faixa.querySelector('.ur-texto');
    grade.after(faixa);
    const atualizar = () => {
      const bots = chat.querySelectorAll('.chat-message.bot');
      const ultima = bots[bots.length - 1];
      texto.textContent = ultima ? ultima.textContent.trim() : 'nenhuma rolagem ainda';
      texto.title = texto.textContent;
    };
    atualizar();
    new MutationObserver(atualizar).observe(chat, { childList: true });
  }

  function criarEl(tag, props = {}, attrs = {}) {
    const el = Object.assign(document.createElement(tag), props);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  montarCabecalho();
  montarUltimoResultado();

  // ---------- montagem das colunas ----------
  const player = document.querySelector('.player-container');
  const notas = document.getElementById('essential-info2');
  const centro = document.querySelector('.container');
  const ficha = document.getElementById('essential-info');
  const chat = document.getElementById('chat-container');
  if (!(player && notas && centro && ficha && chat)) return; // sem a estrutura esperada, mantém o layout antigo

  const criar = (tag, props = {}, attrs = {}) => {
    const el = Object.assign(document.createElement(tag), props);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  const layout = criar('div', { id: 'app-layout' });
  const colEsq = criar('aside', { id: 'col-esq' }, { 'aria-label': 'Player e anotações' });
  const colMeio = criar('main', { id: 'col-meio' });
  const colDir = criar('aside', { id: 'col-dir' }, { 'aria-label': 'Ficha e chat' });
  const botao = criar('button', { id: 'toggle-col-esq', type: 'button' });
  botao.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';

  centro.parentNode.insertBefore(layout, centro);
  colEsq.append(player, notas);
  colMeio.append(centro, botao);
  colDir.append(ficha, chat);
  layout.append(colEsq, colMeio, colDir);
  document.body.classList.add('layout-colunas');

  // ---------- esconder / mostrar a coluna 1 ----------
  // Sem preferência salva, segue a largura da tela; depois que a pessoa escolhe, a escolha vale.
  let oculta = lerPref() ?? !mqLargo.matches;

  function aplicar() {
    document.body.classList.toggle('col-esq-oculta', oculta);
    colEsq.toggleAttribute('inert', oculta);
    colEsq.setAttribute('aria-hidden', String(oculta));
    const rotulo = oculta ? 'Mostrar player e anotações' : 'Esconder player e anotações';
    botao.title = rotulo;
    botao.setAttribute('aria-label', rotulo);
    botao.setAttribute('aria-expanded', String(!oculta));
  }

  botao.addEventListener('click', () => {
    oculta = !oculta;
    salvarPref(oculta);
    aplicar();
  });

  mqLargo.addEventListener('change', (e) => {
    if (lerPref() === null) {
      oculta = !e.matches;
      aplicar();
    }
  });

  aplicar();
})();
