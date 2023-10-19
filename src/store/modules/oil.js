import { OIL_INIT, } from '../actions';

const state = {
  count: 0,
  oil: Object.freeze({
    id: '',
    color: '',
    name: '',
    price: 0,
  }),
  oils: [],
};

const getters = {
  getOils: (state) => () => {
    return state.oils;
  },
  getOil: (state) => (id) => {
    return state.oils.find((oil) => oil.id === id);
  },
};

const actions = {
  [OIL_INIT]: ({ commit, }, oil) => {
    commit('emptyOils');
    oil.forEach((item) => {
      commit('ADD_OIL', item);
    });
  },
};

const mutations = {
  emptyOils: (state) => {
    const oils = state.oils;

    oils.splice(0, oils.length);
    state.count = 0;
  },
  ADD_OIL: (state, item) => {
    const oil = Object.assign({}, state.oil);

    oil['id'] = item.id ?? '';
    oil['color'] = item.color ?? '';
    oil['name'] = item.name ?? '';
    oil['price'] = item.price ?? 0;
    state.oils.push(oil);
    state.count += 1;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
