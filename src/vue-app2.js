import { createApp } from 'vue';
import { ItemListing } from './views/item-listing.js';
import { ItemListings } from './views/item-listings.js';

const listApp = createApp();
  
listApp.component('item-listing', ItemListing); 
listApp.component('item-listings', ItemListings); 
// listApp.component('counter-view', CounterView);
listApp.mount('#mainapp');
