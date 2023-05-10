<template>
  <div
    class="vote-confirm"
    :class="{
      'vote-confirm--hidden': hidden,
    }"
  >
    <h1 class="vote-confirm__title">Czy wszystko się zgadza?</h1>
    <confirm-card type="first" :logo="selections.first.number" />
    <confirm-card type="second" :logo="selections.second.number" />
    <confirm-card type="third" :logo="selections.third.number" />
    <confirm-card type="negative" :logo="selections.negative.number" />
    <div class="vote-confirm__notice">
      <b>Uwaga!</b> Po oddaniu głosu nie ma możliwości zmiany wyboru.
    </div>
    <div class="vote-confirm__buttons">
      <floating-button
        class="vote-confirm__change"
        @click="$emit('close')"
      >
        👈 Zmień
      </floating-button>
      <floating-button class="vote-confirm__submit">Oddaj głos 🚀️</floating-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useTimePassed} from "../composables/time-passed";
import {computedEager} from "@vueuse/core";
import {CardReference, SlotName} from "../types";
import ConfirmCard from "./ConfirmCard.vue";
import FloatingButton from "./FloatingButton.vue";

const props = defineProps<{
  visible: false;
  selections: Record<SlotName, CardReference>
}>();

defineEmits<{
  (type: 'close'): void;
}>();

const initialTimePassed = useTimePassed(50);
const hidden = computedEager(() => !props.visible || !initialTimePassed.value);
</script>

<style lang="scss">
@use "sass:math";

$total-duration: 500ms;
$single-duration: 200ms;

$count: 7;
$single-offset: math.div(($total-duration - $single-duration), ($count - 1));

.vote-confirm {
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0 16px 16px;
  user-select: text;

  .vote-confirm__title {
    text-align: center;
    margin: 32px 0;
    line-height: 1.2;
  }

  .confirm-card, .vote-confirm__notice, .vote-confirm__buttons {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .confirm-card {
    margin-top: 16px;

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
    display: flex;
    gap: 12px;

    .floating-button {
      display: block;
    }

    .vote-confirm__submit {
      flex-grow: 1;
    }
  }

  &.vote-confirm--hidden {
    user-select: none;
    pointer-events: none;

    > * {
      transform: translateY(-30px);
      opacity: 0;
      transition-delay: calc(#{$total-duration - $single-duration} - var(--delay));
    }
  }

  > * {
    transition: transform $single-duration, opacity $single-duration;
    transition-delay: var(--delay);
  }

  @for $i from 1 through $count {
    > *:nth-child(#{$i}) {
      --delay: #{$single-offset * ($i - 1)};
    }
  }
}
</style>
