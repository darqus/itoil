<template>
  <pump-row>
    <arm-text class="mr-auto">
      Заказ
    </arm-text>
    <arm-text
      :class="warnOrder"
      v-text="order"
    />
  </pump-row>
  <pump-row class="justify-end pb-1">
    <arm-text
      class="payment"
      v-text="payment"
    />
  </pump-row>
  <hr class="pb-1" />
  <pump-row>
    <arm-text class="mr-auto">
      Сумма
    </arm-text>
    <arm-text v-text="costSupply" />
  </pump-row>
  <pump-row class="flex-grow">
    <arm-text class="mr-auto">
      Литры
    </arm-text>
    <arm-text v-text="supply" />
  </pump-row>
  <span
    v-if="stop_operator"
    class="svg_icon svg_icon_status"
  ><svg-stop-operator class="h-11 w-11" /></span>
  <span
    v-else-if="block_system && !complete"
    class="svg_icon svg_icon_status"
  ><svg-block-system class="h-11 w-11" /></span>

  <div
    class="-ml-2 -mr-1"
    style="display: flex"
  >
    <progress-linear
      v-model="filled_pt"
      height="25px"
      :color="oilColor"
      class="flex-grow"
    >
      <span
        v-if="overflow"
        class="svg_icon"
      ><svg-overflow class="h-6 w-6" /></span>
      <template v-else-if="complete">
        <strong class="text-xl">&#10004;</strong>
      </template>
    </progress-linear>
    <div
      v-if="isYandex"
      class="svg_icon w-auto ml-px mb-px"
    >
      <svg-yandex
        height="25px"
        width="25px"
      />
    </div>
    <div
      v-if="isBenzuber"
      class="svg_icon w-auto ml-px mb-px"
    >
      <svg-benzuber
        height="25px"
        width="25px"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, } from 'vue';

import progressLinear from '@/components/ProgressLinear.vue';
import pumpRow from '@/components/PumpRow.vue';
import armText from '@/components/Text.vue';
import pumpState from '@/mixins/pump.js';
import oilState from '@/mixins/oil.js';

export default {
  components: {
    progressLinear,
    armText,
    pumpRow,
  },
  mixins: [ pumpState, oilState, ],
  props: {
    pump: {
      type: Object,
      default: {},
    },
    oil: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const order = computed(() =>
      props.pump.costOrder > 0
        ? `${(Math.round(props.pump.costOrder * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, })}\u00A0\u20BD`
        : `${(Math.round(props.pump.order * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, })}\u00A0л`
    );
    const costSupply = computed(() => (Math.round(props.pump.costSupply * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, }));
    const supply = computed(() => (Math.round(props.pump.supply * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, }));

    const warnOrderHidden = ref(false);

    return { order, supply, costSupply, warnOrderHidden, };
  },
  created() {
    this.emitter.on('onPumpStop', (state) => {
      this.onPumpStopWorker(state);
    });
  },
  methods: {
    onPumpStopWorker(/*state*/) {
      let blink_speed = 500;
      let delay = this.$store.state.pump.onStopBlinking * 1000;

      if (delay < 1000) {return;}
      if (this.pumpStopedNotComplete) {
        const blink = () => {
          if (!this.pumpStopedNotComplete) {
            this.warnOrderHidden = false;

            return;
          }
          if (!this.warnOrderHidden) {this.warnOrderHidden = true;}
          setTimeout(blink, blink_speed);
        };

        setTimeout(blink, delay);
      }
    },
  },
};
</script>

<style>
</style>>
