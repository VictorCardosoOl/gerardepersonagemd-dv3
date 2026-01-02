# Contribuindo para o Mestre da Masmorra

Obrigado pelo interesse em contribuir! Este projeto visa criar a experiência visual definitiva para jogadores de RPG.

## Como rodar localmente

1. Clone o repositório.
2. Como este é um projeto MVP usando módulos ES nativos e CDN, você não precisa de `npm install` para rodar a versão básica.
3. Use uma extensão como "Live Server" no VSCode para servir o arquivo `index.html`.

## Padrões de Código

*   **Estilo:** Utilizamos ESLint e Prettier.
*   **Commits:** Use Conventional Commits (ex: `feat: adiciona filtro de monstros`, `fix: corrige cálculo de CA`).
*   **Arquitetura:** Mantenha a lógica separada da UI.
    *   `components/`: Apenas visualização.
    *   `features/`: Lógica de domínios específicos (ex: Bestiário, Ficha).
    *   `utils/`: Funções puras e regras de negócio.

## Reportando Bugs

Abra uma Issue descrevendo:
1. O comportamento esperado.
2. O comportamento atual.
3. Passos para reproduzir.

Divirta-se codando! 🎲