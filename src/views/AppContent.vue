<template>
    <voting-disabled-view
        v-if="votingDisabled"
    />
    <token-view
        v-else-if="systemInfo === null"
        :initial-token="initialToken"
        :initial-loading-error="initialLoadingError"
        :check-token="checkToken"
    />
    <vote-view
        :system-info="systemInfo"
        @success="onSuccess"
        v-else
    />
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent, ref} from "vue";
import {usePath} from "../composables/path";
import {LoadingErrorType} from "../types";
import {getSystemInfo, getSystemInfoWithToken} from "../api";
import {useTimeoutFn} from "@vueuse/core";

const TokenView = defineAsyncComponent(() => import('./TokenView.vue'));
const VotingDisabledView = defineAsyncComponent(() => import('./VotingDisabledView.vue'));
const VoteView = defineAsyncComponent(() => import('./VoteView.vue'));

const loadInitial = async () => {
    const { token, replacePath } = usePath();

    const result = await getSystemInfo(token).catch((error) => {
        console.error(error);
        return 'other-error' as const;
    });

    const votingDisabled = ref(result === 'reset' || result === 'not-voting');

    if (result === 'reset') replacePath(null);
    const initialLoadingError = ref<LoadingErrorType | null>(
      (result === 'token-used' || result === 'token-not-found' || result === 'other-error') ? result : null
    );

    return {
        votingDisabled,
        initialLoadingError,
        initialToken: ref(token),
        systemInfo: ref(typeof result === 'object' ? result : null),
        replacePath,
    }
}

export default defineComponent({
    components: {VoteView, VotingDisabledView, TokenView},
    setup: async () => {
        const {
            votingDisabled,
            initialLoadingError,
            initialToken,
            systemInfo,
            replacePath,
        } = await loadInitial();

        return {
            votingDisabled,
            initialToken,
            initialLoadingError,
            systemInfo,
            checkToken: async (token: string): Promise<LoadingErrorType | null> => {
                const result = await getSystemInfoWithToken(token).catch((error) => {
                    console.error(error);
                    return 'other-error' as const;
                });

                if (result === 'reset' || result === 'token-not-found') replacePath(null);
                else replacePath(token);

                if (result === 'reset' || result === 'not-voting') {
                    useTimeoutFn(() => {
                        votingDisabled.value = true;
                    }, 750);
                    return null;
                }

                votingDisabled.value = false;
                if (result === 'token-not-found') return 'token-not-found';
                if (result === 'other-error') return 'other-error';
                if (result === 'token-used') return 'token-used';

                useTimeoutFn(() => {
                    systemInfo.value = result;
                }, 750);
                return null;
            },
            onSuccess: () => {
                replacePath(null);
                initialToken.value = null;
                initialLoadingError.value = null;
                systemInfo.value = null;
            },
        }
    },
});
</script>
