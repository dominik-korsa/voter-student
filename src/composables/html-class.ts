import {onBeforeUnmount, onMounted} from "vue";

export const useHTMLClass = (className: string) => {
    onMounted(() => {
        document.documentElement.classList.add(className);
    });

    onBeforeUnmount(() => {
        document.documentElement.classList.remove(className);
    });
}
