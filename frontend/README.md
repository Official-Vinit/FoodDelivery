# Foodziee Frontend — Signup UI

This folder contains a lightweight React + Vite frontend with a styled signup page for Foodziee.

Quick start

1. Open a terminal and change into the `frontend` folder:

```bash
cd frontend
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3. Open the signup page at `http://localhost:5173/signup` (Vite default port).

Files of interest

- `frontend/src/pages/SignUp.jsx` — the signup React component with password show/hide and validation.
- `frontend/src/index.css` — Tailwind directives and the custom animations used by the page.

Notes

- The UI is built with Tailwind (v4.2), React and react-icons. If Tailwind styles don't appear, ensure dependencies are installed and restart the dev server.
- The signup form currently logs data to the console; hook it up to your backend API under `backend/` to complete registration flows.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
