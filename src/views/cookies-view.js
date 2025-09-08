import { state } from './addresses-view.js';
import { getCookies } from '../sheets.js';
import { ref, onMounted} from 'vue';
import { authPromises } from '../auth.js';

export const CookieView = {

    template: `
    <h3>{{ msg }}</h3>
    <article class="container"><button @click="buttonClicked">Change Fortune Cookie</button></article>
    `,

    setup() {

        onMounted(async () => {
            msg.value = await getCookie();
        });

        async function getCookie() {
            if (state.value.cookiesData.length === 0) {
                await Promise.all(authPromises);
                state.value.cookiesData = await getCookies();
            }
            const cookies = state.value.cookiesData;
            const rnd = Math.floor(Math.random() * cookies.length);
            const returnValue = cookies[rnd];
            return cookies[rnd];
        }

        const msg = ref("getting cookie...");

        const buttonClicked = async () => {
            console.log("msg:");
            console.log(msg);
            msg.value = await getCookie();
        };

        return {
            buttonClicked, msg

        };
    }

}