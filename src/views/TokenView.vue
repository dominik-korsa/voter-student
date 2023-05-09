<template>
  <div
    class="token"
    :class="{
      'token--completed': completed,
    }"
  >
    <div class="label">Podaj kod dostępu:</div>
    <div
      class="input-wrapper"
      :class="{
        'input-wrapper--loading': loading,
        'input-wrapper--narrow-placeholder': placeholder === '¯\\_(ツ)_/¯',
      }"
    >
      <input
        v-model="token"
        type="text"
        v-maska:[maskOptions]
        autofocus
        autocomplete="off"
        autocapitalize="none"
        @maska="onMaska"
        :readonly="completed"
        :placeholder="placeholder"
      />
      <div class="input-wrapper__loading" />
    </div>
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

<script lang="ts" setup>
import {MaskaDetail, type MaskOptions, vMaska} from "maska";
import {computed, ref} from "vue";
import {refAutoReset, useIntervalFn, useWindowSize, watchImmediate} from "@vueuse/core";
import {LoadingErrorType} from "../types";
import {createRandomToken, delay} from "../utils";

const props = defineProps<{
    initialToken: string | null;
    initialLoadingError: LoadingErrorType | null;
    checkToken: (token: string) => Promise<LoadingErrorType | null>;
}>();

const errorType = ref(props.initialLoadingError);
const token = ref(props.initialToken ?? '');

const errorMessage = ref(':)');
watchImmediate(errorType, (value) => {
    if (value === null) return;
    errorMessage.value = {
        'token-not-found': 'Nie znaleziono kodu',
        'token-used': 'Kod został już wykorzystany',
        'other-error': 'Wystąpił nieoczekiwany błąd',
    }[value];
});

const windowSize = useWindowSize();
const height = computed(() => `${windowSize.height.value - 0.1}px`);

const maskOptions: MaskOptions = {
    mask: 'ZZZZ-ZZZZ',
    tokens: {
        'Z': {
            pattern: /[a-zA-Z\d]/, transform: (chr: string) => chr.toLowerCase(),
        }
    },
}

const placeholder = ref('');
useIntervalFn(() => {
  placeholder.value = createRandomToken();
}, 6000, { immediateCallback: true });

const loading = ref(false);
let queuedCheck: string | null = null;
const completed = refAutoReset(false, 5000);

const check = async (value: string) => {
    return await props.checkToken(value).catch((error) => {
        console.error(error);
        return 'other-error' as const;
    });
}

const onChange = async (value: string) => {
  queuedCheck = value;
  if (loading.value || completed.value) return;
  loading.value = true;
  while (queuedCheck !== null) {
      const val = queuedCheck;
      queuedCheck = null;
      const [result] = await Promise.all([
          check(val),
          delay(200),
      ]);
      if (queuedCheck === null) errorType.value = result;
      if (result === null) {
          queuedCheck = null;
          completed.value = true;
      }
  }
  loading.value = false;
};

let lastValue = '';
const onMaska = (event: CustomEvent<MaskaDetail>) => {
    if (event.detail.masked === lastValue) return;
    lastValue = event.detail.masked;
    errorType.value = null;
    if (event.detail.completed) onChange(lastValue);
};
</script>

<style lang="scss">
@import "../assets/constants";

.token {
  display: flex;
  min-height: v-bind(height);
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 500ms;

  &.token--completed {
    opacity: 0;
  }

  .label {
    margin-bottom: 8px;
    font-size: 2em;
    color: #000c;
  }

  $loading-transition: 150ms;
  $loading-height: 8px;
  $border-radius: 8px;

  .input-wrapper {
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: 3px 3px #0003;
    transition: box-shadow 200ms, transform 200ms, margin-bottom $loading-transition;
    margin-bottom: $loading-height;

    &:focus-within {
      box-shadow: 5px 5px #0003;
      transform: scale(102%);
    }

    input {
      font-size: 3rem;
      width: 5.5em;
      background: white;
      color: #000;
      padding: 10px 8px;
      border-radius: $border-radius;
      outline: none;
      font-family: 'Space Mono', monospace;
      font-variant-ligatures: none;
      box-shadow: 4px 4px #0003;
      border: 1px solid #ccc;
      line-height: 1.2;

      &::placeholder {
        color: #00000015;
      }
    }

    &.input-wrapper--narrow-placeholder input::placeholder {
      letter-spacing: -0.04em;
    }

    @keyframes inputBackground {
      from {
        background-position-x: -58px;
      }
      to {
        background-position-x: 0;
      }
    }

    .input-wrapper__loading {
      height: 16px;
      margin-top: -16px;
      margin-left: 1px;
      margin-right: 1px;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      transition: margin-top $loading-transition;
      overflow: hidden;

      &:before {
        content: ' ';
        display: block;
        width: 150%;
        height: 100%;
        background: repeating-linear-gradient(
          -60deg,
          $green 0 20px,
          #00A37D 20px 25px
        );
        animation: inputBackground 1.5s infinite linear;
      }
    }

    &.input-wrapper--loading {
      margin-bottom: 0;

      .input-wrapper__loading {
        margin-top: -16px + $loading-height;
      }
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
