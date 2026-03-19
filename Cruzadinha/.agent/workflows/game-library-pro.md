---
description: Como transformar um jogo comum em um jogo com Biblioteca e Gestão de Atividades Pro
---

# 🚀 Workflow: /game-library-pro

Este workflow deve ser seguido para adicionar persistência de usuário, galeria de listas e editor de conteúdo em qualquer jogo do portal.

### 1. Preparação da Identidade
- Adicionar o banner `#user-info` no topo do setup.
- Implementar a função `checkPortalUser()` com detecção de `localhost` para ativar o **Modo Simulado (Mock)**.

### 2. Dashboard de Configuração
- Converter o setup simples para um layout de **duas colunas** (CSS Grid 1fr 1.2fr).
- Coluna A: Importação/Upload.
- Coluna B: Metadados (Nome, Disciplina, Tema).

### 3. Implementação da Biblioteca (Galeria)
- Criar o modal `biblioteca-modal`.
- Implementar `renderBiblioteca()` usando cards compactos.
- Adicionar lógica de `filtrarBiblioteca()` (busca + disciplina).

### 4. Editor Direto
- Criar o modal `editor-modal`.
- Mapear a estrutura de dados específica do jogo (ex: Pistas na Forca, Pares na Memória) em uma lista editável.
- Garantir que o botão "Salvar" atualize o array `saved_activities` no Portal/LocalStorage.

### 5. Diálogos Customizados
- Adicionar o `confirm-modal` no HTML.
- Substituir calls de `confirm()` pela função `confirmarAcao()`.

### 6. Verificação Final
- Executar o `python .agent/scripts/checklist.py` para garantir que as APIs estão sendo chamadas corretamente.
- Testar o fluxo de "Salvar -> Recarregar -> Carregar da Biblioteca" em modo local.
