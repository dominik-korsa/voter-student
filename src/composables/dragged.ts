import {onBeforeUnmount, ref, Ref, StyleValue} from "vue";
import {computedEager, refAutoReset, useEventListener, useVibrate} from "@vueuse/core";
import {Offset, StatePointer} from "../types";

interface IdleState {
    type: 'idle';
}

interface WaitingState {
    type: 'waiting';
    pointer: StatePointer;
    timeoutId: number;
}

interface DraggingState {
    type: 'dragging',
    pointer: StatePointer;
    offsetX: number;
    offsetY: number;
}

type State = IdleState | WaitingState | DraggingState;

export const useDragged = (
    cardEl: Ref<HTMLElement | undefined>,
    parentEl: Ref<HTMLElement | undefined>,
    onMove: (event: PointerEvent) => void,
    onReset: () => void,
) => {
    const { vibrate } = useVibrate({pattern: 40});

    const state = ref<State>({ type: 'idle' });
    const resetOffset = refAutoReset<Offset | null>(null, 10);

    const getStyle = (): StyleValue => {
        if (!parentEl.value) return {};
        if (resetOffset.value !== null) return {
            position: 'absolute',
            left: `${resetOffset.value.left}px`,
            top: `${resetOffset.value.top}px`,
        }
        if (state.value.type !== 'dragging') return {
            position: 'absolute',
            left: `${parentEl.value.offsetLeft}px`,
            top: `${parentEl.value.offsetTop}px`,
        }
        return {
            position: 'absolute',
            left: `${state.value.pointer.x + state.value.offsetX}px`,
            top: `${state.value.pointer.y + state.value.offsetY}px`,
        };
    };

    const startNow = (getOffset: () => Offset, pointer: StatePointer) => {
        if (state.value.type === 'dragging') return;
        if (state.value.type === 'waiting') clearTimeout(state.value.timeoutId);
        if (!cardEl.value) {
            state.value = { type: 'idle' };
            return;
        }
        const offset = getOffset();
        state.value = {
            type: 'dragging',
            pointer: pointer,
            offsetX: offset.left - pointer.x,
            offsetY: offset.top - pointer.y,
        };
        cardEl.value?.setPointerCapture(state.value.pointer.pointerId);
        vibrate();
    }

    const startDelayed = (getOffset: () => Offset, pointer: StatePointer) => {
        if (state.value.type !== 'idle') return;
        state.value = {
            type: 'waiting',
            pointer,
            timeoutId: setTimeout(() => {
                if (state.value.type !== 'waiting') return;
                startNow(getOffset, state.value.pointer);
            }, 150),
        }
    }

    const start = (getOffset: () => Offset, pointer: StatePointer, delayed: boolean) => {
        if (delayed) startDelayed(getOffset, pointer);
        else startNow(getOffset, pointer);
    };

    const cancel = () => {
        if (state.value.type === 'dragging') {
            cardEl.value?.releasePointerCapture(state.value.pointer.pointerId);
        }
        if (state.value.type === 'waiting') clearTimeout(state.value.timeoutId);
        state.value = { type: 'idle' };
    };
    const reset = (offset: Offset) => {
        resetOffset.value = offset;
        onReset();
    }

    onBeforeUnmount(() => { cancel(); });

    useEventListener(cardEl, 'pointerdown', (event: PointerEvent) => {
        const cardElValue = cardEl.value;
        if (!cardElValue) return;
        start(() => ({
            left: cardElValue.offsetLeft,
            top: cardElValue.offsetTop,
        }), event, event.pointerType === 'touch');
    }, {passive: true});
    useEventListener(cardEl, ['pointercancel', 'pointerup', 'pointerleave'], () => {
        cancel();
    }, { passive: true });
    useEventListener(window, 'scroll', () => {
        cancel();
    }, { passive: true });
    useEventListener(cardEl, 'touchmove', (event) => {
        if (state.value.type !== 'dragging') return;
        event.preventDefault();
    }, { passive: false });
    useEventListener(cardEl, 'pointermove', (event: PointerEvent) => {
        if (state.value.type === 'idle') return;
        if (state.value.pointer.pointerId !== event.pointerId) return;
        state.value.pointer = event;
        onMove(event);
    }, { passive: true });

    let dragged = computedEager(() => state.value.type === 'dragging');
    return {
        dragged,
        moving: computedEager(() => dragged.value || resetOffset.value !== null),
        getStyle,
        startDelayed,
        startNow,
        start,
        reset,
    };
}
