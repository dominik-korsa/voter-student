<template>
  <div class="stand-of-shame">
    <podium-stand
      label="-1 punkt"
      class="podium-stand--negative"
    >
        Przeciągnij tutaj logo, któremu dajesz <b class="stand-of-shame__negative-text">-1&nbsp;punkt</b>
    </podium-stand>
  </div>
</template>

<script lang="ts" setup>
import PodiumStand from "./PodiumStand.vue";
</script>

<style lang="scss">
.stand-of-shame {
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .stand-of-shame__negative-text {
    color: indianred;
  }
}
</style>
