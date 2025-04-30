import globals from 'globals';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
  ...svelte.configs.prettier
});

export default defineConfig([
  {
    extends: compat.extends(
      '@typhonjs-config/eslint-config/esm/2022/browser',
      '@typhonjs-fvtt/eslint-config-foundry.js',
      'plugin:prettier/recommended'
    ),
    languageOptions: {
      globals: {
        ...globals.jquery,
        ...globals.node,
        Color: 'readonly',
        PIXI: true
      }
    },
    rules: {
      'no-shadow': [
        'error',
        {
          builtinGlobals: true,
          hoist: 'all',
          allow: ['document', 'event', 'name', 'parent', 'status', 'top']
        }
      ]
    }
  },
  {
    ignores: [
      '.github/',
      'dist/',
      'docs/',
      'external/',
      'lang/',
      'scripts/',
      'styles/',
      'templates/',
      'src/**/*.svelte',
      '/index.js',
      '/index.js.map'
    ]
  }
]);
