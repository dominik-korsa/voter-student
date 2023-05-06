import {ref, Ref, watch} from "vue";

export const useCapacitor = (src: Ref<boolean>, timeout: number) => {
    let cancelTimeoutId: number | undefined;
    const result = ref(src.value);
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
