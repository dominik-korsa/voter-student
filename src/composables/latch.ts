import {whenever} from "@vueuse/core";
import {readonly, ref, WatchSource} from "vue";

export const useLatch = (src: WatchSource<boolean>) => {
    const latch = ref(false);
    const stopHandle = whenever(src, () => {
        latch.value = true;
        stopHandle();
    }, { immediate: true });
    return readonly(latch);
}
