<template>
  <div class="confirm-card" :class="`confirm-card--${type}`">
    <div class="confirm-card__left">
      <div class="confirm-card__label">
        {{ label }}
      </div>
      <div class="confirm-card__subtext">
        {{ subtext }}
      </div>
    </div>
    <div class="confirm-card__separator" />
    <div class="confirm-card__right">
      <div class="confirm-card__number-text">Logo numer</div>
      <div class="confirm-card__number">{{ logo }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {SlotName} from "../types";
import {computed} from "vue";

const props = defineProps<{
  type: SlotName;
  logo: number;
}>();

const label = computed(() => ({
  first: '5 punktów',
  second: '3 punkty',
  third: '1 punkt',
  negative: '-1 punkt',
}[props.type]));

const subtext = computed(() => ({
  first: 'Pierwsze miejsce',
  second: 'Drugie miejsce',
  third: 'Trzecie miejsce',
  negative: 'Logo wymaga poprawy',
}[props.type]));
</script>

<style lang="scss">
@import "src/assets/constants";

$border-radius: 12px;

.confirm-card {
  display: flex;
  min-height: 80px;

  .confirm-card__left {
    flex-grow: 1;
    background: #fff;
    border-top-left-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
    box-shadow: 3px 3px 0 #0003;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 16px;

    .confirm-card__label {
      font-size: 1.3rem;
      font-weight: bold;
      line-height: 1;
      color: var(--color);
    }

    .confirm-card__subtext {
      font-size: 0.9rem;
      margin-top: 2px;
    }
  }

  .confirm-card__separator {
    width: 16px;
    background: var(--color);
    box-shadow: 3px 2.5px 0 #0003, 3px 0 0 #0003 inset;
    margin-top: 2px;
  }

  .confirm-card__right {
    min-width: 100px;
    padding: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    box-shadow: 3px 3px 0 #0003;

    .confirm-card__number-text {
      font-size: 0.8rem;
    }

    .confirm-card__number {
      font-size: 1.6rem;
      font-weight: 600;
    }
  }

  &.confirm-card--first {
    --color: #{$first};
  }

  &.confirm-card--second {
    --color: #{$second};

    .confirm-card__label {
      color: #888;
    }
  }

  &.confirm-card--third {
    --color: #{$third};
  }

  &.confirm-card--negative {
    --color: #{$negative};
  }

  @media screen and (max-width: 380px) {
    .confirm-card__left {
      padding: 8px 12px;

      .confirm-card__subtext {
        font-size: 0.7rem;
      }
    }

    .confirm-card__right {
      min-width: 72px;

      .confirm-card__number-text {
        font-size: 0.7rem;
      }
    }

    .confirm-card__separator {
      width: 12px;
    }
  }

  @media screen and (max-height: 700px) {
    min-height: 72px;

    .confirm-card__number {
      line-height: 1.3;
    }
  }
}
</style>
