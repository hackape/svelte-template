// @ts-check
import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import fs from 'fs'

const rawPlugin = () => ({
  enforce: 'post',
  name: 'raw',
  resolveId(id) {
    if (id.endsWith('?raw')) {
      return id
    }
  },
  load(id) {
    if (id.endsWith('?raw')) {
      const fpath = id.replace('?raw', '')
      const raw = fs.readFileSync(fpath, 'utf-8')
      return `export default ${JSON.stringify(raw)};`
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  plugins: [svelte(), rawPlugin()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, '.vscode/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, '.vscode/cert.pem')),
    // },
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: path.resolve(__dirname, 'src/index.html'),
  //     },
  //   },
  // },
})
