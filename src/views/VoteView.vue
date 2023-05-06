<template>
  <div class="vote" :class="{
    'vote--dragging': dragging,
    'vote--reveal-podium': revealPodium,
    'vote--scroll-end': scrollEnd,
  }">
    <div class="vote__list" v-memo="[cards]">
      <card-slot
        v-for="card in cards"
        :key="card.number"
        :number="card.number"
        v-memo="[card.number, card.docked]"
      >
        <template #card>
          <draggable-card
            :number="card.number"
            :isDocked="card.docked"
            @begin-dragging="onDragStart"
            @end-dragging="onDragEnd"
            @dragging-move="onDragMove"
          />
        </template>
      </card-slot>
    </div>
    <div class="vote__overlay" />
    <floating-button class="vote__next" :class="{
        'vote__next--hidden': nextHidden,
    }">
        Dalej 👉
    </floating-button>
    <div class="vote__shelf">
      <podium
        :active="dragging"
        :cards="podiumCards"
        ref="podium"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Podium from "../components/Podium.vue";
import {computedEager, templateRef, useVibrate} from "@vueuse/core";
import {computed, reactive, ref, watch} from "vue";
import CardSlot from "../components/CardSlot.vue";
import {logicOr} from "@vueuse/math";
import {CardReference} from "../types";
import DraggableCard from "../components/DraggableCard.vue";
import {useWindowScrollEnd} from "../composables/windows-scroll-end";
import {range} from "../utils";
import FloatingButton from "../components/FloatingButton.vue";

const { vibrate } = useVibrate({ pattern: 50 });

const podium = templateRef<InstanceType<typeof Podium>>('podium');

const draggedCards = reactive(new Set<number>());
const podiumCards = ref<(CardReference | null)[]>([null, null, null]);

const nextHidden = computed(
  () => podiumCards.value.some((el) => el === null),
);

const onDragStart = (card: CardReference) => { draggedCards.add(card.number); };
const onDragEnd = (card: CardReference) => { draggedCards.delete(card.number); };
const onDragMove = (card: CardReference, event: PointerEvent) => {
    const hovered = podium.value.getHovered(event);
    const newCards = podiumCards.value.map((current, index): CardReference | null => {
        if (hovered === index && current === null) return card;
        if (hovered !== index && current?.number === card.number) return null;
        return current;
    });
    if (newCards.every((el, index) => el?.number === podiumCards.value[index]?.number)) return;
    podiumCards.value = newCards;
}
const dragging = computedEager(() => draggedCards.size > 0);

const scrollEnd = useWindowScrollEnd(60);
watch(() => scrollEnd.value, () => {
  vibrate();
});

const revealPodium = logicOr(scrollEnd, dragging);

const cardNumbers = range(1, 100);
const cards = computedEager(() => {
    const dockedNumbers = new Set<number>();
    podiumCards.value.forEach((card) => {
        if (!card) return;
        dockedNumbers.add(card.number);
    });
    return cardNumbers.map((number) => ({
        number,
        docked: dockedNumbers.has(number),
    }));
});
</script>

<style lang="scss">
@import "../assets/constants";

.vote {
  user-select: none;
  position: relative;
  overflow: hidden;
  min-height: 100vh;

  .vote__list {
    padding: 8px 8px 140px + $card-height;
    display: grid;
    grid-gap: $card-gap;
    grid-template-columns: repeat(auto-fit, minmax(var(--card-width), 1fr));
    max-width: calc((var(--card-width) + $card-gap) * 5 - $card-gap);
    margin-left: auto;
    margin-right: auto;
    justify-items: center;
  }

  .vote__overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: opacity $podium-transition-duration;
    background: black;
    opacity: 0;
  }

  &.vote--dragging .vote__overlay {
    opacity: 0.4;
  }

  $vote-next-width: 72px;

  .vote__next {
    z-index: 1;
    position: fixed;
    right: 16px;
    bottom: 122px;
    box-sizing: content-box;
  }

  &.vote--scroll-end .vote__next {
    bottom: calc(180px - var(--height) / 2 + 2px);
  }

  &.vote--dragging .vote__next, .vote__next.vote__next--hidden {
    right: -120px;
    pointer-events: none;
  }

  .vote__shelf {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: $background;
    padding-top: 8px;
    box-shadow: 0 0 0 3px #0003;
  }
}
</style>
