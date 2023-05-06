import {MaybeRefOrGetter, useEventListener} from "@vueuse/core";
import {ref} from "vue";

export const useNonTouchHover = (el: MaybeRefOrGetter<EventTarget | undefined | null>) => {
    const hovering = ref(false);
    useEventListener(el, 'pointerenter', (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        hovering.value = true;
    }, {passive: true});
    useEventListener(el, ['pointercancel', 'pointerleave'], () => {
        hovering.value = false;
    }, {passive: true});
    return hovering;
}
