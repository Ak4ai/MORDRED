# M.O.R.D.R.E.D

**Sistema de manuseio de fichas para mestragem de RPGs de mesa**, feito como PWA: funciona no navegador, pode ser instalado no celular ou no computador, feito para as minhas campanhas.

🌐 **Demo:** [ak4ai.github.io/MORDRED](https://ak4ai.github.io/MORDRED/)

## Campanhas

O sistema tem uma versão dedicada para cada mundo de campanha, com a mesma base:

- **Nexus**
- **Singularidade**
- **Sunnyata**

## O que tem

- **Fichas** de personagem com habilidades editáveis.
- **Inventário** com uso de itens.
- **Mapa em tabuleiro** (grade de 50x50) com peças redimensionáveis.
- **Chat da mesa com rolagem de dados** (`rpg-dice-roller`).
- **Player de YouTube sincronizado** entre os jogadores, com fila de vídeos.
- **Sincronização com o Google Drive** (login com Google) para guardar e restaurar as fichas.
- **PWA:** manifesto e service worker para instalar e abrir sem barra do navegador.

## Como funciona

- **Front-end em JavaScript puro**, sem framework, com cada campanha em seu próprio diretório (`script.js`, `inventario.js`, `map.js`, `chat.js`, `youtube.js`, `google.js`).
- **Dados em tempo real:** o `mordred-db.js` é um cliente que imita a API do Firebase Firestore (`collection`, `doc`, `onSnapshot`, `batch`...), mas conversa por **WebSocket com um servidor próprio**. Foi escrito para trocar o Firebase sem reescrever o código do app.
- **Google Drive** via OAuth (Google Identity Services) para a sincronização das fichas.

## Rodando localmente

Não precisa de build. Sirva a pasta com qualquer servidor estático:

```bash
python -m http.server 3000
# abra http://localhost:3000
```

A sincronização com o Google e o banco em tempo real dependem de credenciais e de um servidor que não estão neste repositório.

## Privacidade

Veja a [política de privacidade](https://ak4ai.github.io/MORDRED/privacidade.html), exigida pelo Google para o login do app.

## Status

Em desenvolvimento, para uso pessoal. Veja o `README.md` de cada campanha para a lista de bugs e ideias.

---

Feito por [Henrique de Freitas Araújo](https://github.com/Ak4ai).
