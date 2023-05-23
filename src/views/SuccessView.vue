<template>
  <div class="success">
    <div class="success__emoji">
      🗳️
    </div>
    <h1>️Głos policzony!</h1>

    <floating-button @click="$emit('close')">Wróć do ekranu głównego</floating-button>
  </div>
</template>
<script setup lang="ts">
import FloatingButton from "../components/FloatingButton.vue";
import {useHTMLClass} from "../composables/html-class";
import {useWindowSize} from "@vueuse/core";
import {computed} from "vue";

useHTMLClass('page--success');

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);

defineEmits(['close']);
</script>

<style lang="scss">
.success {
  padding: 16px;
  box-sizing: border-box;
  min-height: v-bind(height);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;

  .success__emoji {
    font-size: 5rem;
    margin: 0;
    line-height: 1;
    text-shadow: 3px 3px #0003;
  }

  h1 {
    font-size: 1.8rem;
    margin-top: 56px;
    margin-bottom: 64px;
  }
}
</style>
