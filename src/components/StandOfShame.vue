<template>
  <div class="stand-of-shame">
    <podium-stand
      label="-1 punkt"
      class="podium-stand--negative"
      :active="active"
      :card="card"
      ref="negative"
    >
        Przeciągnij tutaj logo, któremu dajesz <b class="stand-of-shame__negative-text">-1&nbsp;punkt</b>
    </podium-stand>
  </div>
</template>

<script lang="ts" setup>
import PodiumStand from "./PodiumStand.vue";
import {CardReference, Pos} from "../types";
import {isInside} from "../utils";
import {templateRef} from "@vueuse/core";
import {PropType} from "vue";

defineProps({
    active: Boolean,
    card: {
        type: Object as PropType<CardReference | null>,
        required: false,
        default: null,
    },
});

const negative = templateRef<InstanceType<typeof PodiumStand>>('negative');

const isHovered = (pos: Pos): boolean => {
    return isInside(negative.value.targetEl, pos);
}
defineExpose({ isHovered });
</script>

<style lang="scss">
.stand-of-shame {
  display: flex;
  align-items: flex-end;
  justify-content: center;

  > .podium-stand {
    margin: 0 8px;
  }

  .stand-of-shame__negative-text {
    color: indianred;
  }
}
</style>
