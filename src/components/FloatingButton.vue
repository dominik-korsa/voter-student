<template>
  <button
    class="floating-button"
    :class="{
      'floating-button--loading': loading,
      'floating-button--blocked': blocked,
    }"
    :disabled="disable || loading || blocked"
    :tabindex="disable ? -1 : 0"
  >
    <span class="floating-button__content">
      <slot />
    </span>
    <span class="floating-button__loading">
      <loading-dots />
    </span>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LoadingDots from "./LoadingDots.vue";

export default defineComponent({
  components: {LoadingDots},
  props: {
    disable: Boolean,
    blocked: Boolean,
    loading: Boolean,
  },
});
</script>

<style lang="scss">
@import "src/assets/constants";
@import "src/assets/mixins";

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
  --position-transinition-duration: #{$podium-transition-duration};
  transition:
    bottom var(--position-transinition-duration),
    right var(--position-transinition-duration),
    left var(--position-transinition-duration),
    background 500ms,
    box-shadow 200ms,
    transform 200ms;
  cursor: pointer;
  --height: calc(2 * var(--vertical-padding) + #{$line-height});
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  @include noSelect();

  .floating-button__content, .floating-button__loading {
    grid-row: 1;
    grid-column: 1;
    display: block;
    transition: opacity 200ms;
  }

  &.floating-button--loading > .floating-button__content {
    opacity: 0;
    pointer-events: none;
  }

  &:not(.floating-button--loading) > .floating-button__loading {
    opacity: 0;
    pointer-events: none;
  }

  &.floating-button--blocked {
    background: #666;
    cursor: default;
  }

  @media screen and (max-width: 400px) {
    --horizontal-padding: 16px;
  }

  @media screen and (max-width: 360px) {
    --horizontal-padding: 12px;
    --vertical-padding: 8px;
    font-size: 0.9rem;
  }

  &:not(:disabled):hover {
    box-shadow: 5px 5px #0003;
    transform: scale(105%);
  }
}
</style>
