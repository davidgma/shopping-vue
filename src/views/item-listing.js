import { ref } from 'vue';

export const ItemListing = {
    template: `
    <section :class="{gray: isGray}" @click="toggleGray">{{ item.itemName }}</section>
    
    `,
  
    props: {
      item: Object
    },
  
    setup() {
      const isGray = ref(false);
  
      function toggleGray() {
        isGray.value = !isGray.value
      }
  
      return {
        isGray,
        toggleGray
      }
    }
  
    
  }