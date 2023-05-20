<template>
  <div class="voting-disabled">
    <h1>Głosowanie jest zablokowane</h1>
    <div>Skontaktuj się z administratorem</div>

    <a href="/admin/" class="voting-disabled__admin-link">
      Jestem administratorem.
    </a>
  </div>
</template>

<script lang="ts" setup>
import {useHTMLClass} from "../composables/html-class";
import {useWindowSize} from "@vueuse/core";
import {computed} from "vue";

useHTMLClass('page--voting-disabled');

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);
</script>

<style lang="scss">
body:has(.voting-disabled), html.page--voting-disabled body {
  overscroll-behavior-y: auto;
}

.voting-disabled {
  padding: 16px;
  box-sizing: border-box;
  min-height: v-bind(height);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;

  h1 {
    font-size: 1.8rem;
  }

  .voting-disabled__admin-link {
    font-size: 0.9em;
    margin-top: 48px;
  }
}
</style>
