import {ref, watch, WatchSource} from "vue";
import {toValue} from "@vueuse/core";

export const useCapacitor = (src: WatchSource<boolean>, timeout: number) => {
    let cancelTimeoutId: number | undefined;
    const result = ref(toValue(src));
    watch(src, (value) => {
        if (value) {
            result.value = true;
            if (cancelTimeoutId !== undefined) clearTimeout(cancelTimeoutId);
        } else {
            cancelTimeoutId = setTimeout(() => {
                result.value = false;
            }, timeout);
        }
    }, {immediate: true});
    return result;
}
