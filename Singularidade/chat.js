// chat.js
// Compatível com CSP e UMD local de rpg-dice-roller@4.6.0

let DiceRoller;

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
    const expr = match[1].trim();

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

  mensagensRef.orderBy("timestamp").onSnapshot(snapshot => {
    mensagensDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
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

    // 🔽 Garante o scroll automático no final
    mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
  });

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") enviarBtn.click();
  });
}

// Fallback de segurança após 5 segundos
setTimeout(() => {
  if (!window.rpgDiceRoller || !window.rpgDiceRoller.DiceRoller) {
    console.error('DiceRoller não foi carregado. Verifique o script dice-roller.js local ou via CDN.');
  }
}, 5000);

let mensagensDiv;

document.addEventListener("DOMContentLoaded", () => {
  const mensagensDiv = document.getElementById("chat-mensagens");
  const chatContainer = document.getElementById("chat-container");

  if (chatContainer) {
    chatContainer.addEventListener("mouseleave", () => {
      console.log('Mouse saiu do chatContainer');
      
      // Espera a animação concluir antes de rolar
      setTimeout(() => {
        console.log("scrollTop:", mensagensDiv.scrollTop);
        console.log("scrollHeight:", mensagensDiv.scrollHeight);
        console.log("clientHeight:", mensagensDiv.clientHeight);

        if (mensagensDiv.scrollHeight > mensagensDiv.clientHeight) {
          mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
        }
      }, 300);  // Ajuste o tempo de espera conforme necessário (300ms é um exemplo)
    });
  } else {
    console.error("Elemento 'chat-container' não encontrado!");
  }
});


function scrollChatParaFim() {
  const mensagensDiv = document.getElementById("chat-mensagens");
  if (mensagensDiv) {
    // Espera a animação concluir antes de rolar
    setTimeout(() => {
      console.log("scrollTop:", mensagensDiv.scrollTop);
      console.log("scrollHeight:", mensagensDiv.scrollHeight);
      console.log("clientHeight:", mensagensDiv.clientHeight);

      if (mensagensDiv.scrollHeight > mensagensDiv.clientHeight) {
        mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
      }
    }, 300);  // Ajuste o tempo de espera conforme necessário (300ms é um exemplo) // 
    }
  console.log("Scroll automático ativado.");
}