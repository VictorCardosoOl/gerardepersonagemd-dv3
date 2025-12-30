# Especificação de Interação: Horizontal Drag-to-Explore (Slider Infinito)

## 1. Visão Geral
Esta interação consiste em uma **seção de navegação horizontal baseada em arraste (drag)**. Diferente de um carrossel tradicional com botões de "próximo/anterior", esta técnica emula uma superfície física onde o usuário "puxa" o conteúdo para revelar informações ocultas lateralmente.

Referência visual: Site *Don't Board Me* (Seção "PET VISITS").

## 2. Comportamento do Usuário (UX)

### Estado Inicial
*   **Cursor:** Ao passar o mouse sobre a área do container, o cursor padrão é substituído por um indicador visual (`grab` / mão aberta) sugerindo que a área é interativa.
*   **Visual:** O usuário vê parte do conteúdo cortado na lateral direita, indicando continuidade (affordance).

### Ação (Active State)
*   **Gatilho:** O usuário clica (mousedown) e segura o botão esquerdo.
*   **Movimento:** Enquanto segura, o usuário move o mouse para a esquerda ou direita.
*   **Feedback:** 
    *   O cursor muda para "mão fechada" (`grabbing`). 
    *   A seleção de texto é desabilitada para evitar conflitos visuais.
    *   O conteúdo se move sincronizado com o mouse.

### Estado Final (Release)
*   **Finalização:** Ao soltar o clique (mouseup) ou sair da área (mouseleave), o arraste para e o cursor volta ao estado inicial.

---

## 3. Implementação Técnica

### A. Estrutura Lógica
A implementação utiliza a manipulação da propriedade `scrollLeft` do container baseada no diferencial de movimento do mouse (`mousemove`).

### B. Ciclo de Eventos (JavaScript/React)

1.  **`mousedown`**:
    *   Define flag `isDown = true`.
    *   Adiciona classe visual `active` (cursor grabbing).
    *   Registra `startX` (posição inicial do mouse - offset do container).
    *   Registra `scrollLeft` (posição atual da rolagem).

2.  **`mouseleave` & `mouseup`**:
    *   Define flag `isDown = false`.
    *   Remove classe visual.

3.  **`mousemove`**:
    *   Verifica se `!isDown`. Se verdadeiro, encerra a função.
    *   Previne comportamento padrão (`e.preventDefault()`).
    *   Calcula posição atual `x`.
    *   Calcula o "passeio" (`walk = (x - startX) * velocidade`).
    *   Atualiza `container.scrollLeft = scrollLeft - walk`.

### C. Acessibilidade (A11y)
*   O container deve manter `overflow-x: auto` (embora com scrollbar oculta visualmente) para permitir navegação por touch em dispositivos móveis nativamente.
*   A lógica de mouse deve coexistir com a lógica de touch nativa do navegador.
