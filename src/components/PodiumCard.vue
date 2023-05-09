<template>
    <div
      class="card card--hoverable podium-card"
      :class="{
        'card--raised': card.raised,
      }"
      @pointerdown="onPointerDown"
      draggable="false"
      ref="el"
    >
      <div class="card-footer">{{ card.number }}</div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CardReference} from "../types";
import {templateRef} from "@vueuse/core";
import {getGlobalOffset} from "../utils";

export default defineComponent({
    props: {
        card: {
            type: Object as PropType<CardReference>,
            required: true,
        }
    },
    setup: (props) => {
        const el = templateRef<HTMLElement>('el');
        const getOffset = () => getGlobalOffset(el.value);
        return {
            onPointerDown: (event: PointerEvent) => {
                if (event.shiftKey) {
                    props.card.reset(getOffset());
                    return;
                }
                props.card.startDrag(getOffset, event);
            }
        }
    }
})
</script>

<style lang="scss">
.podium-card {
  touch-action: none;
}
</style>
