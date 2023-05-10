<template>
  <div
    class="vote-confirm"
    :class="{
      'vote-confirm--hidden': hidden,
      'vote-confirm--confirmed': confirmed,
    }"
  >
    <h1 class="vote-confirm__title vote-confirm__animated vote-confirm__animated--1">Czy wszystko się zgadza?</h1>
    <div class="vote-confirm__wrapper">
      <confirm-card class="vote-confirm__animated vote-confirm__animated--2" type="first" :logo="selections.first" />
      <confirm-card class="vote-confirm__animated vote-confirm__animated--3" type="second" :logo="selections.second" />
      <confirm-card class="vote-confirm__animated vote-confirm__animated--4" type="third" :logo="selections.third" />
      <confirm-card class="vote-confirm__animated vote-confirm__animated--5" type="negative" :logo="selections.negative" />
      <div class="vote-confirm__notice vote-confirm__animated vote-confirm__animated--6">
        <b>Uwaga!</b> Po oddaniu głosu nie ma możliwości zmiany wyboru.
      </div>
      <div class="vote-confirm__buttons vote-confirm__animated vote-confirm__animated--7">
        <floating-button
          class="vote-confirm__change"
          @click="$emit('close')"
          :disable="loading || confirmed"
        >
          👈 Zmień
        </floating-button>
        <floating-button
          class="vote-confirm__submit"
          @click="submit"
          :loading="loading"
          :disable="confirmed || !voteUnlocked"
        >
          Oddaj głos 🚀
        ️</floating-button>
      </div>
      <div class="vote-confirm__error" v-if="errorMessage !== ''">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useTimePassed} from "../composables/time-passed";
import {computedEager} from "@vueuse/core";
import {SlotName, VoteErrorType} from "../types";
import ConfirmCard from "./ConfirmCard.vue";
import FloatingButton from "./FloatingButton.vue";
import {ref, watch} from "vue";
import {delay} from "../utils";

const props = defineProps<{
  visible: boolean;
  selections: Record<SlotName, number>;
  confirmVote: () => Promise<VoteErrorType  | 'OTHER' | null>;
}>();

defineEmits<{
  (type: 'close'): void;
}>();

const initialTimePassed = useTimePassed(50);
const voteUnlocked = useTimePassed(2000);
const hidden = computedEager(() => !props.visible || !initialTimePassed.value);

const confirmed = ref(false);
const errorMessage = ref('');
const loading = ref(false);

watch(() => props.visible, (value) => {
  if (!value) errorMessage.value = '';
});

const submit = async () => {
  if (loading.value || !voteUnlocked.value) return;
  loading.value = true;
  errorMessage.value = '';
  const result = await props.confirmVote();
  if (result === null) {
    confirmed.value = true;
    await delay(10000);
    confirmed.value = false;
  } else {
    errorMessage.value = {
      INVALID_TOKEN: 'Kod do głosowania jest niepoprawny',
      LOGO_NOT_ALLOWED: 'Nie możesz głosować na logo osób z twojej klasy',
      NOT_PROVISIONED: 'System jest zresetowany, odśwież stronę',
      NOT_VOTING: 'Głosowanie jest zablokowane, odśwież stronę',
      TOKEN_ALREADY_USED: 'Ten kod do głosowania został już wykorzystany',
      OTHER: 'Wystąpił nieoczekiwany błąd',
    }[result];
  }
  loading.value = false;
}
</script>

<style lang="scss">
@use "sass:math";
@import "src/assets/constants";

$total-duration: 500ms;
$single-duration: 200ms;

$count: 7;
$single-offset: math.div(($total-duration - $single-duration), ($count - 1));

.vote-confirm {
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: 16px;
  user-select: text;

  .vote-confirm__title {
    text-align: center;
    margin: 0;
    line-height: 1.2;
  }

  .vote-confirm__wrapper, .vote-confirm__title, .vote-confirm__error {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 16px;
    padding-right: 16px;
  }

  .vote-confirm__wrapper {
    padding-top: 32px;
    padding-bottom: 16px;
    overflow: hidden;
    transition: margin-bottom 300ms 500ms, padding-bottom 300ms 500ms;
  }

  .confirm-card {
    margin-bottom: 16px;

    &.confirm-card--negative {
      margin-top: 32px;
    }

    @media screen and (max-height: 700px) {
      margin-top: 12px;

      &.confirm-card--negative {
        margin-top: 20px;
      }
    }
  }

  .vote-confirm__notice {
    text-align: center;
    margin-top: 32px;
    margin-bottom: 32px;
    font-size: 0.9rem;
  }

  .vote-confirm__buttons {
    display: grid;
    margin-left: 0;
    margin-right: 0;
    transition:
      transform $single-duration var(--delay), opacity $single-duration var(--delay),
      margin 400ms !important;
    gap: 16px;
    grid-template-columns: auto 1fr;

    .floating-button {
      grid-row: 1;
    }

    .vote-confirm__change {
      grid-column: 1;
    }

    .vote-confirm__submit {
      grid-column: 2;
    }

    &::before {
      grid-column: 1/3;
      grid-row: 1;
      content: ' ';
      display: block;
      opacity: 0;
      background: #333;
      transition: opacity 350ms 100ms, box-shadow 150ms 300ms;
      pointer-events: none;
      z-index: 1;
    }
  }

  .vote-confirm__error {
    color: $error;
    margin-top: 16px;
    text-align: center;
  }

  &.vote-confirm--hidden {
    user-select: none;
    pointer-events: none;

    .vote-confirm__animated {
      transform: translateY(-30px);
      opacity: 0;
      --delay: calc(#{$total-duration - $single-duration} - var(--base-delay));
    }
  }

  &.vote-confirm--confirmed {
    user-select: none;

    @keyframes cardDisappear {
      to {
        transform: translateY(600px);
      }
    }

    @keyframes slotDisappear {
      to {
        height: 0;
      }
    }

    .vote-confirm__title, .vote-confirm__notice {
      opacity: 0;
    }

    .vote-confirm__wrapper {
      padding-bottom: 0;
      margin-bottom: 16px;
    }

    .vote-confirm__buttons {
      margin-left: -8px;
      margin-right: -8px;

      > .floating-button {
        box-shadow: none;
        pointer-events: none;
        transition: visibility 0ms 500ms;
        visibility: hidden;
      }

      &::before {
        align-self: center;
        opacity: 1;
        height: 100%;
        box-shadow: 5px 5px 0 #000a inset;
        animation: slotDisappear 500ms 2500ms forwards;
      }
    }

    .confirm-card {
      position: relative;
      animation: cardDisappear ease-in 700ms var(--fall-delay) forwards;
      z-index: 2;
    }
  }

  .vote-confirm__animated {
    transition: transform $single-duration, opacity $single-duration;
    transition-delay: var(--delay);
    --delay: var(--base-delay);
  }

  @for $i from 1 through $count {
    .vote-confirm__animated--#{$i} {
      --base-delay: #{$single-offset * ($i - 1)};
    }
  }

  @for $i from 1 through 4 {
    .vote-confirm__animated--#{$i + 1} {
      --fall-delay: #{800ms + 200ms * (4-$i)};
    }
  }
}
</style>
