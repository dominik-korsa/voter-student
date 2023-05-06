import {computedEager, useElementSize, useScroll, useWindowSize} from "@vueuse/core";

export const useWindowScrollEnd = (offset: number) => {
    const windowScroll = useScroll(window);
    const windowSize = useWindowSize();
    const documentSize = useElementSize(document.documentElement);
    return computedEager(
        () => (windowScroll.y.value + offset >= documentSize.height.value - windowSize.height.value),
    );
}
