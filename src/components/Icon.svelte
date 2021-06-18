<script lang='ts'>
export let className = ''
export let icon = ''
export let size: number | string = 0

</script>

<span
  class={"icon material-icons-outlined " + className}
  style={size ? `font-size: ${typeof size === 'number' ? size + 'px' : size}` : ''}
>{icon}</span>
