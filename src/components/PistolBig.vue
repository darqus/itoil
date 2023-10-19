<template>
  <div class="items-center justify-center">
    <span class="svg_icon absolute h-full"><svg-pistol
      class="h-12"
      :style="{ fill: color }"
    /></span>
    <arm-text
      class="text-xl relative top-2 font-medium"
      :style="{ color: color, marginLeft: marginOilName }"
      v-text="oil"
    />
  </div>
</template>

<script>
import svgPistol from '@/components/icons/Pistol.vue';
import armText from '@/components/Text.vue';

export default {
  components: {
    svgPistol,
    armText,
  },
  props: {
    color: {
      type: String,
      default: '#000',
    },
    oil: {
      type: String,
      default: '',
    },
  },
  computed: {
    marginOilName() {
      return `${this.oil.length * 10}px`;
    },
  },
};
</script>
