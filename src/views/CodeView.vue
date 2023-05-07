<template>
  <div class="code">
    <div class="label">Podaj kod dostępu:</div>
    <input type="text" v-maska:[options] autofocus @maska="onMaska" />
    <div class="error" :class="{
      'error--visible': errorVisible,
    }">Błędny kod</div>
  </div>
</template>

<style lang="scss">
@import "../assets/constants";

.page--code body {
  background: $yellow;
}

.code {
  display: flex;
  min-height: v-bind(height);
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .label {
    margin-bottom: 8px;
    font-size: 2em;
    color: #000c;
  }

  input {
    font-size: 3rem;
    width: 5.5em;
    border: none;
    background: white;
    color: #000;
    padding: 6px;
    border-radius: 8px;
    box-shadow: 3px 3px #0003;
    outline: none;
    transition: box-shadow 250ms;
    font-family: 'Space Mono', monospace;

    &:focus {
      box-shadow: 5px 5px #0003;
    }
  }

  .error {
    color: #c53333;
    margin-top: 8px;
    font-size: 1.5em;
    transition: opacity 200ms;

    &:not(.error--visible) {
      user-select: none;
      opacity: 0;
    }
  }
}
</style>

<script lang="ts" setup>
import {type MaskaDetail, type MaskOptions, type MaskTokens, vMaska} from "maska";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useHTMLClass} from "../composables/html-class";
import {useWindowSize} from "@vueuse/core";

const router = useRouter();
useHTMLClass('page--code');

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);

const tokens: MaskTokens = {
  'Z': {
    pattern: /[a-zA-Z\d]/, transform: (chr: string) => chr.toLowerCase(),
  }
}

const options: MaskOptions = {
  mask: 'ZZZZ-ZZZZ',
  tokens,
}

const code = ref('');
const validCode = 'abcd2137';
const errorVisible = computed(() => {
  return code.value.length == 10 && code.value !== validCode;
});

const onMaska = (event: CustomEvent<MaskaDetail>) => {
  code.value = event.detail.unmasked;
  if (code.value === validCode) router.push('/vote');
};
</script>
