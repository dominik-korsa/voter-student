<template>
    <suspense>
        <app-content />
        <template #fallback>
            <loading-view />
        </template>
    </suspense>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import LoadingView from "./views/LoadingView.vue";

const AppContent = defineAsyncComponent(() => import('./views/AppContent.vue'));

export default defineComponent({
    components: {
        LoadingView,
        AppContent,
    },
});
</script>
