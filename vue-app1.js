import { createApp } from 'vue';
import { AddressesView } from './addresses.js'

const app1 = createApp();
  app1.component('addresses-view', AddressesView); 
  app1.mount('#vueapp1');