<template>
  <div class="success" :class="{
    'success--closing': closing,
  }">
    <div class="success__emoji">
      🗳️
    </div>
    <h1>️Głos policzony!</h1>

    <floating-button @click="close()">
      Wróć do ekranu głównego
    </floating-button>
  </div>
</template>
<script setup lang="ts">
import FloatingButton from "../components/FloatingButton.vue";
import {useHTMLClass} from "../composables/html-class";
import {useTimeoutFn, useWindowSize} from "@vueuse/core";
import {computed, ref} from "vue";

const emit = defineEmits(['close']);

useHTMLClass('page--success');

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);

const closing = ref(false);
const close = () => {
  if (closing.value) return;
  closing.value = true;
  useTimeoutFn(() => {
    emit('close');
  }, 1000);
}
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

  &.success--closing {
    transition: opacity 400ms;
    opacity: 0;
  }

  .success__emoji {
    font-size: 5rem;
    margin: 0;
    line-height: 1;
    text-shadow: 3px 3px #0003;
    animation: scaleAppear 500ms 250ms backwards;
  }

  h1 {
    font-size: 1.8rem;
    margin-top: 56px;
    margin-bottom: 64px;
    animation: scaleAppear 500ms 400ms backwards;
  }

  .floating-button {
    animation: fadeIn 1000ms 2000ms backwards;
  }
}
</style>
