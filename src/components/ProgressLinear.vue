<template>
  <div class="relative progress-linear">
    <div
      class="flex"
      :style="{ height: height, background: bgColor || colorBack }"
      :class="{ rounded: rounded }"
    >
      <div
        class="shadow-none flex flex-col"
        :class="{ indeterminate: modelValue == -1, rounded: rounded }"
        :style="{ width: valuePt, backgroundColor: color }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, } from 'vue';
import { convertToUnit, } from '../utils/helpers';

export default {
  props: {
    modelValue: {
      type: [ Number, String, ],
      default: -1,
    },
    MaxValue: {
      type: [ Number, String, ],
      default: 100,
    },
    color: {
      type: String,
      default: '#388e3c',
    },
    backgroundColor: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: '4px',
    },
    rounded: Boolean,
  },
  setup(props) {
    const bgColorAlfa = '50';
    const normalize = (value) => (value < 0 ? 0 : value > 100 ? 100 : parseFloat(value));

    const valuePt = computed(() => (props.modelValue == -1 ? '100%' : convertToUnit((normalize(props.modelValue) * 100) / normalize(props.MaxValue), '%')));
    const bgColor = computed(() => props.color + bgColorAlfa);

    return { valuePt, bgColor, };
  },
};
</script>
<style>
.progress-linear {
  text-align: center;
  color: #ffffff;
}
.progress-linear .indeterminate {
  animation: indeterminate-progress 1.1s linear infinite;
}
@keyframes indeterminate-progress {
  0% {
    margin-left: 0px;
    margin-right: 100%;
  }
  25% {
    margin-left: 0%;
    margin-right: 50%;
  }
  50% {
    margin-left: 40%;
    margin-right: 0%;
  }
  70% {
    margin-left: 95%;
    margin-right: 0%;
  }
  100% {
    margin-left: 100%;
    margin-right: 0%;
  }
}
</style>
