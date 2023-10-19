<template>
  <div v-if="pumps.length === 0">
    <progress-linear />
    <arm-text class="px-4 py-4">
      Подключение к серверу оборудования...
    </arm-text>
  </div>
  <div
    v-else
    class="grid grid-flow-col"
    :class="[pumpsState.justify]"
    :style="{ '--pump-height': pumpsState.height, '--pump-width': pumpsState.width }"
  >
    <Pump
      v-for="pump in pumps.slice(0, pumpsState.count)"
      :key="pump.id"
      :pump="pump"
      :class="{ active: pumpSelected && pumpSelected === pump.id }"
      @click="pumpOnSelect(pump.id)"
    />
  </div>

  <my-manage
    v-if="$debug"
    :pump-id="pumpSelected"
  />
</template>

<script>
import { onBeforeMount, onBeforeUnmount, inject, ref, computed, } from 'vue';
import { useStore, } from 'vuex';

import progressLinear from '@/components/ProgressLinear.vue';
import armText from '@/components/Text.vue';
import Pump from '@/components/Pump.vue';

export default {
  components: {
    progressLinear,
    armText,
    Pump,
  },
  setup() {
    const emitter = inject('emitter');
    const arm1C = inject('$arm1C');

    const store = useStore();
    const pumps = ref([]);
    const pumpSelected = ref(null);
    let pumpActive = null;

    const isSelfService = computed(() => store.getters.isSelfService());
    const count = ref(8);
    const pumpsState = computed(() => {
      const width = Math.max(1, Math.round(window.innerWidth / count.value));

      return {
        count: count.value,
        grid: `grid-cols-${count.value}`,
        justify: isSelfService.value ? 'place-content-center' : 'place-content-start',
        width: `${width}px`,
        height: Math.min(width, window.innerHeight) + 'px',
      };
    });

    onBeforeMount(() => {
      emitter.on('onGetConfig', () => {
        pumps.value = store.getters.getPumps();
      });

      emitter.on('unselect', () => {
        pumpSelected.value = null;
        pumpActive = null;
      });

      window.addEventListener('resize', handleResize);
      handleResize();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    const handleResize = () => {
      count.value = window.innerWidth < 1024 ? 6 : window.innerWidth < 1280 ? 7 : 8;
    };

    const pumpOnSelect = (id) => {
      if (!isSelfService.value) {pumpSelected.value = pumpSelected.value && pumpSelected.value === id ? null : id;}
      pumpActive = pumpActive && pumpActive === id ? null : id;

      let data_to1C = null;

      if (pumpActive && pumpActive === id) {
        data_to1C = Object.assign({}, store.getters.getPump(id));
        data_to1C['pistol'] = data_to1C['pistol'].toString();
        data_to1C['oil'] = [];
        data_to1C?.pistols.forEach((pistol) => {
          let oil = store.getters.getOil(pistol?.oil);

          data_to1C['oil'].push({
            id: pistol?.id,
            price: oil?.price,
            name: oil?.name,
            color: oil?.color,
          });
        });
      }
      arm1C.SendData('PumpSelect', data_to1C);
    };

    return { pumps, pumpsState, pumpSelected, pumpOnSelect, };
  },
};
</script>
<style>
.pump {
  background-color: var(--pump-color);
  padding: 2px 5px 0px 6px;
  height: var(--pump-height);
  width: var(--pump-width);
  border: 1px solid var(--bg-color);
  border-radius: 3px;
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.pump > div:last-child {
  flex-grow: 1;
}
.pump.active {
  background-color: var(--pump-active-color);
}
.pump.disabled {
  pointer-events: none;
  background-color: var(--pump-disabled-color);
}
.pump span.pump-warn {
  color: #fc5a45;
  font-weight: 600;
}
.pump.disabled::before {
  content: "";
  left: 0px;
  top: 0px;
  position: absolute;
  height: 100%;
  width: 100%;
  border: 2px solid var(--pump-color);
}
.pump-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  /* justify-content: center; */
}
.svg_icon {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  fill: var(--text-color);
}
.svg_icon_status {
  position: absolute !important;
  bottom: 10px !important;
  z-index: 2 !important;
}
.pump > span.svg_icon {
  position: absolute;
  height: 100%;
  left: 0px;
}
.disabled .svg_icon {
  opacity: 0.4;
}
.pump.active .svg_icon {
  fill: var(--pump-color);
}
span.payment {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.pump-warn.blinking {
  animation: blink 0.8s steps(5, start) infinite;
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}
@media (max-height: 160px) {
  html {
    font-size: 14px;
  }
  .pump-row {
    margin-top: -1px;
    margin-bottom: -1px;
  }
}
@media (max-height: 140px) {
  html {
    font-size: 12px;
  }
  .pump-row {
    margin-top: -2px;
    margin-bottom: -2px;
  }
}
</style>
