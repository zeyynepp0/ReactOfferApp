# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/3192cc35-1380-4c8d-8c14-b4185b01049d" />
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/095ce02c-15ca-4fea-af8a-96d748ae1394" />
<img width="1916" height="910" alt="image" src="https://github.com/user-attachments/assets/60da26b8-3b31-4e6c-a61d-845cf093aed8" />
<img width="1905" height="903" alt="image" src="https://github.com/user-attachments/assets/dee5cbc8-edce-42db-b622-f8df3dad2c6c" />
<img width="1918" height="905" alt="image" src="https://github.com/user-attachments/assets/50ef939e-71b4-4a94-8233-a33ae9d75ed2" />
<img width="1916" height="904" alt="image" src="https://github.com/user-attachments/assets/2c1e4e43-ce37-44ed-ab83-50f694580aa6" />
<img width="1910" height="897" alt="image" src="https://github.com/user-attachments/assets/508cf426-0d06-4fb8-bae8-ac77cce72493" />
<img width="1917" height="915" alt="image" src="https://github.com/user-attachments/assets/191bf252-5e3a-4a57-89da-949047fa116f" />








Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
