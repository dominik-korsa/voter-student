import {ref, watch} from "vue";
import {ReadonlyRefOrGetter, toValue} from "@vueuse/core";

export const useCapacitor = (src: ReadonlyRefOrGetter<boolean>, timeout: number) => {
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
