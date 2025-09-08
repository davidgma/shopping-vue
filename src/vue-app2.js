import { createApp } from 'vue';
import { ItemListing } from './views/item-listing.js';
import { ItemListings } from './views/item-listings.js';
import { CookieView } from './views/cookies-view.js';

const listApp = createApp();
  
listApp.component('item-listing', ItemListing); 
listApp.component('item-listings', ItemListings); 
listApp.component('cookie-view', CookieView); 
// listApp.component('counter-view', CounterView);
listApp.mount('#mainapp');
