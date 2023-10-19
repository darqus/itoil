<template>
  <span
    class="arm_text antialiased"
    :style="textColor"
  >
    <slot />
  </span>
</template>

<script>
import { computed, } from 'vue';
// import { Theme } from '@/plugins/arm1C';

export default {
  props: {
    color: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    // const { armTextColor } = Theme();
    const textColor = computed(() => (props.color ? { color: props.color, } : null));

    return { textColor, };
  },
};
</script>

<style>
.arm_text {
  color: var(--text-color);
}
.active .arm_text {
  color: var(--text-active-color);
}
.disabled .arm_text {
  /* color: var(--text-disabled-color); */
  opacity: 0.4;
}
</style>
