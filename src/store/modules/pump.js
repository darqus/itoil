import { PUMP_INIT, PUMP_STATE, PUMP_PAYMENT, } from '../actions';

const has = Object.prototype.hasOwnProperty;

const state = {
  count: 0,
  operatorID: '',
  onStopBlinking: -1,
  form: '',
  pistol: Object.freeze({
    id: '0',
    oil: '',
    tank: -1,
    oilExp: 0,
    currExp: 0,
    orderMin: 0,
    orderMax: 0,
    orderDiscrete: 0,
    costMin: 0,
    costMax: 0,
    costDiscrete: 0,
    maxCounter: 0,
    locked: 0,
    initiator: '',
    owner: '',
    counter: 0,
    real: 0,
    leak: 0,
    hose: 1,
  }),
  pump: Object.freeze({
    id: '0',
    pistols: [],
    pistol: 0,
    costOrder: 0,
    order: 0,
    costSupply: 0,
    supply: 0,
    err: 0,
    owner: '',
    initiator: '',
    raise: 0,
    state: 0,
    payment: '',
    currExp: 0,
    oilExp: 0,
    autoOrder: 0,
  }),
  pumps: [],
};

const getters = {
  getPumps: (state) => () => {
    return state.pumps;
  },
  getPump: (state) => (id) => {
    return state.pumps.find((pump) => pump.id === id);
  },
  isSelfService: (state) => () => {
    return state.form === 'self-service';
  },
  operatorID: (state) => () => {
    return state.operatorID;
  },
};

const actions = {
  [PUMP_INIT]: ({ commit, }, [ general, pumps, ]) => {
    commit('emptyPumps');
    commit('SET_General', general);
    pumps.forEach((item) => {
      commit('ADD_PUMP', item);
    });
  },
};

const mutations = {
  emptyPumps: (state) => {
    const pumps = state.pumps;

    pumps.splice(0, pumps.length);
    state.count = 0;
  },

  SET_General: (state, setting) => {
    state.operatorID = setting?.id;
    state.form = setting?.form;
    state.onStopBlinking = setting?.onStopBlinking ?? -1;
  },

  ADD_PUMP: (state, item) => {
    const deepCopy = (o, i, r) => {
      if (o && typeof o == 'object') {
        r = o instanceof Array ? [] : {};
        for (i in o) {has.call(o, i) ? (r[i] = o[i] === o ? r : deepCopy(o[i])) : 0;}
      }

      return r || o;
    };
    const pump = deepCopy(state.pump);

    pump['id'] = item.id;
    pump['pistols'] = [];
    item.pistols.forEach((item) => {
      let pistol = deepCopy(state.pistol);

      pump['pistols'].push(pistol);
      for (let key in pistol) {
        pistol[key] = has.call(item, key) ? item[key] : pistol[key];
      }
    });
    state.pumps.push(pump);
    state.count += 1;
  },

  [PUMP_STATE](state, item) {
    const setInt = (newvalue) => {
      if (newvalue) {return parseInt(newvalue);}
      else {return 0;}
    };
    const setFloat = (newvalue) => {
      if (newvalue) {return parseFloat(newvalue);}
      else {return 0;}
    };
    const pump = state.pumps.find((pump) => pump.id === item.id);

    pump.owner = item.owner;
    pump.initiator = item.initiator;

    pump.pistol = setInt(item.pistol);
    pump.order = setFloat(item.order);
    pump.costOrder = setFloat(item.costOrder);
    pump.supply = setFloat(item.supply);
    pump.costSupply = setFloat(item.costSupply);
    pump.raise = setInt(item.raise);
    pump.state = setInt(item.state);
    pump.err = setInt(item.err);
    // pump.tank = setInt(item.tank);
    pump.currExp = setInt(item.currExp);
    pump.oilExp = setInt(item.oilExp);
    pump.autoOrder = setInt(item.autoOrder);

    if (item['pistols']) {
      item['pistols'].forEach((element) => {
        const pistol = pump.pistols.find((pistol) => pistol.id === element.id);

        if (pistol) {
          pistol.initiator = element.initiator;
          pistol.owner = element.owner;
          pistol.locked = setInt(element.locked);
        }
      });
    }
  },
  [PUMP_PAYMENT](state, [ id, payment, ]) {
    const pump = state.pumps.find((pump) => pump.id === id);

    pump.payment = payment;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
