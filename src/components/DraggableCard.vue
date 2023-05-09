<template>
  <div class="card__wrapper" ref="wrapperEl">
    <div
      class="card"
      :class="{
        'card--dragged': dragged,
        'card--raised': raised,
        'card--disabled': disabled,
        'card--hidden': isDocked,
      }"
      ref="el"
      draggable="false"
      :style="style"
    >
      <div class="card-footer">{{ number }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {logicOr} from "@vueuse/math";
import {useNonTouchHover} from "../composables/hover";
import {useDragged} from "../composables/dragged";
import {computed, reactive, ref, watch} from "vue";
import {useCapacitor} from "../composables/capacitor";
import {computedEager, useVibrate, watchImmediate} from "@vueuse/core";
import {CardReference} from "../types";

const { vibrate } = useVibrate({ pattern: 50 });

const props = defineProps({
  number: {
      type: Number,
      required: true,
  },
  disabled: Boolean,
  isDocked: Boolean,
});

const emit = defineEmits<{
    (e: 'begin-dragging', card: CardReference): void;
    (e: 'end-dragging', card: CardReference): void;
    (e: 'dragging-move', card: CardReference, event: PointerEvent): void;
    (e: 'reset', card: CardReference): void;
}>()

const wrapperEl = ref<HTMLDivElement>();
const el = ref<HTMLDivElement>();

const { dragged, moving, getStyle, startNow, reset } = useDragged(
    el,
    wrapperEl,
    (event) => {
        emit('dragging-move', cardReference, event);
    },
    () => {
        emit('reset', cardReference);
    },
);
const draggedRaised = useCapacitor(moving, 300);
const raised = logicOr(
    draggedRaised,
    useNonTouchHover(el),
);

const cardReference: CardReference = reactive({
  number: computedEager(() => props.number),
  raised: dragged,
  startDrag: startNow,
  reset,
});

watchImmediate(dragged, (value) => {
  if (value) emit('begin-dragging', cardReference);
  else emit('end-dragging', cardReference);
});
const style = computed(() => {
  if (!draggedRaised.value) return {};
  return getStyle();
});

watch(() => props.isDocked, () => {
    vibrate();
});
</script>
