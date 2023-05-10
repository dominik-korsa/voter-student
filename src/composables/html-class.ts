import {onBeforeUnmount} from "vue";
import {MaybeRefOrGetter, notNullish, toValue, watchImmediate} from "@vueuse/core";

const tryAdd = (value: string | null | undefined) => {
    if (!notNullish(value)) return;
    document.documentElement.classList.add(value);
}

const tryRemove = (value: string | null | undefined) => {
    if (!notNullish(value)) return;
    document.documentElement.classList.remove(value);
}

export const useHTMLClass = (className: MaybeRefOrGetter<string | null>) => {
    watchImmediate(() => toValue(className), (value, oldValue) => {
        tryAdd(value);
        tryRemove(oldValue);
    });

    onBeforeUnmount(() => {
        tryRemove(toValue(className));
    });
}
