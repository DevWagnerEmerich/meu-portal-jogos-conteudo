# Skill: BrincaBytes Game Library System

Padrões de Interface e Persistência para transformação de games simples em ferramentas pedagógicas completas.

## 🎨 Padrão de Design: Dashboard de Duas Colunas

A tela de "Setup" do game deve seguir a estrutura de **Dashboard Industrial**, evitando rolagem e separando as responsabilidades:

1. **Topo (Centralizado):** Banner de boas-vindas do professor e botão de acesso à Biblioteca.
2. **Coluna Esquerda (Ação de Input):** Focada em "Trazer novo conteúdo" (Upload de arquivo, Arrastar e Soltar, Baixar Modelo).
3. **Coluna Direita (Ação de Dados):** Focada em "Dar contexto" (Nome da Atividade, Disciplina, Tema, Equipes).
4. **Base (Centralizada):** Grande botão de ação primária (Iniciar Jogo).

## 📚 Padrão da Biblioteca (Galeria)

O game deve possuir um Modal `biblioteca-modal` com:
- **Cards Compactos:** Exibindo Disciplina (Badge), Nome, Tema e metadados (ex: nº de palavras).
- **Ações Rápidas:** Botões de "Jogar" (carregar imediato) e ícones de "Editar" (lápis) e "Excluir" (X).
- **Filtros Inteligentes:** Barra de busca em tempo real e seletor de Disciplina.

## ✏️ Padrão do Editor de Atividades

Permitir que o professor corrija erros sem precisar re-importar o Excel:
- Modal `editor-modal` com inputs para dados da atividade.
- Lista editável de palavras/pergunta/dicas.
- CRUD interno nas palavras antes do salvamento final.

## 🔄 Padrão de Persistência (API + LocalStorage Mock)

Sempre implementar o `checkPortalUser` com fallback para `localStorage` baseado no `location.hostname`. Isso permite:
- **Testes Locais:** Salvamento funciona no navegador do desenvolvedor.
- **Produção Portal:** Sincronização automática com a nuvem BrincaBytes.

### Exemplo de Estrutura de Atividade Salva:
```json
{
  "nome": "Prova de Ciências",
  "disc": "Biologia",
  "tema": "Células",
  "data": [...dados_originais_do_game...],
  "timestamp": 123456789
}
```

## ⚠️ Padrão de Interação (Confirmations)

Abolir o uso de `confirm()` e `alert()` nativos. Utilizar o `confirmarAcao` customizado para garantir o "Branding" da aplicação.
