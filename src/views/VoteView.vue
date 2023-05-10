<template>
  <div class="vote" :class="{
    'vote--dragging': dragging,
    'vote--reveal-podium': revealPodium,
    'vote--scroll-end': scrollEnd,
    'vote--desktop': isDesktop,
    'vote--covered': isCovered,
    'vote--covered-long': isCoveredCapacitor,
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
            @reset="onReset"
          />
        </template>
      </card-slot>
    </div>
    <div class="vote__overlay" />
      <floating-button
        class="vote__button vote__button--prev"
        :disable="!prevVisible"
        @click="onBack"
      >
      👈 Wstecz
    </floating-button>
    <floating-button
      class="vote__button vote__button--next"
      :disable="!nextVisible"
      @click="onNext"
    >
      Dalej 👉
    </floating-button>
    <div
      class="vote__shelf"
      :class="{
        'vote__shelf--show-stand-of-shame': isDesktop ? standOfShameAllowed : view !== 'podium',
      }"
    >
      <div class="vote__shelf-confirm">
        <vote-confirm />
      </div>
      <div class="vote__shelf-content">
        <div class="vote__shelf-spacer-1" />
        <podium
          :active="dragging"
          :first-card="selections.first"
          :second-card="selections.second"
          :third-card="selections.third"
          ref="podium"
        />
        <div class="vote__shelf-spacer-2" />
        <stand-of-shame
          :active="dragging"
          :card="selections.negative"
          ref="standOfShame"
        />
        <div class="vote__shelf-spacer-3" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Podium from "../components/Podium.vue";
import {computedEager, templateRef, useVibrate, useWindowSize} from "@vueuse/core";
import {computed, reactive, ref, watch} from "vue";
import CardSlot from "../components/CardSlot.vue";
import {logicOr, not} from "@vueuse/math";
import {CardReference, Pos} from "../types";
import DraggableCard from "../components/DraggableCard.vue";
import {useWindowScrollEnd} from "../composables/windows-scroll-end";
import FloatingButton from "../components/FloatingButton.vue";
import StandOfShame from "../components/StandOfShame.vue";
import {useLatch} from "../composables/latch";
import {useCapacitor} from "../composables/capacitor";
import {SystemInfoValid} from "../api/types";
import {useHTMLClass} from "../composables/html-class";
import VoteConfirm from "../components/VoteConfirm.vue";
import {useTimePassed} from "../composables/time-passed";

const props = defineProps<{
    systemInfo: SystemInfoValid;
}>();

const slotNames = ['first', 'second', 'third', 'negative'] as const;
type SlotName = typeof slotNames[number];

const { vibrate } = useVibrate({ pattern: 50 });
useHTMLClass('page--vote');

const podium = templateRef<InstanceType<typeof Podium>>('podium');
const standOfShame = templateRef<InstanceType<typeof StandOfShame>>('standOfShame');

const draggedCards = reactive(new Set<number>());
const dragging = computedEager(() => draggedCards.size > 0);
const view = ref<'podium' | 'stand-of-shame' | 'confirm'>('podium');

const initialTimePassed = useTimePassed(400);
const isCovered = computedEager(() => view.value === 'confirm' || !initialTimePassed.value);
const isCoveredCapacitor = useCapacitor(isCovered, 800);
const isNotCoveredCapacitor = not(useCapacitor(not(isCovered), 800));
useHTMLClass(() => isCovered.value ? 'disable-scroll' : null);

const selections = reactive<Record<SlotName, CardReference | null>>({
  first: null,
  second: null,
  third: null,
  negative: null,
});

const podiumCardsSet = computed(() =>
    selections.first !== null && selections.second !== null && selections.third !== null
);
const standOfShameAllowed = useLatch(not(useCapacitor(
    logicOr(
        not(podiumCardsSet),
        dragging,
    ),
    750,
)));
const allCardsSet = computed(
    () => podiumCardsSet.value && selections.negative !== null
);
const confirmAllowed = useLatch(not(useCapacitor(not(allCardsSet), 750)));

const prevVisible = computed(() => {
    if (view.value === 'confirm') return !isDesktop.value || isNotCoveredCapacitor.value;
    return view.value === 'stand-of-shame' && !isDesktop.value;
});

const nextVisible = computed(() => {
    if (view.value === 'confirm') return false;
    if (!isDesktop.value && view.value === 'podium') {
        return selections.negative !== null || (standOfShameAllowed.value && podiumCardsSet.value);
    }
    return allCardsSet.value && confirmAllowed.value && !isCoveredCapacitor.value;
});

const isPodiumVisible = () => view.value === 'podium' || (isDesktop.value || view.value === 'stand-of-shame');
const isStandOfShameVisible = () => view.value === 'stand-of-shame'
    || (view.value === 'podium' && isDesktop.value && standOfShameAllowed.value);

const getHovered = (pos: Pos): SlotName | null => {
    if (isPodiumVisible()) {
        const hovered = podium.value.getHovered(pos);
        if (hovered !== null) return hovered;
    }
    if (isStandOfShameVisible() && standOfShame.value.isHovered(pos)) return 'negative';
    return null;
}

const onDragStart = (card: CardReference) => { draggedCards.add(card.number); };
const onDragEnd = (card: CardReference) => { draggedCards.delete(card.number); };
const onDragMove = (card: CardReference, event: PointerEvent) => {
    const hovered = getHovered(event);
    slotNames.forEach((key) => {
        if (key === hovered && selections[key] === null) selections[key] = card;
        if (key !== hovered && selections[key]?.number === card.number) selections[key] = null;
    });
}
const onReset = (card: CardReference) => {
    slotNames.forEach((key) => {
        if (selections[key]?.number === card.number) selections[key] = null;
    });
}

const onBack = () => {
    if (view.value === 'confirm') view.value = 'stand-of-shame';
    else view.value = 'podium';
}
const onNext = () => {
    if (view.value === 'confirm') return;
    if (view.value === 'stand-of-shame' || isDesktop.value) view.value = 'confirm';
    else view.value = 'stand-of-shame';
};

const scrollEnd = useWindowScrollEnd(60);
watch(() => scrollEnd.value, () => {
  vibrate();
});
const windowSize = useWindowSize();
const isDesktop = computed(() => windowSize.width.value >= 900);

const revealPodium = logicOr(scrollEnd, dragging);

const cards = computedEager(() => {
    const dockedNumbers = new Set<number>();
    slotNames.forEach((key) => {
      const card = selections[key];
      if (card === null) return;
      dockedNumbers.add(card.number);
    });
    return props.systemInfo.availableLogos.map((number) => ({
      number,
      docked: dockedNumbers.has(number),
    }));
});
</script>

<style lang="scss">
@import "../assets/constants";

body:has(.vote), html.page--vote body {
  background: $yellow-dark;
}

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

  .vote__button {
    z-index: 1;
    position: fixed;
    bottom: 122px;
    box-sizing: content-box;
  }

  .vote__button--prev {
    left: 16px;
  }

  .vote__button--next {
    right: 16px;
  }

  &.vote--scroll-end .vote__button {
    bottom: calc(180px - var(--height) / 2 + 2px);
  }

  &.vote--dragging .vote__button--prev, .vote__button--prev:disabled {
    left: -132px;
    pointer-events: none;
  }

  &.vote--dragging .vote__button--next, .vote__button--next:disabled {
    right: -120px;
    pointer-events: none;
  }

  .vote__shelf {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: $yellow;
    box-shadow: 0 0 0 3px #0003;
    overflow: hidden;
    min-height: 100px;
    transition: min-height 800ms ease-out;
    padding-top: 8px;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto;

    .vote__shelf-confirm {
      grid-column: 1;
      grid-row: 1;
    }

    .vote__shelf-content {
      grid-column: 1;
      grid-row: 1;
      transition: transform 600ms ease-out;
      transition-delay: 400ms;
      width: 100%;
      display: flex;
      align-self: end;
    }

    .podium {
      width: 100%;
      flex-shrink: 0;
      transition: margin-left 300ms;
    }

    .stand-of-shame {
      width: 100%;
      flex-shrink: 0;
    }

    &.vote__shelf--show-stand-of-shame .podium {
      margin-left: -100%;
    }
  }

  &.vote--covered-long {
    .vote__shelf-content {
      pointer-events: none;
    }

    &:not(.vote--desktop) {
      .vote__button--prev {
        transition-duration: 500ms;
      }
    }
  }

  &.vote--covered-long.vote--desktop, &.vote--covered {
    .vote__button--prev {
      bottom: 16px;
    }
  }

  &.vote--covered {
    &.vote--desktop .vote__button--prev {
      transition: left $podium-transition-duration;
    }

    .vote__shelf {
      min-height: 100%;

      .vote__shelf-confirm {
        height: 100%;
      }

      .vote__shelf-content {
        transform: translateY(180px);
        transition-delay: 0ms;
      }
    }
  }

  &.vote--desktop {
    .vote__shelf {
      .podium {
        width: auto;
        margin-left: 0;
      }

      $transition-duration: 500ms;

      .stand-of-shame {
        max-width: 0;
        overflow: hidden;
        flex-basis: fit-content;
        transition: max-width $transition-duration;
      }

      .vote__shelf-spacer-1, .vote__shelf-spacer-2, .vote__shelf-spacer-3 {
        transition: flex-grow $transition-duration, flex-basis $transition-duration;
      }

      .vote__shelf-spacer-1, .vote__shelf-spacer-2 {
        flex-grow: 1;
        flex-basis: 0;
      }

      .vote__shelf-spacer-2 {
        width: 32px;
      }

      &.vote__shelf--show-stand-of-shame {
        .podium {
          margin-left: 0;
        }

        .stand-of-shame {
          max-width: 450px;
        }

        .vote__shelf-spacer-2 {
          flex-grow: 0;
          flex-basis: 48px;
        }

        .vote__shelf-spacer-3 {
          flex-grow: 1;
        }
      }
    }
  }
}
</style>
