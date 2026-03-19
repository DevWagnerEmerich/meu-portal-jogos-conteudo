---
description: Como integrar um novo jogo ao Portal BrincaBytes (Identidade e Persistência)
---

Se você precisar que um jogo reconheça o usuário logado ou salve dados personalizados, siga estes passos:

### 1. Preparação (No Backend)
Certifique-se de que a tabela `game_user_data` e as rotas `/api/game-data` estão funcionais no servidor.

### 2. Implementação no Jogo (HTML/JS)
O jogo deve ser capaz de chamar as APIs do portal.

#### Passo 1: Detectar se há um usuário logado
Ao iniciar o jogo (`DOMContentLoaded` ou similar), chame a API de status.
*   **Ação:** Adicione uma função `checkPortalUser()` ao arquivo `.js` principal do jogo.
*   **Rota:** `GET /api/user-status`.

#### Passo 2: Carregar dados salvos (se houver)
Se o jogo precisa de uma "lista personalizada" ou "progresso":
*   **Ação:** Chame `GET /api/game-data/:gameId/:key`.
*   **Exemplo:** `fetch('/api/game-data/jogo-da-forca/custom_list')`.

#### Passo 3: Salvar alterações
Sempre que o usuário criar uma lista ou mudar uma configuração:
*   **Ação:** Envie um `POST` para `/api/game-data`.
*   **Corpo:** `{ "gameId": "slug", "key": "chave", "value": JSON.stringify(dados) }`.

### 3. Verificação (E2E)
1.  Abra o portal e faça login.
2.  Abra o jogo.
3.  Verifique se o nome do usuário aparece ou se a lista personalizada é carregada.
4.  Altere algo no jogo e atualize a página para ver se o dado persistiu.

---

**Nota:** Este fluxo evita que o agente invente uma forma de salvar os dados no LocalStorage (que seria perdido se o aluno mudar de computador). Usando a API do portal, os dados ficam salvos na conta do aluno no banco de dados.
