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
