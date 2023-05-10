<template>
    <div class="podium-stand">
        <div class="podium-stand__bottom">{{ label }}</div>
        <card-slot :active="active">
            <slot />
            <template #card>
                <div class="podium-stand__card" ref="targetEl">
                    <podium-card
                      v-if="card !== null"
                      :card="card"
                    />
                </div>
            </template>
        </card-slot>
    </div>
</template>

<script setup lang="ts">
import CardSlot from "./CardSlot.vue";
import PodiumCard from "./PodiumCard.vue";
import {PropType} from "vue";
import {CardReference} from "../types";
import {templateRef} from "@vueuse/core";

defineProps({
    label: {
        type: String,
        required: true,
    },
    active: Boolean,
    card: {
        type: Object as PropType<CardReference | null>,
        required: false,
        default: null,
    },
});

const targetEl = templateRef<HTMLDivElement>('targetEl');
defineExpose({
    targetEl,
});
</script>

<style lang="scss">
@import "src/assets/constants";

$line-height: 24px;

.vote:not(.vote--reveal-podium) .podium-stand .podium-stand__bottom {
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
    transition: margin-bottom $podium-transition-duration;
    margin-top: 8px;
    box-shadow: 3px 3px #0003;
  }

  &.podium-stand--first {
    --vertical-padding: 24px;
    --color: #{$first};
  }

  &.podium-stand--second {
    --vertical-padding: 16px;
    --color: #{$second};
  }

  &.podium-stand--third {
    --vertical-padding: 8px;
    --color: #{$third};
  }

  &.podium-stand--negative {
    --vertical-padding: 12px;
    --color: #{$negative};
  }
}

.vote--desktop .podium-stand {
  &.podium-stand--first {
    --vertical-padding: 28px;
  }

  &.podium-stand--second {
    --vertical-padding: 20px;
  }

  &.podium-stand--third {
    --vertical-padding: 12px;
  }

  &.podium-stand--negative {
    --vertical-padding: 8px;
  }
}
</style>
