# 🧪 Periodic Table

---

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://react.dev)
[![React Router](https://img.shields.io/badge/React%20Router-7.11.0-CA4245?logo=reactrouter)](https://reactrouter.com)

> Busca e exploração de elementos químicos com interface interativa, modais de detalhes e visualização de camadas eletrônicas. Projeto feito em React e publicado no GitHub Pages.

## 📸 Screenshots
<div align="center">
  <img src="https://i.ibb.co/SX5vRVQv/table-home.png" alt="Visão geral da tabela periódica interativa com esquema de cores por categorias e layout organizado por grupos e períodos." border="0" width="49%" />
  <img src="https://i.ibb.co/RppH75HG/table-element.png" alt="Visão detalhada do elemento químico oxigênio com informações atômicas e visualização de camadas eletrônicas." border="0" width="49%" />
</div>

---

## O que o projeto apresenta

- Busca rápida por elementos (nome, símbolo ou número atômico).
- Filtros por categorias/estado físico com destaque visual por cores/ícones.
- Modais com informações atômicas detalhadas (propriedades e notas).
- Visualização de camadas/cascas eletrônicas e distribuição de elétrons.
- Layout responsivo em grid da Tabela Periódica.
- Renderização condicional para estados de seleção, destaque e vazios.

## Tecnologias e práticas

- React 18 e componentização: componentes reutilizáveis para células, grade e modais.
- React Router DOM: rotas client-side (páginas em `src/pages/`).
- React Modal: modais acessíveis com overlay e foco/ESC.
- React Icons e SVGs como componentes: ícones consistentes e estilização via CSS.
- CSS global (grid responsivo e transições suaves).
- Deploy com `gh-pages` e Create React App (`react-scripts`).

## Como rodar localmente

Pré-requisitos: Node.js e npm instalados.

```bash
npm install
npm start
```

- Ambiente de desenvolvimento em http://localhost:3000
- Hot reload habilitado via Create React App

## Build de produção

```bash
npm run build
```

- Gera saída otimizada em `build/` (minificação e assets versionados).

## Deploy (GitHub Pages)

O projeto já está configurado para deploy no GitHub Pages via `gh-pages`:

```bash
npm run deploy
```

Notas:
- O campo `homepage` está definido em `package.json` para a URL do GitHub Pages.
- O script `deploy` publica o conteúdo de `build/` no branch adequado.

---

Made with 🤍 by Caique C.