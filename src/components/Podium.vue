<template>
  <div class="podium">
    <podium-stand
      class="podium-stand--second"
      ref="second"
      label="3 punkty"
      :active="active"
      :card="secondCard"
    >
      Przeciągnij tutaj logo, któremu dajesz <b>3&nbsp;punkty</b>
    </podium-stand>
    <podium-stand
      class="podium-stand--first"
      label="5 punktów"
      :active="active"
      ref="first"
      :card="firstCard"
    >
      Przeciągnij tutaj logo, któremu dajesz <b>5&nbsp;punktów</b>
    </podium-stand>
    <podium-stand
      class="podium-stand--third"
      label="1 punkt"
      :active="active"
      ref="third"
      :card="thirdCard"
    >
      Przeciągnij tutaj logo, któremu dajesz <b>1&nbsp;punkt</b>
    </podium-stand>
  </div>
</template>

<script lang="ts" setup>
import {templateRef} from "@vueuse/core";
import {PropType} from "vue";
import {CardReference, Pos} from "../types";
import {isInside} from "../utils";
import PodiumStand from "./PodiumStand.vue";

defineProps({
  active: Boolean,
  firstCard: {
    type: Object as PropType<CardReference | null>,
    required: false,
    default: null,
  },
  secondCard: {
      type: Object as PropType<CardReference | null>,
      required: false,
      default: null,
  },
  thirdCard: {
      type: Object as PropType<CardReference | null>,
      required: false,
      default: null,
  },
});

type PodiumStand = InstanceType<typeof PodiumStand>;
const first = templateRef<PodiumStand>('first');
const second = templateRef<PodiumStand>('second');
const third = templateRef<PodiumStand>('third');

const getHovered = (pos: Pos): 'first' | 'second' | 'third' | null => {
    if (isInside(first.value.targetEl, pos)) return 'first';
    if (isInside(second.value.targetEl, pos)) return 'second';
    if (isInside(third.value.targetEl, pos)) return 'third';
    return null;
}
defineExpose({ getHovered });
</script>

<style lang="scss">
@import "src/assets/constants";

.podium {
  display: flex;
  grid-gap: $card-gap;
  align-items: flex-end;
  justify-content: center;
}
</style>
