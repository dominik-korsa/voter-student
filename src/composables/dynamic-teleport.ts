import {onUnmounted, Ref, watch, WatchStopHandle} from "vue";
import {MaybeRefOrGetter, toValue} from "@vueuse/core";

export const useDynamicTeleport = (
    el: Ref<Element | undefined>,
    target: MaybeRefOrGetter<Element | null>,
    wrapper: Readonly<Ref<Element | undefined>>,
) => {
    let stopHandle: WatchStopHandle | undefined;
    watch(el, (element) => {
        if (stopHandle) {
            stopHandle();
            stopHandle = undefined;
        }
        if (!element) return;
        stopHandle = watch(() => toValue(target) ?? wrapper.value, (value) => {
            value?.appendChild(element);
        }, { immediate: true });
    }, {immediate: true});
    onUnmounted(() => {
        el.value?.remove();
    })
}
