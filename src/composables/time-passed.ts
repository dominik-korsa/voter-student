import {onUnmounted, readonly, ref} from "vue";
import {useTimeoutFn} from "@vueuse/core";

export const useTimePassed = (millis: number) => {
    const result = ref(false);
    useTimeoutFn(() => {
      result.value = true;
    }, millis);
    onUnmounted(() => {
      result.value = false;
    });
    return readonly(result);
}
