import { ref } from 'vue';

export const setupResults = ref(["No results as yet"]);

export const SetupView = {
    template: `
    <li class="setup-results" v-for="item in setupResults">
        {{ item }}
    </li>
 
  
  `,

    setup() {

        return {
            setupResults

        };
    }
}