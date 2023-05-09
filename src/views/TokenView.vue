<template>
  <div class="token">
    <div class="label">Podaj kod dostępu:</div>
    <input
      v-model="token"
      type="text"
      v-maska:[maskOptions]
      autofocus
      autocomplete="off"
      autocapitalize="none"
    />
    <div
      class="error"
      :class="{
        'error--visible': errorType !== null,
      }"
    >
      {{ errorMessage }}
    </div>

    <a href="/admin/" class="token__admin-link">
      Zaloguj się jako administrator
    </a>
  </div>
</template>

<style lang="scss">
@import "../assets/constants";

.page--token body {
  background: $yellow;
}

.token {
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

  .token__admin-link {
    margin-top: 24px;
    font-size: 0.9em;
  }
}
</style>

<script lang="ts" setup>
import {type MaskOptions, type MaskTokens, vMaska} from "maska";
import {computed, ref, watch} from "vue";
import {useHTMLClass} from "../composables/html-class";
import {useWindowSize, watchImmediate} from "@vueuse/core";
import {LoadingErrorType} from "../types";

useHTMLClass('page--token');

const props = defineProps<{
    initialToken: string | undefined;
    initialLoadingError: LoadingErrorType | undefined;
    checkToken: (token: string) => Promise<LoadingErrorType | null>;
}>();

const errorType = ref(props.initialLoadingError ?? null);
const token = ref(props.initialToken ?? '');

const errorMessage = ref('');
watchImmediate(errorType, (value) => {
    if (value === null) return;
    errorMessage.value = {
        'token-not-found': 'Nie znaleziono kodu',
        'token-used': 'Kod został już wykorzystany',
        'other-error': 'Wystąpił nieoczekiwany błąd',
    }[value];
});
watch(token, () => {
   errorType.value = null;
});

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);

const tokens: MaskTokens = {
  'Z': {
    pattern: /[a-zA-Z\d]/, transform: (chr: string) => chr.toLowerCase(),
  }
}

const maskOptions: MaskOptions = {
  mask: 'ZZZZ-ZZZZ',
  tokens,
}
</script>
