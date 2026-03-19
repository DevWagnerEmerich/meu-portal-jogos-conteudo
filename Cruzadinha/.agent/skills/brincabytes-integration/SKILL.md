---
name: brincabytes-integration
description: Guia de integração de games com o Portal BrincaBytes. Identidade de usuário e persistência de dados.
---

# BrincaBytes Integration

Este skill ensina como integrar jogos (HTML/JS) ao Portal BrincaBytes para identificar o usuário e salvar dados personalizados (listas, progresso, etc.).

---

## 1. Identificação do Usuário

Para saber quem está logado no portal e exibir o nome do aluno ou carregar seus dados:

### Método: API do Portal
O jogo deve fazer uma requisição `GET` para `/api/user-status`.
*   **Importante:** Como o jogo roda no mesmo domínio (dentro de um iframe ou subpasta), o navegador envia automaticamente o cookie de sessão.

```javascript
// Exemplo de como pegar o usuário logado no jogo
async function getPortalUser() {
    try {
        const response = await fetch('/api/user-status');
        const data = await response.json();
        
        if (data.loggedIn) {
            console.log("Olá, " + data.username);
            return data; // { userId, username, role, etc }
        }
        return null;
    } catch (err) {
        console.error("Erro ao conectar com BrincaBytes", err);
        return null;
    }
}
```

---

## 2. Persistência de Dados Personalizados

Use esta API para salvar qualquer informação do usuário (ex: listas de palavras personalizadas na Forca, recordes, etc.).

### Salvar Dados (`POST`)
*   **Endpoint:** `/api/game-data`
*   **Body:** `{ "gameId": "slug-do-jogo", "key": "nome-da-chave", "value": "conteudo" }`
*   `value` pode ser uma String ou um Objeto JSON.

```javascript
async function saveGameData(gameId, key, value) {
    try {
        await fetch('/api/game-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId, key, value })
        });
    } catch (err) {
        console.error("Erro ao salvar no portal", err);
    }
}
```

### Recuperar Dados (`GET`)
*   **Endpoint:** `/api/game-data/:gameId/:key`

```javascript
async function loadGameData(gameId, key) {
    try {
        const res = await fetch(`/api/game-data/${gameId}/${key}`);
        const data = await res.json();
        return data.value; // Retorna o valor salvo ou null
    } catch (err) {
        return null;
    }
}
```

---

## 3. Segurança e Regras

1.  **gameId:** Sempre use o slug do jogo (ex: `jogo-da-forca`, `matematica-divertida`).
2.  **Chaves Comuns:** Use nomes claros como `custom_list`, `progress`, `settings`.
3.  **Limite:** O valor salvo deve ter no máximo 64kb (recomendado).
4.  **Acesso:** O servidor garante que o Usuário A nunca acesse ou sobrescreva os dados do Usuário B.

---

## Como Implementar em um novo Jogo:

1.  **Verifique a existência da API:** O backend já possui as rotas `/api/user-status` e `/api/game-data`.
2.  **No `main.js` do jogo:** Adicione as funções acima para carregar as configurações do aluno ao iniciar.
