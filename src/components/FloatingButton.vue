<template>
  <button class="floating-button">
    <slot />
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({

});
</script>

<style lang="scss">
@import "src/assets/constants";

.floating-button {
  background: $green;
  color: white;
  border: none;
  border-radius: 0;
  box-shadow: 3px 3px #0003;
  --horizontal-padding: 20px;
  --vertical-padding: 12px;
  padding: var(--vertical-padding) var(--horizontal-padding);
  $line-height: 24px;
  line-height: $line-height;
  font-size: 1rem;
  font-family: inherit;
  font-weight: bold;
  transition: bottom $podium-transition-duration, right $podium-transition-duration, box-shadow 200ms, transform 200ms;
  cursor: pointer;
  --height: calc(2 * var(--vertical-padding) + #{$line-height});

  @media screen and (max-width: 400px) {
    --horizontal-padding: 16px;
  }

  @media screen and (max-width: 360px) {
    --horizontal-padding: 12px;
    --vertical-padding: 8px;
    font-size: 0.9rem;
  }

  &:hover {
    box-shadow: 5px 5px #0003;
    transform: scale(105%);
  }
}
</style>
