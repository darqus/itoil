<template>
  <Pumps />
</template>

<script>
import { PUMP_INIT, PUMP_STATE, PUMP_PAYMENT, OIL_INIT, TANKS_INIT, TANK_STATE, } from '@/store/actions';
import Pumps from '@/view/Pumps.vue';
// import { toRaw } from 'vue';

export default {
  components: {
    Pumps,
  },
  methods: {
    onGetConfig(general, pumps, oil, tanks) {
      const func = (general, pumps, oil, tanks) =>
        new Promise((resolve) => {

          this.$store.dispatch(PUMP_INIT, [ JSON.parse(general), JSON.parse(pumps), ]);
          if (oil) {this.$store.dispatch(OIL_INIT, JSON.parse(oil));}
          if (tanks) {this.$store.dispatch(TANKS_INIT, JSON.parse(tanks));}
          resolve();
        });

      func(general, pumps, oil, tanks).then(this.emitter.emit('onGetConfig')).catch(console.log);
    },
    setPumpState(pump) {
      const func = (data) =>
        new Promise((resolve) => {
          const pumpStates = JSON.parse(data);

          if (Array.isArray(pumpStates)) {
            pumpStates.forEach((pumpState) => {
              this.$store.commit(PUMP_STATE, pumpState);
            });
          } else {
            this.$store.commit(PUMP_STATE, pumpStates);
          }
          resolve();
        });

      func(pump).catch(console.log);
    },
    setTankState(tank) {
      const func = (data) =>
        new Promise((resolve) => {
          const tankStates = JSON.parse(data);

          if (Array.isArray(tankStates)) {
            tankStates.forEach((tankState) => {
              this.$store.commit(TANK_STATE, tankState);
            });
          } else {
            this.$store.commit(TANK_STATE, tankStates);
          }
          resolve();
        });

      func(tank).catch(console.log);
    },
    setPayment(id, payment) {
      const func = (id, payment) =>
        new Promise((resolve) => {
          this.$store.commit(PUMP_PAYMENT, [ id, payment ?? '', ]);
          resolve();
        });

      func(id, payment).catch(console.log);
    },
    unSelect() {
      this.emitter.emit('unselect');
    },
  },
};
</script>

<style>
:root {
  --bg-color: #202c35;
  --pump-color: #445c66;
  --pump-active-color: #f6f6f6;
  --pump-disabled-color: #202c35;
  --text-color: #ffffffb2;
  --text-active-color: #4f6063;
  --text-disabled-color: #465e68;
}
html {
  overflow-y: auto;
}
body {
  background-color: var(--bg-color);
  overflow: hidden;
  height: 100vh;
}

#app {
  background: transparent;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  margin-top: 0px;
}
</style>
