<template>
  <div class="podium" :class="{
    'podium--reveal': reveal
  }">
    <div class="podium-stand podium-stand--second">
      <div class="podium-stand__bottom">3 punkty</div>
      <card-slot :active="active">
        Przeciągnij tutaj logo, któremu dajesz <b>3&nbsp;punkty</b>
        <template #card>
          <div class="podium-stand__card" ref="second" />
            <podium-card
              v-if="cards[1] !== null"
              :card="cards[1]!"
            />
        </template>
      </card-slot>
    </div>
    <div class="podium-stand podium-stand--first">
      <div class="podium-stand__bottom">5 punktów</div>
      <card-slot :active="active">
        Przeciągnij tutaj logo, któremu dajesz <b>5&nbsp;punktów</b>
        <template #card>
          <div class="podium-stand__card" ref="first" />
            <podium-card
              v-if="cards[0] !== null"
              :card="cards[0]!"
            />
        </template>
      </card-slot>
    </div>
    <div class="podium-stand podium-stand--third">
      <div class="podium-stand__bottom">1 punkt</div>
      <card-slot :active="active">
        Przeciągnij tutaj logo, któremu dajesz <b>1&nbsp;punkt</b>
        <template #card>
          <div class="podium-stand__card" ref="third">
            <podium-card
              v-if="cards[2] !== null"
              :card="cards[2]!"
            />
          </div>
        </template>
      </card-slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computedEager, templateRef, useMouseInElement, watchImmediate} from "@vueuse/core";
import CardSlot from "./CardSlot.vue";
import {PropType} from "vue";
import {logicNot} from "@vueuse/math";
import {CardReference, PodiumHovered} from "../types";
import PodiumCard from "./PodiumCard.vue";

defineProps({
  reveal: Boolean,
  active: Boolean,
  cards: {
    type: Array as PropType<(CardReference | null)[]>,
    required: true,
  },
});

const emit = defineEmits(['update:hovered']);

const getSlotRef = (key: string) => {
  const el = templateRef<HTMLDivElement>(key);
  const { isOutside } = useMouseInElement(el);
  return {
    el,
    hovered: logicNot(isOutside),
  }
}
const slots = ['first', 'second', 'third'].map(getSlotRef);

const hoveredSlot = computedEager<PodiumHovered | null>(
  () => {
    const index = slots.findIndex((el) => el.hovered.value);
    if (index === -1) return null;
    return {
      index,
      slot: slots[index].el.value,
    }
  }
);
watchImmediate(hoveredSlot, (value, oldValue) => {
    if (value && oldValue && value.index === oldValue.index) return;
    emit('update:hovered', value)
});
</script>

<style lang="scss">
@import "src/assets/constants";

$transition-duration: 200ms;
$line-height: 24px;

.podium {
  display: flex;
  grid-gap: $card-gap;
  align-items: flex-end;
  justify-content: center;

  &:not(.podium--reveal) .podium-stand .podium-stand__bottom {
    margin-bottom: calc((-2) * var(--vertical-padding) - $line-height);
  }

  .podium-stand {
    width: var(--card-width);
    display: flex;
    flex-direction: column-reverse;
    justify-content: end;

    .podium-stand__bottom {
      border-top: 12px solid var(--color);
      padding: calc(var(--vertical-padding)) 4px;
      line-height: $line-height;
      white-space: nowrap;
      background: white;
      text-align: center;
      overflow: hidden;
      transition: margin-bottom $transition-duration;
      margin-top: 8px;
    }

    &.podium-stand--first {
      --vertical-padding: 24px;
      --color: goldenrod;
    }

    &.podium-stand--second {
      --vertical-padding: 16px;
      --color: silver;
    }

    &.podium-stand--third {
      --vertical-padding: 8px;
      --color: saddlebrown;
    }
  }
}
</style>
