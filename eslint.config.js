import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // DOM globals
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLParagraphElement: "readonly",
        HTMLHeadingElement: "readonly",
        HTMLOListElement: "readonly",
        HTMLLIElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLSpanElement: "readonly",
        HTMLTableElement: "readonly",
        HTMLTableSectionElement: "readonly",
        HTMLTableRowElement: "readonly",
        HTMLTableCellElement: "readonly",
        HTMLTableCaptionElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLUListElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        Event: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        URL: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        NodeJS: "readonly",
        // Test globals
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly"
      },
      ecmaVersion: 2020,
      sourceType: "module"
    },
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off" // Using TypeScript for prop validation
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // DOM globals
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLParagraphElement: "readonly",
        HTMLHeadingElement: "readonly",
        HTMLOListElement: "readonly",
        HTMLLIElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLSpanElement: "readonly",
        HTMLTableElement: "readonly",
        HTMLTableSectionElement: "readonly",
        HTMLTableRowElement: "readonly",
        HTMLTableCellElement: "readonly",
        HTMLTableCaptionElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLUListElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        Event: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        URL: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        NodeJS: "readonly",
        // Test globals
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];