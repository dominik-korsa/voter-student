import {readonly, ref} from "vue";
import {useTimeoutFn} from "@vueuse/core";

export const useTimePassed = (millis: number) => {
    const result = ref(false);
    useTimeoutFn(() => {
        result.value = true;
    }, millis);
    return readonly(result);
}
