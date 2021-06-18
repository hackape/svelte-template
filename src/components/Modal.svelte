<script lang="ts">
import { fade, fly } from 'svelte/transition'
import { portal } from './Portal.svelte'
export let container: string | HTMLElement = 'body'
export let visible = false
export let blur = false
export let position: 'center' | 'top' = 'top'
export let title: string = ''
export let overlayClosable = true

</script>

{#if visible}
  <div class="modal-positioner" use:portal={container || 'body'}>
    <div
      transition:fade={{ duration: 200 }}
      class="overlay"
      class:blur
      on:click={() => {
        if (overlayClosable) visible = false
      }}
    />
    <div
      transition:fly={{ y: -20, duration: 200 }}
      class="modal bg-white shadow-2xl rounded divide-y border"
      class:center={position == 'center'}
      class:top={position == 'top'}
    >
      {#if title || $$slots.header}
        <div class="header px-4 py-2">
          <slot name="header">
            <div class="title">{title}</div>
          </slot>
        </div>
      {/if}
      <div class="content">
        <slot name="content" />
      </div>
      {#if $$slots.footer}
        <div class="footer px-4 py-2">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="stylus">
  .modal-positioner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .overlay {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  
  .blur {
    backdrop-filter: blur(3px);
  }
  
  .modal {
    z-index: 10;
  }
  
  .modal.top {
    align-self: flex-start;
    padding-top: 0.5em;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .header, .footer {
    display: flex;
    align-items: center;
  }

</style>
