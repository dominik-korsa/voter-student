<template>
  <div class="vote" :class="{
    'vote--dragging': dragging
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
          />
        </template>
      </card-slot>
    </div>
    <div class="vote__overlay" />
    <div class="vote__shelf">
      <podium
        :reveal="revealPodium"
        :active="dragging"
        @update:hovered="podiumHover = $event"
        :cards="podiumCards"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Podium from "../components/Podium.vue";
import {computedEager, useVibrate} from "@vueuse/core";
import {ref, watch, watchEffect} from "vue";
import CardSlot from "../components/CardSlot.vue";
import {logicOr} from "@vueuse/math";
import {CardReference, PodiumHovered} from "../types";
import DraggableCard from "../components/DraggableCard.vue";
import {useWindowScrollEnd} from "../composables/windows-scroll-end";
import {range} from "../utils";

const { vibrate } = useVibrate({ pattern: 50 });

const draggedCard = ref<CardReference | null>(null);
const podiumHover = ref<PodiumHovered | null>(null);
const podiumCards = ref<(CardReference | null)[]>([null, null, null]);

watchEffect(() => {
  const cardValue = draggedCard.value;
  if (cardValue === null) return;
  podiumCards.value = podiumCards.value.map((current, index): CardReference | null => {
    if (podiumHover.value && podiumHover.value?.index === index) {
      if (current === null) return cardValue;
    }
    if ((podiumHover.value && podiumHover.value?.index === index) || current?.number !== cardValue.number) return current;
    return null;
  });
});

const onDragStart = (card: CardReference) => { draggedCard.value = card; };
const onDragEnd = () => { draggedCard.value = null; };
const dragging = computedEager(() => draggedCard.value !== null);

const scrollEnd = useWindowScrollEnd();
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
    padding: 8px 8px 128px + $card-height;
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
    transition: opacity 200ms;
    background: black;
    opacity: 0;
  }

  &.vote--dragging .vote__overlay {
    opacity: 0.4;
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
