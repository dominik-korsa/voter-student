<template>
  <div class="slot">
    <div class="slot__background" :class="{ 'active': active }">
      <div>
        <slot />
      </div>
    </div>
    <slot name="card" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    active: Boolean,
  },
});
</script>

<style lang="scss">
@import "src/assets/constants";

.slot {
  width: var(--card-width);
  height: $card-height;
  display: grid;

  > * {
    grid-column: 1;
    grid-row: 1;
  }

  .slot__background {
    margin: 8px;
    border-radius: 10px;
    border: 2px dashed #0003;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px;
    font-size: min(0.6rem, 2.3vw);
    color: #000c;
    transition: border-color 200ms, background-color 200ms;

    @media screen and (max-width: 450px) {
      padding: 4px;
      margin: 6px;
    }

    &.active {
      border-color: #00CC9C;
      background: #00CC9C11;
    }

    &.slot__background--list {
      font-size: 1.2em;
      color: #0003;
      font-weight: 400;
    }
  }
}
</style>
