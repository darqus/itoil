// import Theme from './theme';

class arm1C {
  constructor({ isDark, }) {
    this.isDark = isDark;
  }

  install(Vue) {
    Vue.config.globalProperties.$arm1C = this;
    Vue.provide('$arm1C', this);

    this.production = process.env.NODE_ENV === 'production';
    Vue.config.globalProperties.$production = this.production;
    Vue.config.globalProperties.$debug = __DEBUG__;
    Vue.provide('$production', this.production);

    let vm = this;

    // const console = (function () {
    //   return {
    //     log: (text) => {
    //       vm.SendData('console.log', text);
    //     },
    //     info: (text) => {
    //       vm.SendData('console.info', text);
    //     },
    //     warn: (text) => {
    //       vm.SendData('console.warn', text);
    //     },
    //     error: (text) => {
    //       vm.SendData('console.error', text);
    //     },
    //   };
    // })(window.console);
    if (this.production) {
      this.SendData.MainEvent = new Event('click');
      // window.console = console;
    }
  }

  SendData(event, data) {
    if (!this.production) {return}
    this.SendData.MainEvent.detail = JSON.stringify([ event, data, ]);
    dispatchEvent(this.SendData.MainEvent);

    return null;
  }
}

export { arm1C as default, /*, Theme*/ };
