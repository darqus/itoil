import { createApp, defineAsyncComponent, } from 'vue';

import mitt from 'mitt';

import store from './store';
import App from './App.vue';
import './index.css';
import arm1C from '@/plugins/arm1C';

const emitter = mitt();
const arm_1c = new arm1C({
  isDark: true,
});

const app = createApp(App);

app.use(store);
app.use(arm_1c);

if (__DEBUG__) {
  const myManage = defineAsyncComponent(() => import('@/components/Manage.vue'));

  app.component('MyManage', myManage);
}

app.provide('emitter', emitter);
app.config.globalProperties.emitter = emitter;

const vm = app.mount('#app');

window.vm = vm;
window.__info = `ARM v ${__APP_VERSION__} (c) voladores@inbox.ru для ПРАКТИКОН`;
