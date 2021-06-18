import { setContext, getContext } from 'svelte'
import { writable, derived } from 'svelte/store'

const KEY = '$$APP_CONTEXT'
type StoresInterface = ReturnType<typeof createStores>
let STORES: StoresInterface

function createStores() {
  return {}
}

export function getStores() {
  if (STORES) return STORES
  STORES = createStores()
  return STORES
}

export function initAppContext() {
  const stores = getStores()
  setContext(KEY, stores)
  return stores
}

export function getAppContext(): StoresInterface {
  return getContext(KEY)
}
