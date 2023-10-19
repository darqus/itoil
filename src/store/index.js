import pump from './modules/pump.js';
import oil from './modules/oil.js';
import tank from './modules/tank.js';

import { createStore, } from 'vuex';

const store = createStore({
  modules: {
    pump,
    oil,
    tank,
  },
});

export default store;
