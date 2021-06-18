<style global>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

html, body, #root {
  height: 100%;
}

.container {
  max-width: 100%;
}

@screen sm {
  .container {
    max-width: 85vw;
  }
}

@screen md {
  .container {
    max-width: 80vw;
  }
}

@screen lg {
  .container {
    max-width: 80vw;
  }
}

@screen xl {
  .container {
    max-width: 62vw;
  }
}

@screen 2xl {
  .container {
    max-width: 62vw;
  }
}

.flexbox {
  display: flex;
  align-items: center;
}

div, button {
  user-select: none;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>