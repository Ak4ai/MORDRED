let personagem; // Declaracao global do objeto personagem
let habilidadesData;
let habilidade;
let atualizarStatusCheck = false;
let atualizarHabilidadeCheck = false;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Procura por uma chave de personagem com check == 1 no localStorage
        let chavePersonagemSelecionado = null;

        for (let key in localStorage) {
            // Garante que a propriedade pertence ao localStorage
            if (localStorage.hasOwnProperty(key)) {
                // Verifica se a chave termina com '-302Xpersonagem'
                if (key.endsWith('-302Xpersonagem')) {
                    // Tenta fazer o parse do conteúdo JSON da chave
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        // Se o atributo check for 1, selecionamos este personagem
                        if (data.check === 1) {
                            chavePersonagemSelecionado = key;
                            break;
                        }
                    } catch (e) {
                        console.warn(`Não foi possível parsear o valor de ${key}:`, e);
                    }
                }
            }
        }

        if (!chavePersonagemSelecionado) {
            throw new Error("Nenhum personagem com 'check' igual a 1 foi encontrado no localStorage.");
        }

        // Armazena o nome do arquivo sem o sufixo '-302Xpersonagem' na variável global
        window.nomepersonagem = chavePersonagemSelecionado.replace('-302Xpersonagem', '');
        document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
        console.log(`Personagem selecionado: ${chavePersonagemSelecionado}`);
        console.log(`Nome do personagem salvo em window.nomepersonagem: ${window.nomepersonagem}`);

        // Carrega os dados do personagem usando a chave encontrada
        const personagemData = await carregarDados(chavePersonagemSelecionado);
        console.log('Dados do personagem recebidos:', personagemData);

        // Inicializa a instância da classe Personagem e atualiza a interface
        personagem = new Personagem(personagemData);
        atualizarInfoPersonagem(personagem);

        // Supomos que a chave de habilidades segue o mesmo padrão, substituindo "personagem" por "habilidades"
        const chaveHabilidades = chavePersonagemSelecionado.replace('302Xpersonagem', 'habilidades302X');

        // Carrega os dados das habilidades
        const habilidadesData = await carregarDados(chaveHabilidades);
        console.log('Dados das habilidades recebidos:', habilidadesData);

        // Exibe as habilidades na interface
        exibirHabilidades(habilidadesData);
    } catch (error) {
        console.error('Erro ao obter dados do personagem ou habilidades:', error);
    }
});

function carregarDados(key) {
    return new Promise((resolve, reject) => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
            } catch (e) {
                reject(e);
            }
        } else {
            reject(new Error('Dados não encontrados.'));
        }
    });
}
  
class Personagem {
    constructor(data) {
      // Identificação
      this.img = data.img;
      this.token = data.token;
  
      // Atributos principais
      this.vida = data.vida;
      this.vidaMax = data.vidaMax;
      this.eter = data.eter;
      this.eterMax = data.eterMax;
      this.sanidade = data.sanidade;
      this.sanidadeMax = data.sanidadeMax;
      this.defesa = data.defesa;
      this.defesaMax = data.defesaMax;
  
      // Atributos
      this.vigor = data.vigor;
      this.forca = data.forca;
      this.destreza = data.destreza;
      this.inteligencia = data.inteligencia;
      this.espiritualidade = data.espiritualidade;
  
      // Perícias: Físicas / Combate
      this.acrobacia = data.acrobacia;
      this.luta = data.luta;
      this.pontaria = data.pontaria;
      this.bloqueio = data.bloqueio;
      this.reflexos = data.reflexos;
  
      // Perícias: Misticismo
      this.rituais = data.rituais;
      this.criptozoologia = data.criptozoologia;
      this.simbolismo = data.simbolismo;
      this.intuicao = data.intuicao;
  
      // Perícias: Acadêmicas
      this.psicologia = data.psicologia;
      this.educacaoGeral = data.educacaoGeral;
      this.linguagens = data.linguagens;
      this.medicina = data.medicina;
      this.educacaoSuperior = data.educacaoSuperior;
  
      // Perícias: Criação
      this.alquimia = data.alquimia;
      this.artesanatoEngenharia = data.artesanatoEngenharia;
      this.culinaria = data.culinaria;
  
      // Perícias: Interpessoais
      this.persuasao = data.persuasao;
      this.intimidacao = data.intimidacao;
      this.enganacao = data.enganacao;
  
      // Perícias: Ambiente
      this.investigacao = data.investigacao;
      this.sobrevivencia = data.sobrevivencia;
      this.percepcao = data.percepcao;
      this.lidarComAnimais = data.lidarComAnimais;
  
      // Perícias: Crime
      this.furtividade = data.furtividade;
      this.prestidigitacao = data.prestidigitacao;
      this.fraude = data.fraude;

      // Perícias: Coordenação
      this.performance = data.performance;
      this.iniciativa = data.iniciativa;
    
      // Perícias: Resistência
      this.constituicao = data.constituicao;
      this.vontade = data.vontade;
  
      // Traços
      this.tracoRaiz = data.tracoRaiz;
      this.tracoSubraiz = data.tracoSubraiz;
      this.tracoRaca = data.tracoRaca;
      this.tracoCultura = data.tracoCultura;
      this.tracoCorpo = data.tracoCorpo;
      this.tracoDefeitos = data.tracoDefeitos;
      this.tracoEfeitos = data.tracoEfeitos;
      this.tracoPeso = data.tracoPeso;
      this.tracoHistoria = data.tracoHistoria;
    }
  
    // Getters básicos
    getVida() {
      return this.vida;
    }
    getVidaMax() {
      return this.vidaMax;
    }
    getEter() {
      return this.eter;
    }
    getEterMax() {
      return this.eterMax;
    }
    getSanidade() {
      return this.sanidade;
    }
    getSanidadeMax() {
      return this.sanidadeMax;
    }
    getDefesa() {
      return this.defesa;
    }
    getDefesaMax() {
      return this.defesaMax;
    }
  
    // Atributos
    getAtributos() {
      return {
        vigor: this.vigor,
        forca: this.forca,
        destreza: this.destreza,
        inteligencia: this.inteligencia,
        espiritualidade: this.espiritualidade
      };
    }
  
    // Todas as perícias
    getPericias() {
      return {
        // Físicas / Combate
        acrobacia: this.acrobacia,
        luta: this.luta,
        pontaria: this.pontaria,
        bloqueio: this.bloqueio,
        reflexos: this.reflexos,
        // Misticismo
        rituais: this.rituais,
        criptozoologia: this.criptozoologia,
        simbolismo: this.simbolismo,
        intuicao: this.intuicao,
        // Acadêmicas
        psicologia: this.psicologia,
        educacaoGeral: this.educacaoGeral,
        linguagens: this.linguagens,
        medicina: this.medicina,
        educacaoSuperior: this.educacaoSuperior,
        // Criação
        alquimia: this.alquimia,
        artesanatoEngenharia: this.artesanatoEngenharia,
        culinaria: this.culinaria,
        // Interpessoais
        persuasao: this.persuasao,
        intimidacao: this.intimidacao,
        enganacao: this.enganacao,
        // Ambiente
        investigacao: this.investigacao,
        sobrevivencia: this.sobrevivencia,
        percepcao: this.percepcao,
        lidarComAnimais: this.lidarComAnimais,
        // Crime
        furtividade: this.furtividade,
        prestidigitacao: this.prestidigitacao,
        fraude: this.fraude,
        // Coordenação
        performance: this.performance,
        iniciativa: this.iniciativa,
        // Resistência
        constituicao: this.constituicao,
        vontade: this.vontade
      };
    }
  
    // Traços
    getTracos() {
      return {
        raiz: this.tracoRaiz,
        subraiz: this.tracoSubraiz,
        raca: this.tracoRaca,
        cultura: this.tracoCultura,
        corpo: this.tracoCorpo,
        defeitos: this.tracoDefeitos,
        efeitos: this.tracoEfeitos,
        peso: this.tracoPeso,
        historia: this.tracoHistoria
      };
    }
  
    // Métodos utilitários
    reduzirEter(valor) {
      this.eter -= valor;
    }
    adicionarEter(valor) {
      this.eter += valor;
    }
    reduzirVida(valor) {
      this.vida -= valor;
    }
    adicionarVida(valor) {
      this.vida += valor;
    }
    reduzirSanidade(valor) {
      this.sanidade -= valor;
    }
    adicionarSanidade(valor) {
      this.sanidade += valor;
    }
    reduzirDefesa(valor) {
        this.defesa -= valor;
    }
    adicionarDefesa(valor) {
        this.defesa += valor;
    }
  
    // Status geral formatado
    obterStatus() {
      return `Vida: ${this.vida}/${this.vidaMax} | Éter: ${this.eter}/${this.eterMax} | Sanidade: ${this.sanidade}/${this.sanidadeMax} | Defesa: ${this.defesa}/${this.defesaMax}`;
    }
}
  

function atualizarBarra(id, valor, max) {
    const barra = document.getElementById(id);
    if (!barra) {
      console.warn(`atualizarBarra: elemento com id "${id}" não encontrado.`);
      console.log("Atualizando barra:", id);
      return;
    }
  
    const barraContainer = barra.parentElement;
    const percentual = (valor / max) * 100;
  
    if (barraContainer.classList.contains('vertical')) {
      barra.style.height = percentual + '%';
      barra.style.width = '100%';
    } else {
      barra.style.width = percentual + '%';
      barra.style.height = '100%';
    }
}
  

function atualizarInfoPersonagem(personagem) {
    if (!personagem) {
      console.error('O objeto "personagem" está indefinido ou nulo.');
      return;
    }
  
    // Helper para escrever texto só se o elemento existir
    function setText(id, value) {
      const el = document.getElementById(id);
      if (el) {
        el.innerText = value;
      } else {
        console.warn(`setText: elemento "${id}" não encontrado.`);
      }
    }
  
    // Atualiza imagem
    const imgEl = document.getElementById('status-img');
    if (imgEl) {
      imgEl.src = personagem.img || '';
      window.imgpersonagem = personagem.img || '';
      atualizarIconeIndicador();
    }
  
    // Atualiza token
    const tokEl = document.getElementById('status-token');
    if (tokEl) tokEl.src = personagem.token || '';
  
    // Atributos principais
    setText('status-vida1',     personagem.vida);
    setText('status-vida',      personagem.vida);
    setText('status-eter1',     personagem.eter);
    setText('status-eter',      personagem.eter);
    setText('status-sanidade1', personagem.sanidade);
    setText('status-sanidade',  personagem.sanidade);
    setText('status-defesa1',   personagem.defesa);
    setText('status-defesa',    personagem.defesa);
  
    // Barras
    atualizarBarra('status-bar-vida1',     personagem.vida,     personagem.vidaMax);
    atualizarBarra('status-bar-vida',      personagem.vida,     personagem.vidaMax);
    atualizarBarra('status-bar-eter1',     personagem.eter,     personagem.eterMax);
    atualizarBarra('status-bar-eter',      personagem.eter,     personagem.eterMax);
    atualizarBarra('status-bar-sanidade1', personagem.sanidade, personagem.sanidadeMax);
    atualizarBarra('status-bar-sanidade',  personagem.sanidade, personagem.sanidadeMax);
    atualizarBarra('status-bar-defesa1',   personagem.defesa,   personagem.defesaMax);
    atualizarBarra('status-bar-defesa',    personagem.defesa,   personagem.defesaMax);
  
    // Atributos base
    const attrs = personagem.getAtributos();
    // Atributos base
    setText('status-vigor',           attrs.vigor);
    setText('status-força',           attrs.forca);          // ou, melhor ainda, renomeie para 'status-forca'
    setText('status-destreza',        attrs.destreza);
    setText('status-inteligencia',    attrs.inteligencia);
    setText('status-espiritualidade', attrs.espiritualidade);

  
    // Perícias
    const per = personagem.getPericias();
    setText('status-pericia-acrobacia',            per.acrobacia);
    setText('status-pericia-luta',                 per.luta);
    setText('status-pericia-pontaria',             per.pontaria);
    setText('status-pericia-bloqueio',             per.bloqueio);
    setText('status-pericia-reflexos',             per.reflexos);
  
    setText('status-pericia-rituais',              per.rituais);
    setText('status-pericia-criptozoologia',       per.criptozoologia);
    setText('status-pericia-simbolismo',           per.simbolismo);
    setText('status-pericia-intuicao',             per.intuicao);
  
    setText('status-pericia-psicologia',           per.psicologia);
    setText('status-pericia-educacao-geral',       per.educacaoGeral);
    setText('status-pericia-linguagens',           per.linguagens);
    setText('status-pericia-medicina',             per.medicina);
    setText('status-pericia-educacao-superior',    per.educacaoSuperior);
  
    setText('status-pericia-alquimia',             per.alquimia);
    setText('status-pericia-artesanato-engenharia',per.artesanatoEngenharia);
    setText('status-pericia-culinaria',            per.culinaria);
  
    setText('status-pericia-persuasao',            per.persuasao);
    setText('status-pericia-intimidacao',          per.intimidacao);
    setText('status-pericia-enganacao',            per.enganacao);
  
    setText('status-pericia-investigacao',         per.investigacao);
    setText('status-pericia-sobrevivencia',        per.sobrevivencia);
    setText('status-pericia-percepcao',            per.percepcao);
    setText('status-pericia-lidar-com-animais',    per.lidarComAnimais);
  
    setText('status-pericia-furtividade',          per.furtividade);
    setText('status-pericia-prestidigitacao',      per.prestidigitacao);
    setText('status-pericia-fraude',               per.fraude);

    setText('status-pericia-performance',          per.performance);
    setText('status-pericia-iniciativa',           per.iniciativa);

    setText('status-pericia-constituicao',        per.constituicao);
    setText('status-pericia-vontade',             per.vontade);
  
    // Traços
    const tr = personagem.getTracos();
    setText('status-traco-raiz',       tr.raiz);
    setText('status-traco-subraiz',    tr.subraiz);
    setText('status-traco-raca',       tr.raca);
    setText('status-traco-cultura',    tr.cultura);
    setText('status-traco-corpo',      tr.corpo);
    setText('status-traco-defeitos',   tr.defeitos);
    setText('status-traco-efeitos',    tr.efeitos);
    setText('status-traco-peso',       tr.peso);
    setText('status-traco-historia',   tr.historia);
}  


let danoTotal = 0;

class HabilidadeBase {
    constructor(nome, personagem) {
        this.nome = nome;
        this.personagem = personagem;
        this.id = nome; // Define o ID da habilidade igual ao nome
    }

    rolarDado(lados, quantidade = 1) {
        let resultados = [];
        for (let i = 0; i < quantidade; i++) {
            resultados.push(Math.floor(Math.random() * lados) + 1);
        }
        return [resultados, resultados.reduce((a, b) => a + b, 0), lados * quantidade];
    }
}

// Variável para armazenar a fila de mensagens
const filaDeMensagens = [];

function mostrarMensagem(mensagem) {
    const dialog = document.getElementById('custom-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogOkButton = document.getElementById('dialog-ok-button');

    // Adiciona a mensagem à fila de mensagens
    filaDeMensagens.push(mensagem);

    // Verifica se o diálogo já está sendo exibido
    if (dialog.style.display === 'none' || dialog.style.display === '') {
        exibirProximaMensagem();
        exibirBlurBackground(); // Exibe o blur-background ao mostrar o primeiro diálogo
    }
}

function exibirProximaMensagem() {
    const dialog = document.getElementById('custom-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogOkButton = document.getElementById('dialog-ok-button');

    // Verifica se há mensagens na fila
    if (filaDeMensagens.length > 0) {
        // Obtem a próxima mensagem da fila
        const mensagem = filaDeMensagens.shift(); // Remove e retorna o primeiro elemento da fila

        // Define a mensagem no diálogo e exibe
        dialogMessage.innerText = mensagem;
        dialog.style.display = 'flex';

        // Limpa qualquer evento onclick anterior do botão
        dialogOkButton.onclick = null;

        // Define o evento onclick para fechar o diálogo e exibir a próxima mensagem
        dialogOkButton.onclick = function() {
            dialog.style.display = 'none';
            // Verifica se ainda há mensagens na fila após fechar o diálogo
            if (filaDeMensagens.length === 0) {
                esconderBlurBackground(); // Esconde o blur-background ao fechar o último diálogo
            }
            exibirProximaMensagem(); // Exibe a próxima mensagem da fila

        };
    }
}

function exibirBlurBackground() {
    const blurBackground = document.getElementById('blur-background');
    blurBackground.style.display = 'block';
}

function esconderBlurBackground() {
    const blurBackground = document.getElementById('blur-background');
    blurBackground.style.display = 'none';
}

let infoIntervalId = null;

function openTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  // Marca aba ativa
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.innerText.toLowerCase() === tabName);
  });

  // Exibe conteúdo correspondente e controla intervalo de atualização
  contents.forEach(content => {
    const isThis = content.id === tabName;
    content.classList.toggle('active', isThis);

    if (isThis && tabName === 'info') {
      // Atualiza imediatamente a interface
      if (personagem) {
        atualizarInfoPersonagem(personagem);
      }

      // Se já houver um interval rodando, limpa antes
      if (infoIntervalId) {
        clearInterval(infoIntervalId);
      }

      // Seta novo intervalo de 5s
      infoIntervalId = setInterval(() => {
        if (personagem) {
          atualizarInfoPersonagem(personagem);
        }
      }, 5000);
    }
  });

  // Se mudou pra outra aba que não é 'info', limpa o interval
  if (tabName !== 'info' && infoIntervalId) {
    clearInterval(infoIntervalId);
    infoIntervalId = null;
  }
}


function openSubtab(tabName, subtabName) {
    // Esconde todas as subcontent e remove a classe "active" das subtabs
    var subcontents = document.querySelectorAll('.subcontent');
    for (var i = 0; i < subcontents.length; i++) {
        subcontents[i].classList.remove('active');
    }

    var subtabs = document.querySelectorAll('.subtab');
    for (var i = 0; i < subtabs.length; i++) {
        subtabs[i].classList.remove('active');
    }

    // Exibe a subcontent selecionada e adiciona a classe "active" na subtab correspondente
    var subcontent = document.getElementById(subtabName);
    if (subcontent) {
        subcontent.classList.add('active');
        document.querySelector('.subtab[data-tab="' + subtabName + '"]').classList.add('active');
    }

    // Verifica se estamos na aba "Habilidades" e mostra o texto de nenhuma habilidade selecionada se necessário
    if (tabName === 'skills' && subtabName === 'habilidades') {
        if (nenhumaHabilidadeSelecionada()) {
            document.getElementById('texto-nenhuma-habilidade').style.display = 'block';
        } else {
            document.getElementById('texto-nenhuma-habilidade').style.display = 'none';
        }
    }


}

// Funcao para verificar e exibir mensagem quando nenhuma habilidade está selecionada
function verificarHabilidadeSelecionada() {
    var habilidadeNome = document.getElementById('habilidade-nome').innerText.trim();
    
    if (habilidadeNome === '') {
      document.getElementById('habilidade-descricao').innerText = 'Escolha uma habilidade na aba escolha.';
    }
  }
  


// Chamada inicial para verificar se há uma habilidade selecionada ao carregar a página
verificarHabilidadeSelecionada();

function escolherHabilidade(habilidadeId, habilidadesData) {
    console.log(`Habilidade selecionada: ${habilidadeId}`);
    console.log('habilidadesData:', habilidadesData);

    try {
        const habilidade = habilidadesData.habilidades.find(h => h.id.toString() === habilidadeId.toString());
        if (habilidade) {
            // Muda para a aba "Habilidades"
            openSubtab('skills', 'habilidades');
            console.log('Habilidade encontrada:', habilidade);
            document.getElementById('habilidade-nome').textContent = habilidade.nome;
            document.getElementById('dano-total').textContent = `Dano: ${habilidade.dano}`;
            if (habilidade.toggle){
                document.getElementById('teste-habilidade').textContent = `Teste: ${habilidade.pericia} + ${habilidade.atributo}` + (habilidade.vantagens ? ` + ${habilidade.vantagens}` : '' + (habilidade.modificador ? ` + ${habilidade.modificador}` : '')); // Atualiza o teste de habilidade
            }else{
                document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
            }
            let tempdescrição = habilidade.descricao; // Armazena a descricao da habilidade
            document.getElementById('habilidade-descricao').textContent = tempdescrição; // Atualiza a descricao da habilidade
            habilidade.descricao = typeof tempdescrição === 'string' ? tempdescrição : ''; // Ensure descricao is a string
            atualizarDescricaoHabilidade(habilidade.descricao); // Chama a funcao para atualizar a descricao

            // Limpa os botões existentes
            const botoesHabilidade = document.getElementById('botoes-habilidade');
            botoesHabilidade.innerHTML = ''; 

            // Adiciona o botão de usar habilidade
            let botaoUsar = document.createElement('button');
            botaoUsar.innerText = "Usar Habilidade";
            botaoUsar.onclick = function () {
                aplicarHabilidade(habilidade);
                atualizarInfoPersonagem(personagem);
            };
            botoesHabilidade.appendChild(botaoUsar);

            atualizarStatus(habilidade.status); // Chama a funcao para atualizar o status
        } else {
            console.error('Habilidade não encontrada:', habilidadeId);
        }
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}

function openSubtab(tab, subtab) {
    console.log(`Abrindo subtab: ${subtab}`);
    const tabElement = document.getElementById(tab);
    const subcontents = tabElement.querySelectorAll('.subcontent');
    const subtabs = tabElement.querySelectorAll('.subtab');

    subcontents.forEach(content => {
        content.classList.remove('active');
    });
    subtabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(subtab).classList.add('active');
    tabElement.querySelector(`div[onclick="openSubtab('${tab}', '${subtab}')"]`).classList.add('active');

    // Se a aba for "Google", chama a verificação
    if (subtab === 'Google') {
        console.log('Acessando aba Google...');
        verificarValidadeToken();
    }
}


function limparHabilidades() {
    const escolhaHabilidadesDiv = document.getElementById('escolha-habilidades');
    if (!escolhaHabilidadesDiv) {
        console.warn('Elemento "escolha-habilidades" não encontrado ao tentar limpar habilidades.');
        return;
    }
    const existingButtons = Array.from(escolhaHabilidadesDiv.getElementsByTagName('button'));

    // Imprime os IDs dos botões que serão removidos
    existingButtons.forEach(button => {
        const id = button.getAttribute('data-id');
        if (id === '1') {
            console.log(`Removendo botão com ID: ${id}`);
        }
    });

    // Remove apenas os botões com ID igual a 1
    existingButtons.forEach(button => {
        const id = button.getAttribute('data-id');
        if (id >= '1') {
            escolhaHabilidadesDiv.removeChild(button);
        }
    });
}

function exibirHabilidades(habilidadesData) {
    try {
        console.log("Dados de habilidades carregados:", habilidadesData);

        // Limpa as habilidades carregadas anteriormente
        limparHabilidades();

        const escolhaHabilidadesDiv = document.getElementById('escolha-habilidades');

        habilidadesData.habilidades.forEach(habilidade => {
            const button = document.createElement('button');
            button.textContent = habilidade.nome;
            button.setAttribute('data-id', habilidade.id);
            button.onclick = function() {
                const id = this.getAttribute('data-id');
                console.log(`Botão clicado: ${id}`);
                escolherHabilidade(id, habilidadesData); // Passa habilidadesData como parâmetro
            };
            escolhaHabilidadesDiv.appendChild(button);
        });
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}


function atualizarStatus(status) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = `Status: ${status}`;
    } else {
        console.error('Elemento de status não encontrado.');
    }
    atualizarInfoPersonagem(Personagem)
}

function rolarDano(expressao) {
    let topico = window.topico;
    // Remover espaços e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();

    // Separar os termos por vírgula
    const termosOriginais = expressao.split(',');

    let globalModificador = ''; // modificador global (se houver)
    let termos = [];

    // Separa o modificador global (se presente) de algum termo
    termosOriginais.forEach(termo => {
        if (termo.indexOf(')') !== -1) {
            // Separa o termo em duas partes: antes e depois do ')'
            const partes = termo.split(')');
            termos.push(partes[0]);
            // Se já houver um global definido, concatenamos
            globalModificador += partes[1];
        } else {
            termos.push(termo);
        }
    });

    let totalDano = 0;
    let rolagensTotais = [];
    let valoresIndividuais = [];

    // Regex para identificar a notação: opcional "max", quantidade (opcional), d, faces, opcional "k", e modificadores
    const regex = /^(max)?(\d*)d(\d+)(k?)([+-].+)?$/;

    termos.forEach(termo => {
        let localMax = false; // indica se para este termo os dados serão maximizados

        const match = termo.match(regex);
        if (!match) {
            // Se não bate com o padrão de dados, tenta interpretar como número fixo
            let valorFixo = parseFloat(termo);
            if (isNaN(valorFixo)) {
                throw new Error(`Expressão inválida: ${termo}`);
            }
            totalDano += valorFixo;
            rolagensTotais.push({
                expressao: termo,
                rolagens: `${valorFixo}`,
                totalTermo: valorFixo.toFixed(2)
            });
            valoresIndividuais.push(valorFixo);
            return;
        }

        // Grupos do regex:
        // match[1]: "max" (opcional)
        // match[2]: quantidade (opcional, padrão 1 se vazio)
        // match[3]: faces
        // match[4]: "k" (opcional)
        // match[5]: modificadores (opcional)
        if (match[1] && match[1] === 'max') {
            localMax = true;
        }

        let quantidade = match[2] ? parseInt(match[2]) : 1;
        let faces = parseInt(match[3]);
        let keepHighest = (match[4] === 'k');
        let mods = match[5] || '';

        // Processar modificadores deste termo
        let modificadoresFixos = 0;
        let modificadoresPercentuais = 0;
        let modText = '';
        const modMatches = mods.match(/([+-]\d+%?)/g) || [];
        modMatches.forEach(mod => {
            modText += mod;
            if (mod.endsWith('%')) {
                modificadoresPercentuais += parseFloat(mod.slice(0, -1)) || 0;
            } else {
                modificadoresFixos += parseFloat(mod) || 0;
            }
        });

        if (faces <= 0 || quantidade <= 0) {
            throw new Error(`Expressão inválida: ${termo}`);
        }

        let rolagens = [];
        let totalTermo = 0;

        // Rolar os dados para este termo
        for (let i = 0; i < quantidade; i++) {
            let valor;
            // Se "max" foi especificado para este termo, usa o valor máximo para cada dado
            if (localMax) {
                valor = faces;
            } else {
                valor = Math.floor(Math.random() * faces) + 1;
            }
            rolagens.push(valor);
            valoresIndividuais.push(valor);
            // Se não for "keep highest", soma cada valor individualmente
            if (!keepHighest) {
                totalTermo += valor;
            }
        }

        // Se "k" foi utilizado, utiliza apenas o maior valor dentre os lançamentos
        if (keepHighest) {
            totalTermo = Math.max(...rolagens);
        }

        // Aplicar modificadores fixos e percentuais para o termo
        totalTermo += modificadoresFixos;
        if (modificadoresPercentuais !== 0) {
            // O bônus percentual é calculado e somado ao total deste termo
            const bonusPercentual = totalTermo * (modificadoresPercentuais / 100);
            totalTermo += bonusPercentual;
        }
        // Arredonda o total do termo para 2 casas decimais
        totalTermo = parseFloat(totalTermo.toFixed(2));

        totalDano += totalTermo;
        rolagensTotais.push({
            expressao: `${(match[2] ? match[2] : '1')}d${faces}${(keepHighest ? 'k' : '')}${modText}`,
            rolagens: rolagens.join(', '),
            totalTermo: totalTermo.toFixed(2)
        });
    });

    // Variáveis para armazenar os modificadores globais
    let globalFixos = 0;
    let globalPercentuais = 0;

    // Aplicar modificador global, se houver
    if (globalModificador) {
        const globalMods = globalModificador.match(/([+-]?\d+%?)/g) || [];
        globalMods.forEach(mod => {
            if (mod.includes('%')) {
                globalPercentuais += parseFloat(mod.replace('%', '')) || 0;
            } else {
                globalFixos += parseFloat(mod) || 0;
            }
        });
        totalDano += globalFixos;
        if (globalPercentuais !== 0) {
            const bonusGlobal = totalDano * (globalPercentuais / 100);
            totalDano += bonusGlobal;
        }
    }

    // Arredonda o dano total para baixo (soma final)
    const danoFinal = Math.floor(totalDano);

    // Montar a mensagem final
    let mensagem = '';
    rolagensTotais.forEach(termo => {
        mensagem += `Dado rolado (${termo.expressao}): ${termo.totalTermo} [(${termo.rolagens})]\n`;
    });
    if (globalModificador) {
        mensagem += `Modificadores globais aplicados: fixos = ${globalFixos}, percentuais = ${globalPercentuais}%\n`;
    }
    mensagem += "Dano total: " + danoFinal;

    if (typeof mostrarMensagem === 'function') {
        mostrarMensagem(mensagem);
    }
    enviarFeedback(topico, danoFinal, valoresIndividuais, expressao);
    return mensagem;
}

function rolarDadosSimples(expressao) {
    // Remover espaços em branco e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();
  
    // Se a expressão for somente um número, retorne-o diretamente.
    if (/^-?\d+$/.test(expressao)) {
        const totalDano = parseInt(expressao, 10);
        if (typeof mostrarMensagem === 'function') {
            mostrarPopup(`Ajuste: ${totalDano}`);
        }
        return totalDano;
    }
  
    // Verificar se há um termo 'max' no início
    let maximo = false;
    if (expressao.startsWith('max')) {
        maximo = true;
        expressao = expressao.slice(3);
    }

    // Verificar se a expressão contém um valor percentual seguido de vidaMax, eterMax ou sanidadeMax
    let percentual = 0;
    let negativo = false;
    let atributo = null;
    const matchPercentual = expressao.match(/^(-)?(\d+)%\s*(vidamax|etermax|sanidademax)$/);

    if (matchPercentual) {
        negativo = !!matchPercentual[1];
        percentual = parseFloat(matchPercentual[2]);
        atributo = matchPercentual[3];

        // Determinar o valor máximo com base no atributo
        let valorMaximo = 0;
        switch (atributo) {
            case 'vidamax':
                valorMaximo = personagem.vidaMax;
                break;
            case 'etermax':
                valorMaximo = personagem.eterMax;
                break;
            case 'sanidademax':
                valorMaximo = personagem.sanidadeMax;
                break;
        }

        // Calcular o ajuste percentual
        let ajuste = (percentual / 100) * valorMaximo;
        if (negativo) ajuste = -ajuste;

        // Aplicar o ajuste ao personagem
        switch (atributo) {
            case 'vidamax':
                personagem.adicionarVida(ajuste);
                break;
            case 'etermax':
                personagem.adicionarEter(ajuste);
                break;
            case 'sanidademax':
                personagem.adicionarSanidade(ajuste);
                break;
        }

        const acao = negativo ? 'reduzida' : 'aumentada';
        mostrarMensagem(`${atributo.replace('max', '')} ${acao} em ${percentual}%: ${ajuste}`);
        mostrarPopup(ajuste);
        return ajuste;
    }

    // Separar os termos de dano por vírgula
    const termos = expressao.split(',');
  
    // Preparar para armazenar o resultado total do dano
    let totalDano = 0;
    let rolagensTotais = [];
    let valoresIndividuais = [];
  
    // Iterar sobre cada termo de dano
    termos.forEach(origTermo => {
        let termo = origTermo;
        let negativeTerm = false;
        if (termo.startsWith('-')) {
            negativeTerm = true;
            termo = termo.slice(1);
        }

        const indexD = termo.indexOf('d');
        let quantidade = 1;
        let faces = 0;
        let modificador = 0;

        if (indexD !== -1) {
            quantidade = parseInt(termo.slice(0, indexD)) || 1;
            const restante = termo.slice(indexD + 1);

            const match = restante.match(/^(\d+)([+-]\d+)?$/);
            if (match) {
                faces = parseInt(match[1]) || 0;
                modificador = parseInt(match[2]) || 0;
            }
        } else {
            faces = parseInt(termo) || 0;
        }

        if (faces <= 0 || quantidade <= 0) {
            throw new Error(`Expressão inválida: ${origTermo}`);
        }

        let rolagens = [];
        let totalTermo = 0;

        for (let i = 0; i < quantidade; i++) {
            const rolagem = maximo ? faces : Math.floor(Math.random() * faces) + 1;
            rolagens.push(rolagem);
            totalTermo += rolagem;
            valoresIndividuais.push(rolagem);
        }

        totalTermo += modificador;
        if (negativeTerm) {
            totalTermo = -totalTermo;
        }

        totalDano += totalTermo;

        let expStr = `${quantidade}d${faces}`;
        if (modificador !== 0) {
            expStr += (modificador > 0 ? '+' : '') + modificador;
        }
        if (negativeTerm) {
            expStr = '-' + expStr;
        }

        rolagensTotais.push({
            expressao: expStr,
            rolagens: rolagens.join(', '),
            totalTermo: totalTermo
        });
    });

    mostrarPopup(totalDano);
    return totalDano;
}

function salvarStatusAtualLocalStorage() {
    if (!window.nomepersonagem) {
        console.warn("Nome do personagem não definido.");
        return;
    }
    const chave = `${window.nomepersonagem}-302XPersonagem`;
    const data = localStorage.getItem(chave);
    if (!data) {
        console.warn("Dados do personagem não encontrados no localStorage.");
        return;
    }
    try {
        const personagemData = JSON.parse(data);
        personagemData.vida = personagem.vida; // Atualiza a vida atual
        personagemData.energia = personagem.energia; // Atualiza energia atual
        personagemData.sanidade = personagem.sanidade; // Atualiza sanidade atual
        localStorage.setItem(chave, JSON.stringify(personagemData, null, 2));
        // Opcional: mostrar mensagem
        // mostrarMensagem("Status atual salvo!");
    } catch (e) {
        console.error("Erro ao salvar status atual:", e);
    }
}

function atualizarVida(custo) {
    personagem.vida -= custo;
    document.getElementById('status-vida').textContent = `Vida: ${personagem.vida}`;
    
    // Envia um evento para o processo principal para exibir um diálogo
    mostrarMensagem(`Vida restante após gastar ${custo} de vida.`);
    atualizarInfoPersonagem(personagem);
}

function atualizarDefesa(custo, cooldown) {
    personagem.defesa -= custo;
    document.getElementById('status-defesa').textContent = `Defesa: ${personagem.defesa}`;
    
    // Envia um evento para o processo principal para exibir um diálogo
    mostrarMensagem(`Defesa restante após gastar ${custo} de defesa. Numero de circulos: ${cooldown}`);
    atualizarInfoPersonagem(personagem);
}

function atualizarEter(custo, cooldown) {
    personagem.eter -= custo;
    document.getElementById('status-eter').textContent = `Eter: ${personagem.eter}`;
    
    // Envia um evento para o processo principal para exibir um diálogo
    mostrarMensagem(`Eter restante após gastar ${custo} de eter. Numero de circulos: ${cooldown}`);
    atualizarInfoPersonagem(personagem);
}


function usarHabilidade() {
    // Obtem o nome da habilidade ativa na aba "Habilidades"
    const habilidadeNome = document.getElementById('habilidade-nome').textContent.trim();

    if (!habilidadeNome) {
        mostrarMensagem('Nome da habilidade não encontrado.');
        return;
    }

    try {
        // Verifica se habilidadesData está disponível globalmente
        if (!habilidadesData || !habilidadesData.habilidades) {
            throw new Error('Dados de habilidades não estão disponíveis.');
        }

        // Procura a habilidade pelo nome
        const habilidade = habilidadesData.habilidades.find(h => h.nome === habilidadeNome);

        if (habilidade) {
            console.log('Habilidade encontrada:', habilidade);
            document.getElementById('habilidade-nome').textContent = habilidade.nome;
            atualizarDescricaoHabilidade(habilidade.nome); // Chamando funcao para buscar e atualizar descricao
            document.getElementById('dano-total').textContent = `Dano: ${habilidade.dano}`;
            if (habilidade.toggle){
                document.getElementById('teste-habilidade').textContent = `Teste: ${habilidade.pericia} + ${habilidade.atributo}` + (habilidade.vantagens ? ` + ${habilidade.vantagens}` : '' + (habilidade.modificador ? ` + ${habilidade.modificador}` : '')); // Atualiza o teste de habilidade
            }else{
                document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
            }
            document.getElementById('status').textContent = `Status: ${habilidade.status}`;
            aplicarHabilidade(habilidade);
            atualizarStatus(habilidade.status); // Chama a funcao para atualizar o status
        } else {
            mostrarMensagem('Habilidade não encontrada:', habilidadeNome);
        }
    } catch (error) {
        mostrarMensagem('Erro ao processar dados de habilidades: ' + error.message);
    }
}


function atualizarDescricaoHabilidade(nomeHabilidade) {
    try {
        // Procura a habilidade pelo nome na variável global window.habilidadesData
        const habilidade = window.habilidadesData.habilidades.find(h => h.nome === nomeHabilidade);
        if (habilidade) {
            console.log('Descricao da habilidade:', habilidade.descricao);
            document.getElementById('habilidade-descricao').textContent = habilidade.descricao; // Atualiza a descricao da habilidade
        } else {
            console.error('Habilidade não encontrada:', nomeHabilidade);
        }
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function aplicarHabilidade(habilidade) {
    let testerolado;
    if (habilidade.toggle) {
        window.topico = 'Teste da Habilidade **' + habilidade.nome + "** - " + habilidade.atributo + ' - ' + habilidade.pericia;
        testerolado = acao(habilidade.atributo, habilidade.pericia, habilidade.vantagens, habilidade.modificador, habilidade); // Chama a funcao para acao
        console.log(`Teste de Habilidade: ${testerolado}`);
    }
    await delay(1000);
    window.topico = 'Habilidade - ' + habilidade.nome;
    const danoRolado = rolarDano(habilidade.dano);
    const newEter = rolarDadosSimples(habilidade.custo);
    const newLife = rolarDadosSimples(habilidade.custoVida);
    atualizarEter(newEter, habilidade.cooldown);
    atualizarVida(newLife); // Subtrai o custo de vida usando a função ajustarVida
    atualizarStatus(newLife); // Chama a funcao para atualizar o status

    console.log(`Dano rolado: ${danoRolado}`);
    document.getElementById('dano-total').textContent = `Dano: ${danoRolado}`;
    if (habilidade.toggle){
        document.getElementById('teste-habilidade').textContent = `Teste: ${testerolado}`; // Atualiza o teste de habilidade
    }else{
        document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
    }
    atualizarInfoPersonagem(personagem);
}

function sair() {
    console.log("Sair clicado");
    // Implementar a lógica para a acao de sair
}  

function mostrarPopup(mensagem, duracao = 2000) {
    const popup = document.getElementById('popup-alert');
    const text = document.getElementById('popup-alert-text');
    
    text.textContent = "🎲 " + mensagem + " 🎲";
    
    // Remove classes antigas e adiciona a classe 'show' para disparar o fade in e o slide
    popup.classList.remove('hide');
    popup.classList.add('show');
    
    // Após 'duracao' milissegundos, inicia o fade out
    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hide');
    }, duracao);
}
  

function ajustarEter(multiplicador) {
    let expressao = document.getElementById('ajuste-eter').value.trim();
    // Se for para reduzir e o valor não começar com '-', antepõe o sinal negativo.
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    // Se houver '%' e nenhum atributo definido, anexa "etermax"
    if (expressao.includes('%') && !/(vidamax|etermax|sanidademax)/i.test(expressao)) {
        expressao += 'etermax';
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de eter");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarEter(valorAjuste);
    } else if (multiplicador === -1) {
      // Garante que a redução seja aplicada como valor positivo
      personagem.reduzirEter(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de eter");
      return;
    }
    
    atualizarInfoPersonagem(personagem);
}
  
function ajustarSanidade(multiplicador) {
    let expressao = document.getElementById('ajuste-sanidade').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    // Se houver '%' e nenhum atributo definido, anexa "sanidademax"
    if (expressao.includes('%') && !/(vidamax|etermax|sanidademax)/i.test(expressao)) {
        expressao += 'sanidademax';
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de sanidade");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarSanidade(valorAjuste);
    } else if (multiplicador === -1) {
      personagem.reduzirSanidade(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de sanidade");
      return;
    }
    
    atualizarInfoPersonagem(personagem);
}
  
function ajustarVida(multiplicador) {
    let expressao = document.getElementById('ajuste-vida').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    // Se houver '%' e nenhum atributo definido, anexa "vidamax"
    if (expressao.includes('%') && !/(vidamax|etermax|sanidademax)/i.test(expressao)) {
        expressao += 'vidamax';
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de vida");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarVida(valorAjuste);
    } else if (multiplicador === -1) {
      personagem.reduzirVida(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de vida");
      return;
    }
    
    atualizarInfoPersonagem(personagem);
}
  

function rolarDadosCalculo(atributo, pericia, vantagemGlobal = 0, modificadorGlobal = 0) {
    atributo = Number(atributo) || 0;
    pericia = Number(pericia) || 0;
    vantagemGlobal = Number(vantagemGlobal) || 0;
    modificadorGlobal = Number(modificadorGlobal) || 0;

    let numD20 = 1;
    let rolagensD20 = [];

    if (pericia <= 0) {
        numD20 = 2 + vantagemGlobal;
    } else if (pericia === 1) {
        numD20 = 1 + vantagemGlobal;
    } else if (pericia >= 2) {
        numD20 = 2 + vantagemGlobal;
    }

    for (let i = 0; i < numD20; i++) {
        rolagensD20.push(Math.floor(Math.random() * 20) + 1);
    }
    const d20 = Math.max(...rolagensD20);

    // Soma atributo e perícia
    const somaAtributoPericia = atributo + pericia;
    const resultadoFinal = d20 + somaAtributoPericia + modificadorGlobal;

    // Mensagem detalhada
    let mensagem = `Rolagem: ${rolagensD20.join(", ")} (maior: ${d20})\n`;
    mensagem += `Atributo (${atributo}) + Perícia (${pericia}) = ${somaAtributoPericia}\n`;
    mensagem += `Soma final: ${d20} + ${somaAtributoPericia} + modificador global (${modificadorGlobal}) = ${resultadoFinal}`;

    mostrarMensagem(mensagem);

    // Inclui os valores de atributo e perícia na fórmula do feedback
    enviarFeedback(
        window.topico,
        resultadoFinal,
        rolagensD20,
        `d20${numD20 > 1 ? " (vantagem)" : ""} (${rolagensD20.join(", ")}) + atributo (${atributo}) + perícia (${pericia}) + modGlobal (${modificadorGlobal})`
    );

    return mensagem;
}

function acao(atributo, pericia, numeroVantagens, modificador, habilidade) {
    let valorAtributo = 0;
    let valorPericia = 0;

    // Seleciona o atributo
    switch (atributo) {
        case 'força':
            valorAtributo = personagem.forca;
            break;
        case 'vigor':
            valorAtributo = personagem.vigor;
            break;
        case 'destreza':
            valorAtributo = personagem.destreza;
            break;
        case 'inteligencia':
            valorAtributo = personagem.inteligencia;
            break;
        case 'espiritualidade':
            valorAtributo = personagem.espiritualidade;
            break;
        default:
            valorAtributo = 0;
    }

    // Seleciona a perícia
    switch (pericia) {
        // Físicas / Combate
        case 'acrobacia':
            valorPericia = personagem.acrobacia;
            break;
        case 'luta':
            valorPericia = personagem.luta;
            break;
        case 'pontaria':
            valorPericia = personagem.pontaria;
            break;
        case 'bloqueio':
            valorPericia = personagem.bloqueio;
            break;
        case 'reflexos':
            valorPericia = personagem.reflexos;
            break;

        // Misticismo
        case 'rituais':
            valorPericia = personagem.rituais;
            break;
        case 'criptozoologia':
            valorPericia = personagem.criptozoologia;
            break;
        case 'simbolismo':
            valorPericia = personagem.simbolismo;
            break;
        case 'intuicao':
            valorPericia = personagem.intuicao;
            break;

        // Acadêmicas
        case 'psicologia':
            valorPericia = personagem.psicologia;
            break;
        case 'educacaoGeral':
            valorPericia = personagem.educacaoGeral;
            break;
        case 'linguagens':
            valorPericia = personagem.linguagens;
            break;
        case 'medicina':
            valorPericia = personagem.medicina;
            break;
        case 'educacaoSuperior':
            valorPericia = personagem.educacaoSuperior;
            break;

        // Criação
        case 'alquimia':
            valorPericia = personagem.alquimia;
            break;
        case 'artesanatoEngenharia':
            valorPericia = personagem.artesanatoEngenharia;
            break;
        case 'culinaria':
            valorPericia = personagem.culinaria;
            break;

        // Interpessoais
        case 'persuasao':
            valorPericia = personagem.persuasao;
            break;
        case 'intimidacao':
            valorPericia = personagem.intimidacao;
            break;
        case 'enganacao':
            valorPericia = personagem.enganacao;
            break;

        // Ambiente
        case 'investigacao':
            valorPericia = personagem.investigacao;
            break;
        case 'sobrevivencia':
            valorPericia = personagem.sobrevivencia;
            break;
        case 'percepcao':
            valorPericia = personagem.percepcao;
            break;
        case 'lidarComAnimais':
            valorPericia = personagem.lidarComAnimais;
            break;

        // Crime
        case 'furtividade':
            valorPericia = personagem.furtividade;
            break;
        case 'prestidigitacao':
            valorPericia = personagem.prestidigitação;
            break;
        case 'fraude':
            valorPericia = personagem.fraude;
            break;

        // Coordenação
        case 'performance':
            valorPericia = personagem.performance;
            break;
        case 'iniciativa':
            valorPericia = personagem.iniciativa;
            break;

        // Resistência
        case 'constituicao':
            valorPericia = personagem.constituicao;
            break;
        case 'vontade':
            valorPericia = personagem.vontade;
            break;

        default:
            valorPericia = 0;
    }

    // Retorna o resultado do teste
    console.log(`Rolando dados para: Atributo = ${atributo} (${valorAtributo}), Perícia = ${pericia} (${valorPericia}), Vantagens = ${numeroVantagens}, Modificador = ${modificador}`);
    return rolarDadosCalculo(valorAtributo, valorPericia, numeroVantagens, modificador);
}

function rolarDados() {
    window.topico = 'Dados a parte';
    // Obtém os valores dos campos do formulário, usando 0 como padrão se a conversão falhar
    const formatoVantagem = document.getElementById('formatoVantagem').value;
    const numTotal = parseInt(document.getElementById('numTotal').value, 10) || 0;
    const somatorio = parseInt(document.getElementById('somatorio').value, 10) || 0;

    const tipoDado1 = parseInt(document.getElementById('tipoDado1').value, 10) || 0;
    const numTipoDado1 = parseInt(document.getElementById('numTipoDado1').value, 10) || 0;

    // Se o campo estiver vazio ou inválido, assume null para o tipo ou 0 para o número de dados
    const tipoDado2 = document.getElementById('tipoDado2').value ? parseInt(document.getElementById('tipoDado2').value, 10) : null;
    const numTipoDado2 = parseInt(document.getElementById('numTipoDado2').value, 10) || 0;

    const tipoDado3 = document.getElementById('tipoDado3').value ? parseInt(document.getElementById('tipoDado3').value, 10) : null;
    const numTipoDado3 = parseInt(document.getElementById('numTipoDado3').value, 10) || 0;

    // Função para rolar um dado de um tipo específico
    function rolarDado(tamanho) {
        return Math.floor(Math.random() * tamanho) + 1;
    }

    // Função para rolar múltiplos dados
    function rolarDadosTipo(tipoDado, numDados) {
        return Array.from({ length: numDados }, () => rolarDado(tipoDado));
    }

    // Função para interpretar o formato personalizado dos dados de vantagem (ex: "2d6")
    function interpretarFormato(formato) {
        const partes = formato.split('d');
        const numDados = parseInt(partes[0], 10) || 0;
        const tipoDado = parseInt(partes[1], 10) || 0;
        return rolarDadosTipo(tipoDado, numDados);
    }

    // Array para armazenar os resultados dos dados de vantagem
    const resultadosVantagem = formatoVantagem ? interpretarFormato(formatoVantagem) : [];

    // Se houver dados de vantagem, pega o maior valor; caso contrário, 0
    const maiorVantagem = resultadosVantagem.length > 0 ? Math.max(...resultadosVantagem) : 0;

    // Array para armazenar os resultados dos dados totais
    const resultadosTotal = [];

    // Rolar os dados do tipo 1
    if (numTipoDado1 > 0) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado1, numTipoDado1));
    }

    // Rolar os dados do tipo 2 (se selecionado)
    if (numTipoDado2 > 0 && tipoDado2) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado2, numTipoDado2));
    }

    // Rolar os dados do tipo 3 (se selecionado)
    if (numTipoDado3 > 0 && tipoDado3) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado3, numTipoDado3));
    }

    // Adiciona o maior valor dos dados de vantagem ao total
    resultadosTotal.push(maiorVantagem);
    
    // Calcula o somatório total (soma dos resultados dos dados + somatório adicional)
    const somaTotal = resultadosTotal.reduce((a, b) => a + b, 0) + somatorio;
    
    // Monta a string para exibir os resultados na interface
    const resultadoHtml = `
        <p><strong>Dados de Vantagem Rolados:</strong> ${resultadosVantagem.length > 0 ? resultadosVantagem.join(', ') : 'Nenhum dado de vantagem rolado'}</p>
        <p><strong>Maior Dado de Vantagem:</strong> ${maiorVantagem || 'Nenhum dado de vantagem rolado'}</p>
        <p><strong>Dados Totais Rolados:</strong> ${resultadosTotal.join(', ')}</p>
        <p><strong>Somatório:</strong> ${somaTotal}</p>
    `;
    
    // Define as variáveis a serem enviadas no feedback:
    const resultadofinal = somaTotal;
    const valoresretirados = resultadosTotal; // array com os valores rolados
    const formuladecalculo = resultadosTotal.join(' + ') + (somatorio ? ` + ${somatorio}` : '');
    
    // Chama a função de feedback
    enviarFeedback(window.topico, resultadofinal, valoresretirados, formuladecalculo);
    
    // Exibe o resultado na div 'resultadoRolagem'
    document.getElementById('resultadoRolagem').innerHTML = resultadoHtml;
}

function executarAcao() {
    let atributo = document.getElementById('atributoSelect1').value;
    let pericia = document.getElementById('periciaSelect1').value;
    window.topico = 'Acao - ' + atributo + ' + ' + pericia;

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagensInput1').value) || 0;
    let modificador = parseInt(document.getElementById('modificadorInput1').value) || 0;

    let resultado = acao(atributo, pericia, numeroVantagens, modificador);
    
    // Exibir o resultado em um mostrarMensagem
    let mensagem = (`Resultado da Acao: ${resultado}`);

    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItemteste) {
        // Obtém o padrão de dano do item (por exemplo, "1d20+3")
        let danoItem = window.selectedAttackItemteste.damage;
        let nomeItem = window.selectedAttackItemteste.name;
        window.topico = 'Dano - ' + nomeItem;
        
        // Rola o dano utilizando a função rolarDano (definida em script.js)
        let resultadoDano = rolarDano(danoItem);
        
        // Acrescenta o resultado da rolagem do dano à mensagem
        mensagem += `\nDano com ${window.selectedAttackItemteste.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para tiro.`;
    }

    mostrarMensagem(mensagem);
}

// Em script.js
async function executarAtaque() {
    window.topico = 'Ataque';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-ataque').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-ataque').value) || 0;
    
    // Rola o teste de ataque
    let resultadoAtaque = acao('força', 'luta', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de ataque
    let mensagem = `Resultado do Ataque: ${resultadoAtaque}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para ataque
    if (window.selectedAttackItem) {
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      let resultadoDano = rolarDano(danoItem);
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para ataque.`;
    }
    
    mostrarMensagem(mensagem);
}


async function executarTiro() {
    window.topico = 'Atirar';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-tiro').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-tiro').value) || 0;
    
    // Rola o teste de tiro
    let resultadoTiro = acao('agilidade', 'pontaria', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de tiro
    let mensagem = `Resultado do Tiro: ${resultadoTiro}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItem) {
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      let resultadoDano = rolarDano(danoItem);
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para tiro.`;
    }
    
    mostrarMensagem(mensagem);
}
 

function executarDefesa() {
    window.topico = 'Defesa';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-sanidade').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-sanidade').value) || 0;
    
    let resultadoAcao = acao('fortitude', 'vigor', numeroVantagens, modificador); // Exemplo de retorno:

    // Extrair o valor numérico do resultado
    let match = resultadoAcao.match(/Resultado Final:\s*(\d+)/);
    let resultado = match ? Number(match[1]) : NaN;
    if (isNaN(resultado)) {
        mostrarMensagem("Erro: Não foi possível extrair o resultado final.");
        resultado = 0;
    }

    // Se o checkbox de sanidade estiver marcado, soma o valor do sanidade
    let checkboxSanidade = document.getElementById('checkDefesa');
    if (checkboxSanidade && checkboxSanidade.checked) {
        let sanidade = Number(personagem.sanidade); // Converte o valor de sanidade para número
        mostrarMensagem(`Sanidade: ${sanidade}`);
        mostrarMensagem(`Resultado antes do sanidade: ${resultado}`);
        resultado += sanidade; // Soma o valor do sanidade
    }

    let mensagem = (`Resultado da Defesa: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para sanidade.`;
    }

    mostrarMensagem(mensagem);
}


function executarEsquiva() {
    window.topico = 'Esquiva';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-esquiva').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-esquiva').value) || 0;
    
    let resultado = acao('agilidade', 'destreza', numeroVantagens, modificador);

    let mensagem = (`Resultado da Esquiva: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para esquiva.`;
    }

    mostrarMensagem(mensagem);
}


function executarContraAtaque() {
    window.topico = 'Contra-ataque';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-contraataque').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-contraataque').value) || 0;
    
    let resultado = acao('força', 'luta', numeroVantagens, modificador);

    let mensagem = (`Resultado do Contra-ataque: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para contra-ataque.`;
    }

    mostrarMensagem(mensagem);
}


function atualizarStatus() {
    document.getElementById('status').innerText = personagem.obterStatus();
}

function sair() {
    openSubtab('skills', 'escolha');
}

function sairAjustes() {
    openSubtab('actions', 'ajustes');
    openTab('skills');
}

function togglePericias() {
    var content = document.getElementById('pericias-content');
    if (content.classList.contains('content-collapsed')) {
        content.classList.remove('content-collapsed');
        content.classList.add('content-expanded');
    } else {
        content.classList.remove('content-expanded');
        content.classList.add('content-collapsed');
    }
}

function toggleTracos() {
    var content = document.getElementById('tracos-content');
    if (content.classList.contains('content-collapsed')) {
        content.classList.remove('content-collapsed');
        content.classList.add('content-expanded');
    } else {
        content.classList.remove('content-expanded');
        content.classList.add('content-collapsed');
    }
}

async function salvarStatus() {
    alert('atualizar status: ' + atualizarStatusCheck);
    try {
        const nome = document.getElementById('nome').value.trim();
        window.nomepersonagem = nome;
        document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
        if (!nome) {
            alert('Por favor, insira o nome do personagem.');
            return;
        }

        // Helpers para leitura de campos
        const getNumberValue = id => {
            const v = document.getElementById(id).value.trim();
            return v === '' ? null : parseInt(v, 10);
        };
        const getStringValue = id => {
            const v = document.getElementById(id).value.trim();
            return v === '' ? null : v;
        };

        if (!atualizarStatusCheck) {
            // Sobrescreve tudo
            const updatedData = {
                check: document.getElementById('personagemInicial').checked ? 1 : 0,
                img: getStringValue('img'),
                token: getStringValue('token'),

                // Atributos principais
                vida: getNumberValue('vida'),
                vidaMax: getNumberValue('vidaMax'),
                eter: getNumberValue('eter'),
                eterMax: getNumberValue('eterMax'),
                sanidade: getNumberValue('sanidade'),
                sanidadeMax: getNumberValue('sanidadeMax'),
                defesa: getNumberValue('defesa'),
                defesaMax: getNumberValue('defesaMax'),

                // Atributos base
                vigor: getNumberValue('vigor'),
                forca: getNumberValue('forca'),
                destreza: getNumberValue('destreza'),
                inteligencia: getNumberValue('inteligencia'),
                espiritualidade: getNumberValue('espiritualidade'),

                // Perícias Físicas / Combate
                acrobacia: getNumberValue('acrobacia'),
                luta: getNumberValue('luta'),
                pontaria: getNumberValue('pontaria'),
                bloqueio: getNumberValue('bloqueio'),
                reflexos: getNumberValue('reflexos'),
                // Misticismo
                rituais: getNumberValue('rituais'),
                criptozoologia: getNumberValue('criptozoologia'),
                simbolismo: getNumberValue('simbolismo'),
                intuicao: getNumberValue('intuicao'),
                // Acadêmicas
                psicologia: getNumberValue('psicologia'),
                educacaoGeral: getNumberValue('educacaoGeral'),
                linguagens: getNumberValue('linguagens'),
                medicina: getNumberValue('medicina'),
                educacaoSuperior: getNumberValue('educacaoSuperior'),
                // Criação
                alquimia: getNumberValue('alquimia'),
                artesanatoEngenharia: getNumberValue('artesanatoEngenharia'),
                culinaria: getNumberValue('culinaria'),
                // Interpessoais
                persuasao: getNumberValue('persuasao'),
                intimidacao: getNumberValue('intimidacao'),
                enganacao: getNumberValue('enganacao'),
                // Ambiente
                investigacao: getNumberValue('investigacao'),
                sobrevivencia: getNumberValue('sobrevivencia'),
                percepcao: getNumberValue('percepcao'),
                lidarComAnimais: getNumberValue('lidarComAnimais'),
                // Crime
                furtividade: getNumberValue('furtividade'),
                prestidigitacao: getNumberValue('prestidigitacao'),
                fraude: getNumberValue('fraude'),
                // Coordenação
                performance: getNumberValue('performance'),
                iniciativa: getNumberValue('iniciativa'),
                // Resistência
                constituicao: getNumberValue('constituicao'),
                vontade: getNumberValue('vontade'),

                // Traços
                tracoRaiz: getStringValue('tracoRaiz'),
                tracoSubraiz: getStringValue('tracoSubraiz'),
                tracoRaca: getStringValue('tracoRaca'),
                tracoCultura: getStringValue('tracoCultura'),
                tracoCorpo: getStringValue('tracoCorpo'),
                tracoDefeitos: getStringValue('tracoDefeitos'),
                tracoEfeitos: getStringValue('tracoEfeitos'),
                tracoPeso: getStringValue('tracoPeso'),
                tracoHistoria: getStringValue('tracoHistoria'),
            };

            localStorage.setItem(`${nome}-302Xpersonagem`, JSON.stringify(updatedData, null, 2));
            mostrarMensagem('Status do personagem salvo com sucesso!');
            await carregarStatus();

        } else {
            // Atualiza apenas campos não-nulos
            const storedDataStr = localStorage.getItem(`${nome}-302Xpersonagem`);
            if (!storedDataStr) {
                mostrarMensagem('Arquivo não existe.');
                return;
            }
            let currentData = JSON.parse(storedDataStr);

            const updatedData = {
                check: document.getElementById('personagemInicial').checked ? 1 : 0,
                img: getStringValue('img'),
                token: getStringValue('token'),

                // Atributos principais
                vida: getNumberValue('vida'),
                vidaMax: getNumberValue('vidaMax'),
                eter: getNumberValue('eter'),
                eterMax: getNumberValue('eterMax'),
                sanidade: getNumberValue('sanidade'),
                sanidadeMax: getNumberValue('sanidadeMax'),
                defesa: getNumberValue('defesa'),
                defesaMax: getNumberValue('defesaMax'),

                // Atributos base
                vigor: getNumberValue('vigor'),
                forca: getNumberValue('forca'),
                destreza: getNumberValue('destreza'),
                inteligencia: getNumberValue('inteligencia'),
                espiritualidade: getNumberValue('espiritualidade'),

                // Perícias Físicas / Combate
                acrobacia: getNumberValue('acrobacia'),
                luta: getNumberValue('luta'),
                pontaria: getNumberValue('pontaria'),
                bloqueio: getNumberValue('bloqueio'),
                reflexos: getNumberValue('reflexos'),
                // Misticismo
                rituais: getNumberValue('rituais'),
                criptozoologia: getNumberValue('criptozoologia'),
                simbolismo: getNumberValue('simbolismo'),
                intuicao: getNumberValue('intuicao'),
                // Acadêmicas
                psicologia: getNumberValue('psicologia'),
                educacaoGeral: getNumberValue('educacaoGeral'),
                linguagens: getNumberValue('linguagens'),
                medicina: getNumberValue('medicina'),
                educacaoSuperior: getNumberValue('educacaoSuperior'),
                // Criação
                alquimia: getNumberValue('alquimia'),
                artesanatoEngenharia: getNumberValue('artesanatoEngenharia'),
                culinaria: getNumberValue('culinaria'),
                // Interpessoais
                persuasao: getNumberValue('persuasao'),
                intimidacao: getNumberValue('intimidacao'),
                enganacao: getNumberValue('enganacao'),
                // Ambiente
                investigacao: getNumberValue('investigacao'),
                sobrevivencia: getNumberValue('sobrevivencia'),
                percepcao: getNumberValue('percepcao'),
                lidarComAnimais: getNumberValue('lidarComAnimais'),
                // Crime
                furtividade: getNumberValue('furtividade'),
                prestidigitacao: getNumberValue('prestidigitacao'),
                fraude: getNumberValue('fraude'),
                // Coordenação
                performance: getNumberValue('performance'),
                iniciativa: getNumberValue('iniciativa'),
                // Resistência
                constituicao: getNumberValue('constituicao'),
                vontade: getNumberValue('vontade'),

                // Traços
                tracoRaiz: getStringValue('tracoRaiz'),
                tracoSubraiz: getStringValue('tracoSubraiz'),
                tracoRaca: getStringValue('tracoRaca'),
                tracoCultura: getStringValue('tracoCultura'),
                tracoCorpo: getStringValue('tracoCorpo'),
                tracoDefeitos: getStringValue('tracoDefeitos'),
                tracoEfeitos: getStringValue('tracoEfeitos'),
                tracoPeso: getStringValue('tracoPeso'),
                tracoHistoria: getStringValue('tracoHistoria'),
            };

            // Aplica apenas valores não-nulos
            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] !== null) {
                    currentData[key] = updatedData[key];
                }
            });

            localStorage.setItem(`${nome}-302Xpersonagem`, JSON.stringify(currentData, null, 2));
            mostrarMensagem('Status do personagem atualizado com sucesso!');
            await carregarStatus();
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao salvar status do personagem:', error);
        mostrarMensagem('Erro ao salvar status do personagem.');
    }
}


async function writeFile(namePath, filePath, data) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            dirEntry.getFile(namePath, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function () {
                        mostrarMensagem('MyAppLog: Arquivo escrito com sucesso:');
                        resolve();
                    };
                    fileWriter.onerror = function (e) {
                        mostrarMensagem('MyAppLog: Erro ao escrever arquivo:', JSON.stringify(e));
                        reject(e);
                    };
                    fileWriter.write(data);
                });
            }, function (err) {
                mostrarMensagem('MyAppLog: Erro ao obter o arquivo:', JSON.stringify(err));
                reject(err);
            });
        }, function (err) {
            mostrarMensagem('MyAppLog: Erro ao resolver o caminho do diretório:', JSON.stringify(err));
            reject(err);
        });
    });
}

async function carregarStatus() {
    const nomeCarregar = document.getElementById('nomeCarregar').value.trim();
    let nome = nomeCarregar;

    if (!nomeCarregar) {
        const nomeInput = document.getElementById('nome');
        nome = nomeInput.value.trim();

        if (!nome) {
            alert('Por favor, insira o nome do personagem.');
            return;
        }
    }

    window.nomepersonagem = nome;
    document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
    mostrarMensagem(nome);

    window.imgpersonagem = document.getElementById('img').value.trim();
    atualizarIconeIndicador();
    mostrarMensagem(window.imgpersonagem || 'Imagem do Personagem');
    console.log('MyAppLog: Imagem do personagem:', window.imgpersonagem);

    carregarHabilidades(nome);
    try {
        const data = localStorage.getItem(`${nome}-302Xpersonagem`);
        if (data) {
            const personagemData = JSON.parse(data);
            personagem = new Personagem(personagemData);
            atualizarInfoPersonagem(personagem); // Atualiza a interface com os dados do personagem
            mostrarMensagem('Status do personagem carregado com sucesso.');
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar status do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar status do personagem.');
    }

    carregarFichasNaBarra();
}

async function carregarStatusPorNome(nome) {
    // Emula o clique no botão .toggle-container antes de qualquer coisa
    const toggleBtn = document.querySelector('.toggle-container');
    if (toggleBtn) toggleBtn.click();

    if (!nome) {
        alert('Nome inválido do personagem.');
        return;
    }

    window.nomepersonagem = nome;
    document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';

    try {
        const data = localStorage.getItem(`${nome}-302Xpersonagem`);
        if (data) {
            const personagemData = JSON.parse(data);
            personagem = new Personagem(personagemData);

            window.imgpersonagem = personagemData.img || '';
            document.getElementById('img').value = window.imgpersonagem;

            atualizarIconeIndicador();
            console.log('MyAppLog: Imagem do personagem:', window.imgpersonagem);

            atualizarInfoPersonagem(personagem); // Atualiza a interface com os dados do personagem
            carregarHabilidades(nome); // Carrega habilidades
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar status do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar status do personagem.');
    }

    carregarFichasNaBarra(); // Atualiza a barra após carregar
}


async function carregarHabilidades2() {
    // Obter os dados de entrada do usuário
    const nomePersonagem = document.getElementById('nomeCarregarHab').value.trim();
    const nomeHabilidade = document.getElementById('nomeHabilidade').value.trim();
    const dano = document.getElementById('danoHabilidade').value;
    const cooldown = document.getElementById('cooldownHabilidade').value;
    const custo = document.getElementById('custoHabilidade').value;
    const descricao = document.getElementById('descricaoHabilidade').value;
    const custoVida = document.getElementById('custoVidaHabilidade').value; // Novo campo para custo de vida
    const toggle = document.getElementById('toggleHabilidade').checked;
    const pericia = document.getElementById('periciaSelect').value;
    const atributo = document.getElementById('atributoSelect').value;
    const vantagens = document.getElementById('vantagensInput').value;
    const modificador = document.getElementById('modificadorInput').value;
    
    // Verificar se os campos obrigatórios foram preenchidos:
    // Se atualizarHabilidadeCheck for true, exigir apenas nomePersonagem e nomeHabilidade.
    // Caso contrário, exigir todos os campos.
    if (!nomePersonagem || !nomeHabilidade || 
        (!atualizarHabilidadeCheck && (!dano || !cooldown || !custo || !descricao || !custoVida))) {
        mostrarMensagem('Por favor, preencha os campos obrigatórios.');
        return;
    }

    // Chamar a função adicionarHabilidade com os dados capturados
    try {
        await adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador, atualizarHabilidadeCheck);
    } catch (error) {
        console.error('Erro ao adicionar habilidade:', error);
        alert('Erro ao adicionar habilidade.');
    }
}


async function adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador, atualizarHabilidadeCheck) {
    try {
        const key = `${nomePersonagem}-habilidades302X`;
        let habilidadesData = { habilidades: [] };

        // Verificar se os campos obrigatórios foram preenchidos
        if (!nomePersonagem || !nomeHabilidade) {
            mostrarMensagem('Por favor, insira o nome do personagem e o nome da habilidade.');
            return;
        }

        // Verificar se já existem habilidades salvas
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = JSON.parse(data);
        }

        if (atualizarHabilidadeCheck) {
            // Caso seja atualização, encontrar a habilidade correspondente e atualizar apenas os campos alterados
            const habilidadeExistente = habilidadesData.habilidades.find(h => h.nome === nomeHabilidade);

            if (habilidadeExistente) {
                const camposAtualizaveis = {
                    dano,
                    cooldown,
                    custo,
                    descricao,
                    custoVida,
                    toggle,
                    pericia,
                    atributo,
                    vantagens,
                    modificador
                };

                for (const campo in camposAtualizaveis) {
                    if (camposAtualizaveis[campo] !== "" && camposAtualizaveis[campo] !== null && camposAtualizaveis[campo] !== undefined) {
                        habilidadeExistente[campo] = camposAtualizaveis[campo];
                    }
                }

                mostrarMensagem('Habilidade atualizada com sucesso!');
            } else {
                mostrarMensagem('Habilidade não encontrada para atualização.');
                return;
            }
        } else {
            // Exigir preenchimento de todos os campos ao adicionar uma nova habilidade
            if (!dano || !cooldown || !custo || !descricao || !custoVida) {
                mostrarMensagem('Por favor, preencha todos os campos.');
                return;
            }

            // Determinar o próximo ID
            const nextId = (habilidadesData.habilidades.reduce((maxId, habilidade) => Math.max(maxId, parseInt(habilidade.id) || 0), 0) + 1).toString();

            // Adicionar a nova habilidade com ID
            const novaHabilidade = {
                nome: nomeHabilidade,
                id: nextId,
                dano,
                cooldown,
                custo,
                descricao,
                custoVida,
                toggle,
                pericia,
                atributo,
                vantagens,
                modificador
            };

            habilidadesData.habilidades.push(novaHabilidade);
            mostrarMensagem('Habilidade adicionada com sucesso!');
        }

        // Salvar no localStorage
        localStorage.setItem(key, JSON.stringify(habilidadesData, null, 2));
        listarArquivos();
        carregarHabilidades(nomePersonagem);
    } catch (error) {
        console.error('MyAppLog: Erro ao adicionar ou atualizar habilidade:', JSON.stringify(error));
        mostrarMensagem('Erro ao adicionar ou atualizar habilidade.');
    }
}

async function removerHabilidade() {
    // Obter os dados de entrada dos novos campos para remoção
    const nomePersonagem = document.getElementById('nomeRemoverHab').value.trim();
    const nomeHabilidade = document.getElementById('nomeRemoverHabilidade').value.trim();

    // Verificar se os campos obrigatórios foram preenchidos
    if (!nomePersonagem || !nomeHabilidade) {
        mostrarMensagem('Por favor, insira o nome do personagem e o nome da habilidade.');
        return;
    }

    try {
        const key = `${nomePersonagem}-habilidades302X`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            mostrarMensagem('Nenhuma habilidade encontrada para esse personagem.');
            return;
        }

        let habilidadesData = JSON.parse(data);

        // Encontrar o índice da habilidade que será removida
        const index = habilidadesData.habilidades.findIndex(h => h.nome === nomeHabilidade);

        if (index === -1) {
            mostrarMensagem('Habilidade não encontrada.');
            return;
        }

        // Remover a habilidade do array
        habilidadesData.habilidades.splice(index, 1);

        // Atualizar o localStorage com o novo conjunto de habilidades
        localStorage.setItem(key, JSON.stringify(habilidadesData, null, 2));

        mostrarMensagem('Habilidade removida com sucesso!');
        listarArquivos();
        carregarHabilidades(nomePersonagem);
    } catch (error) {
        console.error('MyAppLog: Erro ao remover habilidade:', JSON.stringify(error));
        mostrarMensagem('Erro ao remover habilidade.');
    }
}


async function carregarHabilidades(nomePersonagem) {
    try {
        const key = `${nomePersonagem}-habilidades302X`;
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = await carregarDados(key);
            exibirHabilidades(habilidadesData);
            //mostrarMensagem('Dados das habilidades recebidos.');
            console.log('Dados das habilidades recebidos:', habilidadesData);
            //mostrarMensagem(JSON.stringify(habilidadesData, null, 2));
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar habilidades do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar habilidades do personagem.');
    }
}

function exportarArquivo() {
    const nomeArquivo = document.getElementById('nomeArquivoExportar').value.trim();
    if (!nomeArquivo) {
        alert('Por favor, insira um nome para o arquivo.');
        return;
    }
    
    const dados = localStorage.getItem(nomeArquivo);
    if (dados === null) {
        alert('Arquivo não encontrado no localStorage.');
        return;
    }

    try {
        // Cria um Blob com os dados a serem exportados
        const blob = new Blob([dados], { type: 'text/plain;charset=utf-8' });

        // Cria um link temporário para fazer o download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nomeArquivo;

        // Adiciona o link ao DOM, clica nele e remove-o
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao exportar arquivo:', error);
    }
}

function importarArquivo() {
    const inputElement = document.getElementById('inputArquivoImportar');
    const arquivo = inputElement.files[0];
    if (!arquivo) {
        alert('Por favor, selecione um arquivo para importar.');
        return;
    }

    const nomeArquivoSemExtensao = removerExtensao(arquivo.name);
    const reader = new FileReader();

    reader.onload = function(e) {
        const dados = e.target.result;
        try {
            // Armazena o conteúdo do arquivo no localStorage com o nome do arquivo sem extensão
            localStorage.setItem(nomeArquivoSemExtensao, dados);
            alert('Arquivo importado com sucesso.');
        } catch (error) {
            console.error('Erro ao importar arquivo:', error);
        }
    };

    reader.readAsText(arquivo);
}

function removerExtensao(nomeArquivo) {
    return nomeArquivo.replace(/\.[^/.]+$/, ""); // Remove a extensão do arquivo
}

function listarArquivos() {
    console.log('Arquivos no localStorage:');
    mostrarMensagem('Arquivos no localStorage:');
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Adiciona verificação para arquivos de inventário
        if (key.includes('-302Xpersonagem') || key.includes('-habilidades302X') || key.includes('-inventario302X') || key.includes('-inventario302X')) {
            console.log('Nome do arquivo:', key);
            mostrarMensagem('Nome do arquivo: ' + key);
        }
    }
}

function removerArquivo() {
    const nomeArquivo = document.getElementById('nomeArquivoRemover').value.trim();
    if (!nomeArquivo) {
        alert('Por favor, insira o nome do arquivo a ser removido.');
        return;
    }
    
    if (localStorage.getItem(nomeArquivo) === null) {
        alert('Arquivo não encontrado no localStorage.');
        return;
    }
    
    try {
        // Remove o arquivo do localStorage
        localStorage.removeItem(nomeArquivo);
        alert('Arquivo removido com sucesso.');
    } catch (error) {
        console.error('Erro ao remover arquivo:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const essentialInfo = document.getElementById("essential-info");

    // Verifica a largura da janela
    function checkWindowSize() {
        if (window.innerWidth >= 1024) {
            essentialInfo.classList.remove("hidden");
        } else {
            essentialInfo.classList.add("hidden");
        }
    }

    // Executa a função no carregamento e no redimensionamento da janela
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    let lastScrollTop = 0; // Armazena a posição do último scroll
    let isScrolling; // Variável para verificar se o scroll ainda está em andamento

    // Mantém o elemento centralizado com o scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up'; // Verifica se o scroll é para baixo ou para cima

        // Atualiza a posição do último scroll
        lastScrollTop = scrollPosition;

        // Ajusta o comportamento dependendo da direção do scroll
        if (scrollDirection === 'down') {
            essentialInfo.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 - scrollPosition * 0.03; // Elasticidade ajustada
            essentialInfo.style.top = Math.max(newTop, 35) + '%'; // Limita o movimento para não sair do centro
        } else if (scrollDirection === 'up') {
            essentialInfo.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 + scrollPosition * 0.03; // Elasticidade mais controlada
            essentialInfo.style.top = Math.min(newTop, 65) + '%'; // Limita o movimento até um pouco abaixo do centro
        }

        // Caso o scroll pare, centraliza novamente
        if (isScrolling) {
            clearTimeout(isScrolling);
        }

        isScrolling = setTimeout(function () {
            essentialInfo.style.transition = 'top 0.3s ease-in-out'; // Retorno suave ao centro
            essentialInfo.style.top = '50%';
            essentialInfo.style.transform = 'translateY(-50%)';
        }, 100); // Reduz o tempo de inatividade para maior responsividade
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const essentialInfo2 = document.getElementById("essential-info2");

    // Verifica a largura da janela
    function checkWindowSize() {
        if (window.innerWidth >= 1024) {
            essentialInfo2.classList.remove("hidden");
        } else {
            essentialInfo2.classList.add("hidden");
        }
    }

    // Executa a função no carregamento e no redimensionamento da janela
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    let lastScrollTop = 0; // Armazena a posição do último scroll
    let isScrolling; // Variável para verificar se o scroll ainda está em andamento

    // Mantém o elemento centralizado com o scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up'; // Verifica se o scroll é para baixo ou para cima

        // Atualiza a posição do último scroll
        lastScrollTop = scrollPosition;

        // Ajusta o comportamento dependendo da direção do scroll
        if (scrollDirection === 'down') {
            essentialInfo2.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 - scrollPosition * 0.03; // Elasticidade ajustada
            essentialInfo2.style.top = Math.max(newTop, 35) + '%'; // Limita o movimento para não sair do centro
        } else if (scrollDirection === 'up') {
            essentialInfo2.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 + scrollPosition * 0.03; // Elasticidade mais controlada
            essentialInfo2.style.top = Math.min(newTop, 65) + '%'; // Limita o movimento até um pouco abaixo do centro
        }

        // Caso o scroll pare, centraliza novamente
        if (isScrolling) {
            clearTimeout(isScrolling);
        }

        isScrolling = setTimeout(function () {
            essentialInfo2.style.transition = 'top 0.3s ease-in-out'; // Retorno suave ao centro
            essentialInfo2.style.top = '50%';
            essentialInfo2.style.transform = 'translateY(-50%)';
        }, 100); // Reduz o tempo de inatividade para maior responsividade
    });
});

function enviarFeedback(topico, resultado, valores, formula) {
    // Se for admin, não envia feedback externo — mas já enviou pro chat
    if (window.admincheck) {
        console.log("Modo administrador ativado. Feedback não será enviado à API.");
        return;
    }
    const nomepersonagem = window.nomepersonagem || "Usuário";
    const imagemURL = window.imgpersonagem || "";
    const mensagensRef = db.collection("chatMensagens");

    // ...existing code...
    const textoChat = `🎲 [${topico}] ${nomepersonagem} rolou ${formula}:
    Valores: [${valores.join(", ")}]
    ➔ Soma final: ${resultado}`;
    // ...existing code...
    // Se for rolagem de iniciativa, salva no Firestore
    if (topico.toLowerCase().includes("iniciativa")) {
        firebase.firestore().collection("iniciativas").add({
            nome: nomepersonagem,
            valor: parseInt(resultado)
        }).catch((error) => {
            console.error("Erro ao salvar iniciativa:", error);
        });
    }


    // Envia a mensagem para o chat (sempre)
    mensagensRef.add({
        texto: textoChat,
        autor: "DiceBot",
        timestamp: new Date()
    }).then(() => {
        console.log("Resultado da rolagem enviado para o chat!");
    }).catch(err => {
        console.error("Erro ao enviar rolagem para o chat:", err);
    });

    const payload = {
        topico,
        resultado,
        valores,
        formula,
        nomepersonagem,
        imagemURL
    };

    // Envia para o backend normalmente
    fetch("https://backmordred.vercel.app/api/enviarFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => console.log("Feedback enviado!", data))
    .catch(error => console.error("Erro ao enviar feedback:", error));
}


function atualizarDescricaoHabilidade(descricaoMarkdown) {
    const md = window.markdownit({
        breaks: true, // Converte \n em <br>
    });

    const descricaoHTML = md.render(descricaoMarkdown);
    document.getElementById('habilidade-descricao').innerHTML = descricaoHTML;
}

document.getElementById("atualizar-checkbox").addEventListener("change", function() {
  atualizarStatusCheck = this.checked;
  console.log("Valor de Atualizar:", atualizarStatusCheck);
  // Aqui você pode adicionar qualquer lógica adicional que dependa do estado do toggle
});

document.getElementById("atualizarhabilidade-checkbox").addEventListener("change", function() {
    atualizarHabilidadeCheck = this.checked;
    console.log("Valor de Atualizar Habilidade:", atualizarHabilidadeCheck);
    // Aqui você pode adicionar qualquer lógica adicional que dependa do estado do toggle
});

document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const anotacoesTextarea = document.getElementById('anotacoes');

    // Carregar as anotações salvas ao carregar a página
    const savedAnotacoes = localStorage.getItem('anotacoes');
    if (savedAnotacoes) {
        anotacoesTextarea.value = savedAnotacoes;
        anotacoesTextarea.style.height = 'auto';
        anotacoesTextarea.style.height = (anotacoesTextarea.scrollHeight) + 'px';
    }

    // Ajustar altura dinâmica do textarea
    anotacoesTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        salvarAnotacoes(); // Salvar no localStorage automaticamente
    });
});

function salvarAnotacoes() {
    const anotacoes = document.getElementById('anotacoes').value;
    localStorage.setItem('anotacoes', anotacoes);
}


document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mousemove', function(e) {
    const rect = button.getBoundingClientRect();
    // Define as variáveis CSS --mouse-x e --mouse-y com a posição do mouse relativa ao botão
    button.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    button.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
});

document.getElementById('clear-data-btn').addEventListener('click', function() {
    // Apagar todos os cookies
    document.cookie.split(";").forEach((cookie) => {
        const nome = cookie.split("=")[0].trim();
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    // Limpar o LocalStorage e o SessionStorage
    sessionStorage.clear();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    gapi.client.setToken('');


    // Limpar o Cache da Página
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
        });
    }

    // Forçar Hard Refresh (recarregar sem cache)
    location.reload(true);
});


document.getElementById('toggleinfo1')?.addEventListener('click', (e) => {
    e.stopPropagation(); // <-- isso evita o conflito!
    console.log('Clicou no botão!');
    document.body.classList.add('abas-mostradas');
});   

document.addEventListener('DOMContentLoaded', () => {
    let startY = 0;
    let isAtBottom = false;
    const indicator = document.getElementById('pull-up-indicator');
  
    if (!indicator) return; // Evita erro se ainda assim não encontrar
  
    window.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      // Define a área da parte de baixo. Neste exemplo, os últimos 20% da tela.
      const bottomThreshold = windowHeight * 0.8; 
      // Se o toque não for na parte de baixo, ignoramos o pull-up
      if (startY < bottomThreshold) {
        isAtBottom = false;
        indicator.style.opacity = '0';
        return;
      }
      
      // Se o toque for na região inferior, verifica se a página está no final
      const scrollY = window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      isAtBottom = (windowHeight + scrollY + 80) >= bodyHeight;
  
      if (isAtBottom) {
        indicator.style.opacity = '1';
      }
    });
  
    window.addEventListener('touchmove', (e) => {
      if (!isAtBottom) return;
      const currentY = e.touches[0].clientY;
      const distance = startY - currentY;
      if (distance > 0 && distance < 100) {
        indicator.style.transform = `translateX(-50%) translateY(${-distance / 2}px) scale(${1 + distance / 200})`;
        indicator.style.opacity = `${Math.min(1, distance / 50)}`;
      }
    });
  
    window.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      const swipeDistance = startY - endY;
  
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateX(-50%) scale(0.8)';
  
      if (isAtBottom && swipeDistance > 280) {
        document.body.classList.add('abas-mostradas');
      }
    });
});
  
  
// Fechar abas ao clicar fora
document.addEventListener('click', function (event) {
    const aba1 = document.getElementById('essential-info');
    const aba2 = document.getElementById('essential-info2');
  
    const clicouFora =
      !aba1.contains(event.target) &&
      !aba2.contains(event.target) &&
      document.body.classList.contains('abas-mostradas');
  
    if (clicouFora) {
      document.body.classList.remove('abas-mostradas');
    }
  });
  
  const indicador = document.getElementById('pull-up-indicator');
  
  // Define a imagem do personagem ou usa a imagem padrão
  const imagemPersonagem = window.imgpersonagem || 'https://i.pinimg.com/736x/cb/b1/ef/cbb1ef1ee0bf43d633393d7203a4d497.jpg';
  indicador.style.backgroundImage = `url('${imagemPersonagem}')`;
  
  function atualizarIconeIndicador() {
      const indicador = document.getElementById('pull-up-indicator');
      const imagemPersonagem = window.imgpersonagem || 'https://i.pinimg.com/736x/cb/b1/ef/cbb1ef1ee0bf43d633393d7203a4d497.jpg';
      indicador.style.backgroundImage = `url('${imagemPersonagem}')`;
  }
  
    function carregarFichasNaBarra() {
    const barra = document.getElementById('barra-fichas');
    barra.innerHTML = ''; // Limpa
  
    let fichaCheckada = null;
    const outrasFichas = [];
  
    // Busca fichas válidas
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave.includes('-302Xpersonagem')) {
        const dados = JSON.parse(localStorage.getItem(chave));
        if (dados.check === 1 && !fichaCheckada) {
          fichaCheckada = { chave, dados };
        } else {
          outrasFichas.push({ chave, dados });
        }
      }
    }
  
    window.totalFichas = (fichaCheckada ? 1 : 0) + outrasFichas.length;
  
    if (totalFichas < 1) {
      barra.style.display = 'none';
      return;
    }
  
    barra.style.display = 'none';
  
    let iconesAdicionados = 0;
  
// Adiciona ficha marcada com check: 1
  
if (fichaCheckada) {
    const nome = fichaCheckada.chave.replace('-302Xpersonagem', '');
    const img = document.createElement('img');
    img.src = fichaCheckada.dados.img;
    img.alt = nome;
    img.className = 'ficha-icone';
    
    // Torna o ícone arrastável
    img.setAttribute('draggable', true);
    
    img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', nome);
        e.dataTransfer.setData('image', fichaCheckada.dados.token);
        document.getElementById('tabuleiro').style.pointerEvents = 'auto';
    });
    
    img.addEventListener('dragend', () => {
        document.getElementById('tabuleiro').style.pointerEvents = 'none';
    });
    
    img.addEventListener('click', () => {
      carregarStatusPorNome(nome);
    });
    barra.appendChild(img);
  }
  
  // Adiciona as outras fichas da mesma forma
  for (let i = 0; i < outrasFichas.length; i++) {
    const { chave, dados } = outrasFichas[i];
    const nome = chave.replace('-302Xpersonagem', '');
    const img = document.createElement('img');
    img.src = dados.img || 'https://media.discordapp.net/attachments/1164311440224702526/1361559378695688232/dfy9prk-fd124c1f-81f6-4ecb-935e-e994799c6b5f.png?ex=67ff327c&is=67fde0fc&hm=316bace3c2ec013775631ccb7ae51781072936e089449bfbc696bac56fa28fc0&=&format=webp&quality=lossless&width=433&height=648';
    img.alt = nome;
    img.className = 'ficha-icone';
    
    // Torna o ícone arrastável
    img.setAttribute('draggable', true);
    
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', nome);
      console.log('MyAppLog: Nome do personagem:', nome);
      e.dataTransfer.setData('image', dados.token || 'https://media.discordapp.net/attachments/1164311440224702526/1361559378695688232/dfy9prk-fd124c1f-81f6-4ecb-935e-e994799c6b5f.png?ex=67ff327c&is=67fde0fc&hm=316bace3c2ec013775631ccb7ae51781072936e089449bfbc696bac56fa28fc0&=&format=webp&quality=lossless&width=433&height=648');
      document.getElementById('tabuleiro').style.pointerEvents = 'auto';
    });

    img.addEventListener('dragend', () => {
        document.getElementById('tabuleiro').style.pointerEvents = 'none';
    });
    
    img.addEventListener('click', () => {
      carregarStatusPorNome(nome);
    });
    barra.appendChild(img);
  }
}
  
window.addEventListener('DOMContentLoaded', carregarFichasNaBarra);
  
const senhaCorreta = "mordred123"; // Altere a senha como desejar

function ativarAdmin() {
    const senha = document.getElementById("senhaAdmin").value;
    if (senha === senhaCorreta) {
        window.admincheck = true;
        localStorage.setItem("admincheck", "true");
        atualizarStatusAdmin();
    } else {
        document.getElementById("adminStatus").textContent = "Senha incorreta.";
        document.getElementById("adminStatus").style.color = "red";
    }
}

function desativarAdmin() {
    window.admincheck = false;
    localStorage.setItem("admincheck", "false");
    atualizarStatusAdmin();
}

function atualizarStatusAdmin() {
    const status = window.admincheck;
    const statusText = document.getElementById("adminStatus");

    if (status) {
        statusText.textContent = "Modo administrador ativado!";
        statusText.style.color = "green";
    } else {
        statusText.textContent = "Modo administrador desativado.";
        statusText.style.color = "black";
    }
}

// Carregar status do admin ao iniciar a página
window.addEventListener("DOMContentLoaded", () => {
    const savedStatus = localStorage.getItem("admincheck");
    window.admincheck = savedStatus === "true";
    atualizarStatusAdmin();
});

// redireciona botão de seleção
document.getElementById("toggleselection1")
  .addEventListener("click", () => {
    window.location.href = "../indexlimpo.html";
  });

const toggleButton1   = document.getElementById("toggleplayer1");
const playerContainer1 = document.querySelector(".player-container");
const toggleChatButton = document.getElementById("togglechat1");
const chatContainer    = document.getElementById("chat-container");
const blackoverlay     = document.querySelector("#black-overlay");

function isMobileDevice() {
  return window.innerWidth <= 1300;
}

function toggleVisibility(container, button, outsideListener) {
  const isHidden = getComputedStyle(container).display === "none";
  container.style.display = isHidden ? "flex" : "none";
  console.log(`Container ${container.id} agora está ${isHidden ? "visível" : "oculto"}.`);

  if (isMobileDevice()) {
    blackoverlay.style.display = isHidden ? "block" : "none";
    // remove listener anterior e, se abrindo, adiciona de novo após um tick
    document.removeEventListener("click", outsideListener);
    document.removeEventListener("touchstart", outsideListener);
    if (isHidden) {
      setTimeout(() => {
        document.addEventListener("click", outsideListener);
        document.addEventListener("touchstart", outsideListener);
      }, 10);
    }
  }
}

// fecha player se clicar fora dele ou do botão
function outsideClickListenerPlayer(event) {
  if (
    !playerContainer1.contains(event.target) &&
    !toggleButton1.contains(event.target)
  ) {
    playerContainer1.style.display = "none";
    blackoverlay.style.display     = "none";
    document.removeEventListener("click", outsideClickListenerPlayer);
    document.removeEventListener("touchstart", outsideClickListenerPlayer);
    console.log("Player fechado por clique fora.");
  }
}

// fecha chat se clicar fora dele ou do botão
function outsideClickListenerChat(event) {
  if (
    !chatContainer.contains(event.target) &&
    !toggleChatButton.contains(event.target)
  ) {
    chatContainer.style.display = "none";
    blackoverlay.style.display  = "none";
    document.removeEventListener("click", outsideClickListenerChat);
    document.removeEventListener("touchstart", outsideClickListenerChat);
  }
}

// --- IMPORTANTE: estas linhas garantem que cliques DENTRO do container
// não estouram para o document e fecham o overlay
playerContainer1.addEventListener("click", e => e.stopPropagation());
chatContainer.addEventListener("click", e => e.stopPropagation());

// eventos de abertura dos containers
toggleButton1.addEventListener("click", e => {
  e.stopPropagation();
  toggleVisibility(
    playerContainer1,
    toggleButton1,
    outsideClickListenerPlayer
  );
});

toggleChatButton.addEventListener("click", e => {
  e.stopPropagation();
  toggleVisibility(
    chatContainer,
    toggleChatButton,
    outsideClickListenerChat
  );
});

// função de ajuste de altura (sem alterações)
function ajustarAlturaCorreta() {
  const alturaVisivel = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style
    .setProperty('--altura-visivel', `${alturaVisivel}px`);
  document.documentElement.style
    .setProperty('--vh', `${alturaVisivel * 0.01}px`);
  console.log('Altura visível ajustada para:', alturaVisivel);
}

function aplicarAlturaComDelay() {
    ajustarAlturaCorreta();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

// Executa ao carregar

aplicarAlturaComDelay();

document.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('focus', (e) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 200); // pequeno atraso para o teclado abrir
    });
});

function detectarTeclado() {
    const alturaViewport = window.visualViewport?.height || window.innerHeight;
    const alturaJanela = window.innerHeight;
    const diferenca = alturaJanela - alturaViewport;
  
    if (diferenca > 150) {
      document.body.classList.add('teclado-aberto');
    } else {
      document.body.classList.remove('teclado-aberto');
    }
}
  
window.visualViewport?.addEventListener('resize', detectarTeclado);
window.addEventListener('resize', detectarTeclado);
  
document.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('focus', () => {
      document.body.classList.add('teclado-aberto');
    });
    el.addEventListener('blur', () => {
      document.body.classList.remove('teclado-aberto');
    });
});
  

// Executa quando volta de outra aba
document.addEventListener('visibilitychange', () => {
if (document.visibilityState === 'visible') {
    setTimeout(aplicarAlturaComDelay, 100);
}
});

window.addEventListener('pageshow', (event) => {
if (event.persisted) {
    // Vindo do cache (back/forward)
    setTimeout(aplicarAlturaComDelay, 100);
}
});
  

// Executa em redimensionamentos
window.addEventListener('resize', aplicarAlturaComDelay);

(function() {
    const ua       = navigator.userAgent;
    const platform = navigator.platform;
    const hasTouch = navigator.maxTouchPoints > 1;

    // 1) iPadOS 13+ se mascara de Mac, então:
    const isIos = /iPhone|iPod/.test(ua)
            || (/iPad/.test(ua))
            || (platform === 'MacIntel' && hasTouch);

    // 2) Detecta standalone PWA no iOS:
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true;

    console.log({
    ua, platform, maxTouchPoints: navigator.maxTouchPoints,
    isIos, isStandalone
    });

    if (!isIos /*|| !isStandalone*/) return;

    document.documentElement.classList.add('ios');
    document.body.classList.add('ios');
    mostrarMensagem('iOS detectado!');
    console.log('iOS detectado!');

    const updateHeight = () => {
    const h = window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight;
    document.documentElement.style.setProperty('--altura-visivel', `${h}px`);
    document.documentElement.style.setProperty('--vh', `${h * 0.01}px`);
    // trava scroll residual
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height   = `${h}px`;
    };

    updateHeight();
    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    window.addEventListener('pageshow', updateHeight);
})();


// 1) Seleciona o elemento
const essential = document.getElementById('essential-info');

// 2) Se estiver com display:none, o offsetHeight será zero.
//    Para medir mesmo estando "hidden", você pode:
//    a) trocar temporariamente o estilo para visível mas invisível ao usuário:
const prevDisplay = essential.style.display;
essential.style.visibility = 'hidden';
essential.style.display = 'block';

// 3) Agora mede
const height = essential.getBoundingClientRect().height;
console.log('altura do essential-info:', height);

// 4) Restaura o estilo original
essential.style.display = prevDisplay;
essential.style.visibility = '';

// 5) Exporta a altura para uma variável CSS
document.documentElement.style.setProperty('--essential-info-height', `${height}px`);


const iniciativasRef = firebase.firestore().collection("iniciativas");

// Atualiza a UI com um item da Firestore
function atualizarListaIniciativa(nome, valor, id = null) {
    const lista = document.getElementById("lista-iniciativas");
    if (!lista) return;
  
    const item = document.createElement("li");
    item.setAttribute("data-id", id);
  
    const spanTexto = document.createElement("span");
    spanTexto.textContent = `${nome} - ${valor}`;
  
    const btnRemover = document.createElement("span");
    btnRemover.className = "remove-btn";
    btnRemover.style.cursor = "pointer";
    btnRemover.textContent = "🗑️";
    // só mostramos o ícone se houver ID
    if (!id) btnRemover.style.display = "none";
  
    item.appendChild(spanTexto);
    item.appendChild(btnRemover);
    lista.appendChild(item);
}

// ...existing code...

async function organizarIniciativas() {
  if (!window.admincheck) {
    alert("Apenas administradores podem organizar a lista.");
    return;
  }
  try {
    const snapshot = await iniciativasRef.get();
    const iniciativas = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      iniciativas.push({ id: doc.id, ...data });
    });

    // Ordena por valor (decrescente)
    iniciativas.sort((a, b) => b.valor - a.valor);

    // Limpa todas as iniciativas
    const batch = firebase.firestore().batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Reinsere as iniciativas ordenadas
    const addPromises = iniciativas.map(item =>
      iniciativasRef.add({ nome: item.nome, valor: item.valor })
    );
    await Promise.all(addPromises);

    alert("Lista de iniciativas organizada!");
  } catch (error) {
    console.error("Erro ao organizar iniciativas:", error);
    alert("Erro ao organizar iniciativas.");
  }
}
// ...existing code...
  
// Adiciona uma nova iniciativa à Firestore
function adicionarIniciativaManual() {
  const nome = document.getElementById("nome-manual").value.trim();
  const valor = document.getElementById("valor-manual").value.trim();

  if (!nome || !valor) return alert("Preencha nome e valor!");

  iniciativasRef.add({ nome, valor: parseInt(valor) })
    .then(() => {
      document.getElementById("nome-manual").value = "";
      document.getElementById("valor-manual").value = "";
    })
    .catch((error) => {
      console.error("Erro ao adicionar iniciativa:", error);
    });
}

// Delegação de clique para remover
window.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-iniciativas");
    if (!lista) return console.error("Não achei #lista-iniciativas no DOM");
  
    lista.addEventListener("click", e => {
      const target = e.target;
      if (!target.classList.contains("remove-btn")) return;
      
      console.log("👀 clique em remove-btn detectado", target);
  
      // teste sem admincheck (só para debug)
      // if (!window.admincheck) return console.warn("Sem permissão admin");
  
      const id = target.parentElement.getAttribute("data-id");
      console.log("🆔 data-id do item:", id);
      if (!id) return console.warn("ID inválido para remoção");
  
      removerIniciativa(id);
    });
  });
  

// Remove uma iniciativa do Firestore
function removerIniciativa(id) {
    iniciativasRef
      .doc(id)
      .delete()
      .then(() => console.log(`Iniciativa ${id} removida`))
      .catch((error) => console.error("Erro ao remover iniciativa:", error));
}

// Limpa todas as iniciativas (somente admin)
function limparIniciativas() {
  if (!window.admincheck) return;

  iniciativasRef.get().then(snapshot => {
    const batch = firebase.firestore().batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  }).catch((error) => {
    console.error("Erro ao limpar iniciativas:", error);
  });
}

// Renderiza automaticamente quando algo muda no Firestore
iniciativasRef.onSnapshot(snapshot => {
  const lista = document.getElementById("lista-iniciativas");
  if (lista) lista.innerHTML = "";

  // Coleta todas as iniciativas em um array
  const iniciativas = [];
  snapshot.forEach(doc => {
    const { nome, valor } = doc.data();
    iniciativas.push({ nome, valor, id: doc.id });
  });

  // Ordena por valor (decrescente)
  iniciativas.sort((a, b) => b.valor - a.valor);

  // Renderiza ordenado
  iniciativas.forEach(item => {
    atualizarListaIniciativa(item.nome, item.valor, item.id);
  });
});

// Exibe botão de limpar se for admin
window.addEventListener("DOMContentLoaded", () => {
  if (window.admincheck) {
    const btnLimpar = document.getElementById("btn-limpar-iniciativas");
    if (btnLimpar) btnLimpar.style.display = "flex";
  }
});
