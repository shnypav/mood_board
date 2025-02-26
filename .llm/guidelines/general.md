### General :common:
* Use `process.env` to read application environment from '.env' file
  1. We use `vite` framework, so only `VITE_` parameters are available
  2. For example, to read backend url use `process.env.VITE_BACKEND_URL`.
  3. Add declarations of the other needed `.env` parameter to the `env.d.ts` file.
* Don't use `console.log(...)` function to logging. Always use the following approach:
  ```typescript
  import debug from 'debug';
  
  const log = debug('app:debug');
  ```
* Log important steps in your services, components, containers, etc.
* Make sure that all instances of promises returned by async functions are handled properly either with await or combination of .then and .catch.
* The page layout should be responsive, with a max width of 1440px on large screens to prevent overly wide designs.
* Do not add a toggle for dark/light theme switching on UI.