// chat.js
// Compatível com CSP e UMD local de rpg-dice-roller@4.6.0

let DiceRoller;
let chatEmHover = false;


// Espera o bundle UMD popular window.rpgDiceRoller
const esperarUMD = setInterval(() => {
  if (window.rpgDiceRoller && window.rpgDiceRoller.DiceRoller) {
    DiceRoller = window.rpgDiceRoller.DiceRoller;
    clearInterval(esperarUMD);
    iniciarChat();
  }
}, 100);

function iniciarChat() {
  const mensagensRef = db.collection("chatMensagens");
  const input = document.getElementById("chat-input");
  const enviarBtn = document.getElementById("chat-enviar");
  const mensagensDiv = document.getElementById("chat-mensagens");

  let nomeUsuario = "Usuário";
  const esperarNomePersonagem = setInterval(() => {
    if (typeof window.nomepersonagem !== "undefined") {
      nomeUsuario = window.nomepersonagem;
      console.log("Nome do usuário definido:", nomeUsuario);
      clearInterval(esperarNomePersonagem);
    }
  }, 100);

  function gerarCorAleatoria() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF)
      .toString(16)
      .padStart(6, '0');
  }

  function obterCorUsuario(usuario) {
    const chave = `chatColor-${usuario}`;
    let cor = localStorage.getItem(chave);
    if (!cor) {
      cor = gerarCorAleatoria();
      localStorage.setItem(chave, cor);
    }
    return cor;
  }

  async function tratarRolagem(texto) {
    const match = texto.match(/^\/roll\s+(.+)/i) || texto.match(/^(\d+d\d+.*)/i);
    if (!match) return null;
  
    let expr = match[1].trim();
  
      // Corrige casos como 3d20k+10 para 3d20k1+10
      expr = expr.replace(/(\d+d\d+)k(?=[^0-9]|$)/gi, '$1k1');
  
    try {
      const roller = new DiceRoller();
      const result = roller.roll(expr);
  
      console.log("Resultado da rolagem:", result);
      
      if (result.output) {
        return `${nomeUsuario} rolou ${expr}: ${result.output}`;
      } else {
        console.warn('Não foi possível obter a saída corretamente');
        return `Erro ao processar a rolagem.`;
      }
    } catch (e) {
      console.warn('Erro ao processar rolagem:', e);
      return `Expressão inválida: ${expr}`;
    }
  }
  

  enviarBtn.addEventListener("click", async () => {
    if (typeof window.nomepersonagem !== "undefined" && window.nomepersonagem !== nomeUsuario) {
      nomeUsuario = window.nomepersonagem;
      console.log("Nome do usuário atualizado:", nomeUsuario);
    }

    const texto = input.value.trim();
    if (!texto) return;

    const respostaRoll = await tratarRolagem(texto);
    if (respostaRoll) {
      await mensagensRef.add({ texto, autor: nomeUsuario, timestamp: new Date() });
      await mensagensRef.add({ texto: respostaRoll, autor: 'DiceBot', timestamp: new Date() });
      input.value = "";
      return;
    }

    try {
      await mensagensRef.add({ texto, autor: nomeUsuario, timestamp: new Date() });
      input.value = "";
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  });

  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarBtn.click();
    }
  });

  mensagensRef.orderBy("timestamp", "desc").limit(20).onSnapshot(async snapshot => {
    const mensagens = [];
    snapshot.forEach(doc => {
      mensagens.unshift({ id: doc.id, ...doc.data() }); // Inverte a ordem para exibição correta
    });

    mensagensDiv.innerHTML = "";
    mensagens.forEach(msg => {
      const mensagemEl = document.createElement("div");
      mensagemEl.classList.add("chat-message");

      const corAutor = obterCorUsuario(msg.autor);

      if (msg.autor === "DiceBot") {
        mensagemEl.classList.add("bot");
        mensagemEl.textContent = msg.texto;
      } else if (msg.autor === nomeUsuario) {
        mensagemEl.classList.add("eu");
        mensagemEl.innerHTML = `<strong style="color: ${corAutor}">${msg.autor}:</strong> ${msg.texto}`;
      } else {
        mensagemEl.classList.add("outro");
        mensagemEl.innerHTML = `<strong style="color: ${corAutor}">${msg.autor}:</strong> ${msg.texto}`;
      }

      mensagensDiv.appendChild(mensagemEl);
    });

    if (!chatEmHover) {
      scrollChatParaFim();
    }
  });


}

// Fallback de segurança após 5 segundos
setTimeout(() => {
  if (!window.rpgDiceRoller || !window.rpgDiceRoller.DiceRoller) {
    console.error('DiceRoller não foi carregado. Verifique o script dice-roller.js local ou via CDN.');
  }
}, 5000);

document.addEventListener("DOMContentLoaded", () => {
  const mensagensDiv = document.getElementById("chat-mensagens");
  const chatContainer = document.getElementById("chat-container");

  if (chatContainer && mensagensDiv) {
    chatContainer.addEventListener("mouseenter", () => {
      chatEmHover = true;
    });

    chatContainer.addEventListener("mouseleave", () => {
      chatEmHover = false;
      scrollChatParaFim(); // Executa scroll ao sair do hover
    });
  } else {
    console.error("Elemento 'chat-container' ou 'chat-mensagens' não encontrado!");
  }
});


function scrollChatParaFim() {
  const mensagensDiv = document.getElementById("chat-mensagens");
  if (mensagensDiv) {
    setTimeout(() => {
      mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
    }, 300);
  }
}

async function limparMensagensAntigasSeNecessario() {
  const hoje = new Date().toISOString().split("T")[0];
  const controleRef = db.collection("controle").doc("limpezaChat");

  try {
    const doc = await controleRef.get();
    const ultimaLimpeza = doc.exists ? doc.data().ultimaLimpeza : null;

  if (ultimaLimpeza !== hoje) {
    console.log("Limpando mensagens antigas do chat...");
      const snapshot = await db.collection("chatMensagens").get();
      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      await controleRef.set({ ultimaLimpeza: hoje });
      console.log("Mensagens do chat limpas com sucesso.");
    } else {
      console.log("A limpeza já foi feita hoje.");
    }
    } catch (err) {
      console.error("Erro ao limpar mensagens antigas:", err);
  }
}

// Chama a limpeza ao iniciar o chat
limparMensagensAntigasSeNecessario();
