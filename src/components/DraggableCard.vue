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
import {computed, onUpdated, reactive, ref, watch} from "vue";
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

const emit = defineEmits(['begin-dragging', 'end-dragging']);

const wrapperEl = ref<HTMLDivElement>();
const el = ref<HTMLDivElement>();

onUpdated(() => {
    console.log('Card updated', props.number);
})

const { dragged, getStyle, startNow } = useDragged(el, wrapperEl);
const draggedRaised = useCapacitor(dragged, 300);
const raised = logicOr(
    draggedRaised,
    useNonTouchHover(el),
);

const cardReference: CardReference = reactive({
  number: computedEager(() => props.number),
  raised: dragged,
  startDrag: startNow,
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

// useDynamicTeleport(el, () => {
//   if (draggedRaised.value) return null;
//   return props.target ?? null;
// }, wrapperEl);
</script>
