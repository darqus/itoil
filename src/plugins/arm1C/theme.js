import { computed, inject, } from 'vue';

export default function () {
  const arm1C = inject('$arm1C');

  const armTextColor = computed(() => (arm1C.isDark ? '#ffffffb2' : '#000'));

  return { armTextColor, };
}
