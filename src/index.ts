/// <reference types="svelte/types/runtime/ambient" />
import './prelude'
import App from '~/views/App.svelte'
// @ts-ignore
window.global = window

new App({
  target: document.getElementById('root')!,
})
