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

useHTMLClass('page--voting-disabled');
</script>

<style lang="scss">
body:has(.voting-disabled), html.page--voting-disabled body {
  height: 100vh;
  overflow: hidden;
  overscroll-behavior-y: auto;

  #app {
    height: 100%;
  }
}

.voting-disabled {
  padding: 16px;
  height: 100%;
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
