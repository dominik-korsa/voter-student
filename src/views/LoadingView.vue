<template>
  <div class="loading-page">
    <h1 class="loading-page__title">Wczytywanie<loading-dots /></h1>
  </div>
</template>

<script lang="ts" setup>
import {useHTMLClass} from "../composables/html-class";
import LoadingDots from "../components/LoadingDots.vue";

useHTMLClass('page--loading');
</script>


<style lang="scss">
body:has(.loading-page), html.page--loading body {
  height: 100vh;
  overflow: hidden;

  #app {
    height: 100%;
  }
}

.loading-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .loading-page__title {
    font-size: 1.5rem;
    font-weight: normal;
  }
}
</style>
