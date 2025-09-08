import { onMounted } from 'vue';
import { useStorage } from 'vueuse';
import { setupResults } from '../setup-view.js';
import { canRead, canWrite, getAllListItems, incrementTest } from '../sheets.js';
import { setUpWrite, canReadProxy, canWriteProxy, authPromises } from '../auth.js';


const theDefault = {
  spreadsheetId: "1YZWmLktxzprYWLZDHopC0vsz_Z44eavyHyo0lgWsSj4",
  clientId: "285838277656-epg5b87qpis468k0r6crifeiq8m68djf.apps.googleusercontent.com",
  APIkey: "AIzaSyBYAKEDgQCyvtwbUk0Gws7obBycBCva99E",
  listRange: "list",
  cookiesRange: "cookies",
  authenticationToken: "",
  accessToken: "",
  accessTokenExpiry: null, // number of seconds since 1970, when token expires
  version: 1,
  listData: "",
  cookiesData: ""
}

export const state = useStorage('local', theDefault, localStorage, { mergeDefaults: true });

export const AddressesView = {
  template: `
  

<article class="container">
<button class="addresses-button"  @click="showReadWriteStatus();">Show status</button>
<button class="addresses-button"  @click="setUpWriteAccess();">Set up write access</button>
<button class="addresses-button"  @click="incrementTest();">Increment test</button>
<button class="addresses-button"  @click="getItems();">Get the items</button>
</article>


<setup-view />
 <br> 
  <form>
	<div class="form-group">
  <label>Spreadsheet ID (the long text between the /d/ and the /edit/ in the address)</label>
  <input v-model="state.spreadsheetId" type="text" :placeholder="spreadsheetId" class="form-control" id="spreadsheetId"  name="spreadsheetId">
	</div>
</form>

  `,

  setup() {

    onMounted(() => {
      console.log(`the component is now mounted.`);
      vueMountedPromise.resolve();
    });

    async function showReadWriteStatus() {
      await Promise.all(authPromises);
      // setupResults.value.push("ReadWrite status at " + (new Date().toLocaleString()) + " :");
      setupResults.value.push("Can read proxy: " + canReadProxy());
      const canReadResult = await canRead();
      setupResults.value.push("Can read: " + canReadResult);
      setupResults.value.push("Can write proxy: " + canWriteProxy());
      if (canWriteProxy()) {
        setupResults.value.push("Expiry of write access: " + (new Date(state.value.accessTokenExpiry)).toLocaleString());
      }
      const canWriteResult = await canWrite();
      setupResults.value.push("Can write: " + canWriteResult);


    }

    async function setUpWriteAccess() {
      await setUpWrite();
      setupResults.value.push("Write access finished being set up");
    }

    async function getItems() {
      // if (! await canRead()) {
      //   await setUpReadAccess();
      //   console.log("finished setting up read access.");
      // }
      // console.log("calling getAllListItems");
      state.value.listData = await getAllListItems();
      console.log("List items finished being retrieved.");
      // setupResults.value.push("List items finished being retrieved.");
      // setupResults.value.push(state.value.listData);
    }

    return {
      state, showReadWriteStatus, setUpWriteAccess, getItems, incrementTest

    };
  }

}

