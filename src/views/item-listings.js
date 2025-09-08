import { reactive, onMounted } from 'vue';
import { state } from './addresses-view.js';
import { getAllListItems } from '../sheets.js';
import { authPromises } from '../auth.js';

export const ItemListings = {
    template: `

    <p><cookie-view /></p>

     <p v-if="dataState.isLoading" class="container">Loading...</p>
     <p v-else>
    <h3>Items needed now</h3>
    <article class="container">
    <item-listing v-for="item in dataState.data.filter((item) => item.needed === '1' && item.source === 'supermarket')" :item />
    </article>
    <h3>Items needed soon</h3>
    <article class="container">
    <item-listing v-for="item in dataState.data.filter((item) => item.needed === '2' && item.source === 'supermarket')" :item />
    </article>
    <h3>Items needed weekly</h3>
    <article class="container">
    <item-listing v-for="item in dataState.data.filter((item) => item.needed === '3' && item.source === 'supermarket')" :item />
    </article>
    </p>
    
    `,

    setup() {

        const dataState = reactive({
            data: [],
            isLoading: true
        });

        onMounted(async () => {
            await Promise.all(authPromises);
            const items = await getAllListItems();
            // console.log(state.value.listData);
            dataState.data = items;
            state.value.listData = items;
            dataState.isLoading = false;
        });


        return {
            dataState

        };

    }
}