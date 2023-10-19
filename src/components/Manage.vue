<template>
  <div
    v-if="pumpId"
    class="flex flex-col p-3"
  >
    <div class="mb-2">
      <button @click="unSelect">
        unSelect
      </button>
    </div>

    <div class="grid grid-cols-6 gap-4">
      <select
        :value="oil"
        class="mb-2"
        style="background: rgba(255, 255, 255, 0.08); color: white"
        @change="oil_onchange"
      >
        <option
          v-for="option in oils"
          :key="option"
          style="background: var(--bg-color); color: var(--text-color)"
        >
          {{ option }}
        </option>
      </select>
      <v-input
        v-model="pump.pistol"
        type="number"
        label="Pistol"
      />
      <v-input
        v-model="pump.costOrder"
        type="number"
        label="Заказ рубли"
      />
      <v-input
        v-model="pump.costSupply"
        type="number"
        label="Налито рубли"
      />
      <v-input
        v-model="Owner"
        type="number"
        label="Owner"
      />
    </div>
    <div class="grid grid-cols-6 gap-4">
      <v-input
        v-model="State"
        type="number"
        label="State"
      />
      <v-input
        v-model="pump.raise"
        type="number"
        label="Raise"
      />
      <v-input
        v-model="pump.order"
        type="number"
        label="Заказ литры"
      />
      <v-input
        v-model="pump.supply"
        type="number"
        label="Налито литры"
      />
      <v-input
        v-model="Initiator"
        type="number"
        label="Initiator"
      />
    </div>

    <div class="grid grid-cols-6 gap-4">
      <v-input
        v-model="Payment"
        type="text"
        label="Payment"
      />
    </div>
    <!-- <select :items="oils" v-model="oil" label="Топливо" filled @change="oil_onchange" /> -->
  </div>
</template>

<script>
import { useStore, } from 'vuex';
import { computed, ref, watch, } from 'vue';

import json_data from '../../assets/config3.json';
import vInput from '@/components/Input.vue';

export default {
  components: {
    vInput,
  },
  props: {
    pumpId: String,
  },
  setup(props) {
    const store = useStore();
    const oils = ref([]);

    const pump = computed(() => (props.pumpId != null ? store.getters.getPump(props.pumpId) : null));
    const pistol = computed(() => {
      let _pump = pump.value;

      if (_pump === null) {return;}

      let pistol = _pump.raise > 0 ? _pump.raise.toString() : _pump.pistol;

      return _pump.pistols.find((item) => item.id === pistol);
    });
    const oil = computed(() => pistol.value?.oil);
    const price = computed(() => store.getters.getOil(oil.value).price);

    watch(
      () => pump,
      (pump) => {
        oils.value.splice(0, oils.value.length);
        pump.value?.pistols?.forEach((item) => {
          oils.value.push(item.oil);
        });
      },
      { deep: true, immediate: true, }
    );

    return {
      pump,
      oil,
      oils,
      price,
      pistol,
    };
  },
  computed: {
    State: {
      get() {
        return this.pump.state;
      },
      set(value) {
        let pumpState = { ...this.pump, };

        pumpState.state = value;
        this.$store.commit('PUMP_STATE', pumpState);
      },
    },
    Owner: {
      get() {
        return this.pump.owner;
      },
      set(value) {
        let pumpState = { ...this.pump, };

        pumpState.owner = value.toString();
        this.$store.commit('PUMP_STATE', pumpState);
      },
    },
    Initiator: {
      get() {
        return this.pump.initiator;
      },
      set(value) {
        let pumpState = { ...this.pump, };

        pumpState.initiator = value.toString();
        this.$store.commit('PUMP_STATE', pumpState);
      },
    },
    Payment: {
      get() {
        return this.pump.payment;
      },
      set(value) {
        this.$store.commit('PUMP_PAYMENT', [ this.pumpId, value, ]);
      },
    },
  },
  mounted() {
    this.$root.onGetConfig(JSON.stringify(json_data.general), JSON.stringify(json_data.pumps), JSON.stringify(json_data.oil), JSON.stringify(json_data.tanks));

    setTimeout(() => {
      json_data.pumpState.forEach((pumpState) => {
        this.$root.setPumpState(JSON.stringify(pumpState));
      });
      json_data.tankState.forEach((tankState) => {
        this.$root.setTankState(JSON.stringify(tankState));
      });
      this.$root.setPayment('2', 'Безналичный расчет');
    }, 1000);
  },
  methods: {
    oil_onchange(e) {
      let oil_id = e.target.value;
      let oil = this.$store.getters.getOil(oil_id);
      let pumpState = { ...this.pump, };

      if (pumpState.costOrder > 0 && oil.price > 0) {
        pumpState.order = Math.round((pumpState.costOrder / oil.price) * 100) / 100;
      } else {
        pumpState.costOrder = pumpState.order * oil.price;
      }

      pumpState.pistol = this.pump.pistols.find((item) => item.oil === oil_id).id;
      pumpState.raise = parseInt(pumpState.pistol);
      this.$store.commit('PUMP_STATE', pumpState);
    },
    unSelect() {
      this.$root.unSelect();
    },
  },
};
</script>

<style scoped>
button {
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  font-size: 0.875rem;
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  justify-content: center;
  outline: 0;
  position: relative;
  text-decoration: none;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  -webkit-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  cursor: pointer;
  border-style: none;
  background-color: #3f51b5 !important;
  border-color: #3f51b5 !important;
  color: var(--text-color);
}
button:hover {
  filter: brightness(110%);
}
</style>
