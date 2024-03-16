import { svelte } from '@sveltejs/vite-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import preprocess from 'svelte-preprocess';
import { postcssConfig, terserConfig } from '@typhonjs-fvtt/runtime/rollup';
import { compilePack } from '@foundryvtt/foundryvtt-cli';
import { readdir } from 'node:fs/promises';
import { createSymlinks } from './build-scripts/symlink-tools';

const PACKAGE_ID = 'modules/celebrate';
const COMPRESS = false;
const SOURCEMAPS = true;

const postBuild = (mode) => {
  return {
    name: 'post-build',
    writeBundle: {
      async handler() {
        if (mode === 'development') {
          await createSymlinks();
        }

        const packs = await readdir('./packs');
        const baseDir = process.cwd();

        for (const pack of packs) {
          if (pack === '.gitattributes') continue;
          console.log(`[== Packing ${pack} ==]`);
          await compilePack(`${baseDir}/packs/${pack}`, `${baseDir}/dist/packs/${pack}`, { yaml: false });
        }
      }
    }
  };
};

export default (options) => {
  const { mode } = options;
  return {
    root: 'src/',
    base: `/${PACKAGE_ID}/`,
    publicDir: '../public',
    cacheDir: '../.vite-cache',
    resolve: { conditions: ['import', 'browser'] },
    esbuild: {
      target: ['es2022']
    },
    css: {
      postcss: postcssConfig({ compress: COMPRESS, sourceMap: SOURCEMAPS })
    },
    server: {
      port: 30001,
      open: '/game',
      proxy: {
        [`^(/${PACKAGE_ID}/(assets|lang|packs|style.css))`]: 'http://localhost:30000',
        [`^(?!/${PACKAGE_ID}/)`]: 'http://localhost:30000',
        '/socket.io': { target: 'ws://localhost:30000', ws: true }
      }
    },

    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: SOURCEMAPS,
      brotliSize: true,
      minify: COMPRESS ? 'terser' : false,
      target: ['es2022'],
      terserOptions: COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
      copyPublicDir: mode === 'production' ? true : false,
      lib: {
        entry: './index.js',
        formats: ['es'],
        fileName: 'index'
      }
    },

    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022'
      }
    },

    plugins: [
      svelte({
        compilerOptions: {
          cssHash: ({ hash, css }) => `svelte-cel-${hash(css)}`
        },
        preprocess: preprocess()
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      postBuild(mode)
    ]
  };
};
