<script lang="ts">
import { createEventDispatcher, onDestroy, onMount } from 'svelte'
import { portal } from './Portal.svelte'

type Alignment = 'tl' | 'tr' | 'bl' | 'br'

export let triggerEvent: 'click' | 'mouseenter' = 'click'
export let showOverlay = false
export let align: [Alignment, Alignment] = ['tl', 'bl']
export let offset: [number, number] = [0, 0]
export let visible = false
export let controlled = false

function object2style(obj: object) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}:${typeof value == 'number' ? value + 'px' : value}`)
    .join(';')
}

function getPositionerRect(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY
  const bottom = top + height
  const right = left + width
  const pos = {
    width,
    height,
    left,
    top,
    bottom,
    right,
    '--trigger-anchor-width': width,
  }
  return pos
}

function getHoleClipPath(p) {
  const s = [p.left, p.top, p.right, p.bottom]
  s.forEach((value, idx) => {
    s[idx] = Math.round(value)
  })
  let [left, top, right, bottom] = s
  const inner_path = [`${left}px ${top}px`, `${right}px ${top}px`, `${right}px ${bottom}px`, `${left}px ${bottom}px`]
  inner_path.push(inner_path[0])
  return `clip-path: polygon(evenodd, 0 0, 100% 0, 100% 100%, 0% 100%, 0 0, ${inner_path.join(',')});`
}

function getContentPos(align: [Alignment, Alignment]) {
  const [contentAlign, anchorAlign] = align
  const [ctb, clr] = contentAlign
  const [atb, alr] = anchorAlign

  let tbKey: string
  let tbValue: any
  let lrKey: string
  let lrValue: any
  if (ctb == atb) {
    tbKey = ctb == 't' ? 'top' : 'bottom'
    tbValue = 0
  } else {
    tbKey = ctb == 't' ? 'top' : 'bottom'
    tbValue = '100%'
  }

  if (clr == alr) {
    lrKey = clr == 'l' ? 'left' : 'right'
    lrValue = 0
  } else {
    lrKey = clr == 'l' ? 'left' : 'right'
    lrValue = '100%'
  }

  return { [tbKey]: tbValue, [lrKey]: lrValue, ['margin-' + tbKey]: offset[0], ['margin-' + lrKey]: offset[1] }
}

const noop = () => {}
let dispose = () => {}
let anchorElement: HTMLElement
function saveRef(el: HTMLElement) {
  anchorElement = el
}

let isMounted = false
onMount(() => (isMounted = true))

const removeKeydownListener = () => {
  document.removeEventListener('keydown', hideByKey, { capture: true })
}

const dispatch = createEventDispatcher()
function setVisible(_visible: boolean) {
  const handle = {
    visible: _visible,
    defaultPrevented: false,
  }
  dispatch('change', handle)
  if (_visible) {
    dispatch('show', handle)
  } else {
    dispatch('hide', handle)
  }
  if (!handle.defaultPrevented) {
    visible = _visible
    return true
  } else {
    return false
  }
}

const hideByKey = e => {
  if (e.key !== 'Escape') return
  e.preventDefault()
  const success = setVisible(false)
  if (success) removeKeydownListener()
}

const triggerHide = () => {
  const success = setVisible(false)
  if (success) removeKeydownListener()
}

const triggerShow = () => {
  if (visible) return
  const success = setVisible(true)
  if (success) {
    document.addEventListener('keydown', hideByKey, { capture: true })
  }
}

$: {
  if (isMounted) {
    dispose()
    const eventType = triggerEvent
    const targetEl = anchorElement
    if (!controlled) {
      targetEl.addEventListener(eventType, triggerShow, { capture: true })
      dispose = () => {
        targetEl.removeEventListener(eventType, triggerShow, { capture: true })
      }
    }
  }
}

let anchorPos: ReturnType<typeof getPositionerRect>
let contentPos: any = {}
$: {
  if (visible) {
    anchorPos = getPositionerRect(anchorElement)
    contentPos = getContentPos(align)
  }
}

onDestroy(() => {
  dispose()
  removeKeydownListener()
})

</script>

<slot name="anchor" anchor={saveRef} hide={triggerHide} show={triggerShow} />
{#if visible}
  <span
    class="trigger-overlay"
    class:shown={showOverlay}
    style={`${getHoleClipPath(anchorPos)}`}
    on:click|capture={triggerEvent === 'click' ? triggerHide : noop}
    on:mouseenter|capture={triggerEvent === 'mouseenter' ? triggerHide : noop}
    use:portal
  />
  <span class="trigger-positioner" style={object2style(anchorPos)} use:portal>
    <span class="trigger-content" style={object2style(contentPos)}>
      <slot name="content" hide={triggerHide} show={triggerShow} />
    </span>
  </span>
{/if}

<style>
.trigger-positioner {
  position: fixed;
  z-index: 1001;
  background-color: transparent;
  pointer-events: none;
}

.trigger-content {
  position: absolute;
  z-index: 1001;
  pointer-events: all;
}

.trigger-overlay {
  background-color: rgba(55, 55, 55, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  opacity: 0;
}

.trigger-overlay.shown {
  opacity: 1;
  /* backdrop-filter: blur(3px); */
}

</style>
