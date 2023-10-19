import { TANKS_INIT, TANK_STATE, } from '../actions';

const has = Object.prototype.hasOwnProperty;
let deepCopy = (o, i, r) => {
  if (o && typeof o == 'object') {
    r = o instanceof Array ? [] : {};
    for (i in o) {has.call(o, i) ? (r[i] = o[i] === o ? r : deepCopy(o[i])) : 0;}
  }

  return r || o;
};
let setInt = (newvalue) => {
  if (newvalue) {return parseInt(newvalue);}
  else {return 0;}
};
let setFloat = (newvalue) => {
  if (newvalue) {return parseFloat(newvalue);}
  else {return 0;}
};

const state = {
  count: 0,
  tank: Object.freeze({
    id: '',
    FuelCategory: '',
    oil: '',
    MinLevel: 0,
    LimitMinLevel: 0,
    MaxLevel: 0,
    LimitMaxLevel: 0,
    MaxWaterLevel: 0,
    MaxTemperature: 0,
    LimitMinPressureTop: 0,
    LimitMaxPressureTop: 0,
    LimitMaxOilVolume: 0,
    SectionsCount: 0,
    Owner: '0',
    State: 0,
    Initiator: 0,
    Err: 0,
    ParamsMask: 0,
    Temperature: 0,
    TotalLevel: 0,
    WaterLevel: 0,
    Quantity: 0,
    Density: 0,
    Volume: 0,
    GasVolume: 0,
    GasDensity: 0,
    PressureBottom: 0,
    PressureTop: 0,
    LiquidQuantity: 0,
    GasQuantity: 0,
    MeasInfo: 0,
    AlarmMask: 0,
    GasTemperature: 0,
    TemperatureExt: 0,
    GasTemperatureExt: 0,
    StateDB: 0,
    VolumeDB: 0,
    DensityDB: 0,
    TemperatureDB: 0,
    TotalLevelDB: 0,
    WaterLevelDB: 0,
    ResidueDB: 0,
    PipelineQuantityDB: 0,
  }),
  tanks: [],
};

const getters = {
  getTanks: (state) => () => {
    return state.tanks;
  },
  getTank: (state) => (id) => {
    return state.tanks.find((tank) => tank.id === id);
  },
};

const actions = {
  [TANKS_INIT]: ({ commit, }, tanks) => {
    commit('emptyTanks');
    tanks.forEach((item) => {
      commit('TANK_ADD', item);
    });
  },
};

const mutations = {
  emptyTanks: (state) => {
    const tanks = state.tanks;

    tanks.splice(0, tanks.length);
    state.count = 0;
  },
  TANK_ADD: (state, item) => {
    let tank = deepCopy(state.tank);

    for (let i in item)
      {if (has.call(item, i) && has.call(tank, i)) {
        let value = item[i];

        tank[i] = Number.isInteger(value) ? setInt(value) : value === +value && !!(value % 1) ? setFloat(value) : value;
      }}
    tank['id'] = item.id;

    state.tanks.push(tank);
    state.count += 1;
  },
  [TANK_STATE](state, item) {
    let tank = state.tanks.find((tank) => tank.id === item.id);

    for (let i in item)
      {if (has.call(item, i) && has.call(tank, i)) {
        let value = item[i];

        tank[i] = Number.isInteger(value) ? setInt(value) : value === +value && !!(value % 1) ? setFloat(value) : value;
      }}
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
