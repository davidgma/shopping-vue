import { createApp } from 'vue';
import { AddressesView } from './addresses-view.js'
import { SetupView } from './setup-view.js'

const app1 = createApp();
  app1.component('addresses-view', AddressesView);
  app1.component('setup-view', SetupView); 
  app1.mount('#vueapp1');