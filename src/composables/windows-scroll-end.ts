import {computedEager, useElementSize, useScroll, useWindowSize} from "@vueuse/core";

export const useWindowScrollEnd = () => {
    const windowScroll = useScroll(window);
    const windowSize = useWindowSize();
    const documentSize = useElementSize(document.documentElement);
    return computedEager(
        () => (windowScroll.y.value + 48 >= documentSize.height.value - windowSize.height.value),
    );
}
