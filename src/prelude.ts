import { Buffer } from 'buffer'

// @ts-ignore
globalThis.process = { env: {} }
// @ts-ignore
globalThis.Buffer = Buffer
// @ts-ignore
globalThis.global = window
