<template>
  <span class="loading-dots">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>
</template>

<style lang="scss">
.loading-dots {
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > span {
    letter-spacing: 2px;
    animation: jump infinite 1300ms ease-in-out;
  }

  @keyframes jump {
    0% {
      transform: translateY(0px);
    }
    25% {
      transform: translateY(-6px);
    }
    40% {
      transform: translateY(2px);
    }
    50% {
      transform: translateY(0);
    }
  }

  @for $i from 1 through 3  {
    & > span:nth-child(#{$i}) {
      animation-delay: ($i - 1) * 300ms;
    }
  }
}
</style>
