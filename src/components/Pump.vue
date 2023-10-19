<template>
  <div
    class="pump"
    :class="{ disabled: disabled || (isSelfService && tankDisabled) }"
  >
    <pump-row class="font-medium">
      <arm-text
        class="text-2xl"
        v-text="pump.id"
      />
      <div
        v-if="showInfo && !isSelfService && inTank && pumpStopedComplete"
        class="items-center justify-center mt-1 absolute w-full"
      >
        <span
          class="svg_icon h-full"
          :class="warnPistol"
        >
          <svg-pistol
            class="h-6"
            :style="{ fill: warnPistolHidden ? '#e94444' : oilColor }"
          />
          <svg-warning
            v-show="warnPistolHidden"
            class="h-4 absolute"
            style="margin-top: 0.5rem; margin-left: 0.7rem"
          />
        </span>
      </div>
      <arm-text
        v-show="showInfo || (isRaise && isSelfService)"
        class="text-xl ml-auto"
        :color="oilColor"
        v-text="oilName"
      />
    </pump-row>
    <pump-row
      v-if="isSelfService && (disabled || tankDisabled)"
      class="absolute left-0 h-full items-center"
    >
      <arm-text
        class="font-medium text-center text-xl"
        v-text="disabledText"
      />
    </pump-row>
    <span
      v-else-if="!isSelfService && disabled"
      class="svg_icon"
    ><svg-disabled
      class="h-11 w-11"
      style="fill: red"
    /></span>
    <pistolBig
      v-else-if="showInfo && isSelfService"
      class="pump-row absolute left-0 h-full"
      :oil="oilName"
      :color="oilColor"
    />
    <pump-row
      v-else-if="showInfo && !isSelfService"
      class="flex-col"
    >
      <process-info
        :pump="pump"
        :oil="oil"
      />
    </pump-row>
    <pistolBig
      v-else-if="!showInfo && isRaise"
      class="pump-row absolute left-0 h-full"
      :oil="oilName"
      :color="oilColor"
    />
    <span
      v-else-if="!showInfo && block_operator"
      class="svg_icon"
    ><svg-block-operator class="h-11 w-11" /></span>
    <span
      v-else-if="!showInfo && stop_operator"
      class="svg_icon"
    ><svg-stop-operator class="w-11 h-11" /></span>
    <span
      v-else-if="!showInfo && block_system"
      class="svg_icon"
    ><svg-block-system class="h-11 w-11" /></span>
    <pump-row v-else />
  </div>
</template>

<script>
import { ref, watch, } from 'vue';
import { useStore, } from 'vuex';

import processInfo from '@/components/ProcessInfo.vue';
import pumpRow from '@/components/PumpRow.vue';
import armText from '@/components/Text.vue';
import pumpState from '@/mixins/pump.js';
import oilState from '@/mixins/oil.js';
import pistolBig from '@/components/PistolBig.vue';

export default {
  components: {
    armText,
    processInfo,
    pumpRow,
    pistolBig,
  },
  mixins: [ pumpState, oilState, ],
  props: {
    pump: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const store = useStore();
    const oil = ref({});
    const disabledText = 'Недоступна для заказа';

    const setOil = (pump) => {
      let pistol = undefined;

      if (pump.pistol > 0 || pump.raise > 0) {
        const id_pistol = (pump.raise > 0 ? pump.raise : pump.pistol).toString();

        pistol = pump.pistols.find((item) => item.id === id_pistol);
      }
      oil.value = pistol ? store.getters.getOil(pistol.oil) : undefined;
    };
    const warnPistolHidden = ref(false);

    watch(
      () => props.pump,
      (pump) => {
        setOil(pump);
      },
      { deep: true, immediate: true, }
    );

    return { oil, disabledText, warnPistolHidden, };
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
      if (this.pumpStopedComplete) {
        const blink = () => {
          if (!this.pumpStopedComplete) {
            this.warnPistolHidden = false;

            return;
          }
          if (!this.warnPistolHidden) {this.warnPistolHidden = true;}
          setTimeout(blink, blink_speed);
        };

        setTimeout(blink, delay);
      }
    },
  },
};
</script>
