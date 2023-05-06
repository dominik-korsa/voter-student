<template>
  <div class="podium">
    <podium-stand
      class="podium-stand--second"
      ref="second"
      label="3 punkty"
      :active="active"
      :card="cards[1]"
    >
      Przeciągnij tutaj logo, któremu dajesz <b>3&nbsp;punkty</b>
    </podium-stand>
    <podium-stand
      class="podium-stand--first"
      label="5 punktów"
      :active="active"
      ref="first"
      :card="cards[0]"
    >
      Przeciągnij tutaj logo, któremu dajesz <b>5&nbsp;punktów</b>
    </podium-stand>
    <podium-stand
      class="podium-stand--third"
      label="1 punkt"
      :active="active"
      ref="third"
      :card="cards[2]"
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
  cards: {
    type: Array as PropType<(CardReference | null)[]>,
    required: true,
  },
});

const slots = ['first', 'second', 'third'].map((key) => templateRef<InstanceType<typeof PodiumStand>>(key));

const getHovered = (pos: Pos): number | null => {
    const index = slots.findIndex((slot) => isInside(slot.value.targetEl, pos));
    if (index === -1) return null;
    return index;
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
