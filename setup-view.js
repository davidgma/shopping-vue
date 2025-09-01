import { ref } from 'vue';

export const SetupView = {
    template: `
 
  <p class="setupview">{{ setupResults}}</p>
  `,

  setup() {

    const setupResults = ref("No results as yet");



    return {
        setupResults

    };
  }
}