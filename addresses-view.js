import { ref } from 'vue';
import { useStorage } from 'vueuse';
import { setupResults } from './setup-view.js';
import { canRead, canWrite, getAllListItems, incrementTest } from './sheets.js';
import { setUpRead, setUpWrite } from './auth.js';


const theDefault = {
  spreadsheetId: "1YZWmLktxzprYWLZDHopC0vsz_Z44eavyHyo0lgWsSj4",
  clientId: "285838277656-epg5b87qpis468k0r6crifeiq8m68djf.apps.googleusercontent.com",
  APIkey: "AIzaSyBYAKEDgQCyvtwbUk0Gws7obBycBCva99E",
  range: "list",
  authenticationToken: "",
  accessToken: "",
  version: 1
}

export const state = useStorage('local', theDefault, localStorage, { mergeDefaults: true });

export const AddressesView = {
  template: `

 
  <form>
	<div class="form-group">
  <label>Spreadsheet ID (the long text between the /d/ and the /edit/ in the address)</label>
		<input v-model="state.spreadsheetId" type="text" :placeholder="spreadsheetId" class="form-control" id="spreadsheetId"  name="spreadsheetId">
	</div>

	<div class="form-group">
		<label>Range for testing e.g. Sheet1!A1:C</label>
		<input v-model="state.range" type="text" :placeholder="range" class="form-control" id="range" name="range">
	</div>

</form>

<article class="container">
<button class="addresses-button"  @click="showReadWriteStatus();">Show status</button>
<button class="addresses-button"  @click="setUpReadAccess();">Set Up Read Access</button>
<button class="addresses-button"  @click="setUpWriteAccess();">Set up write access</button>
<button class="addresses-button"  @click="incrementTest();">Write to sheet</button>
<button class="addresses-button"  @click="getItems();">Get the items</button>
<button class="addresses-button" @click="tokenClient.requestAccessToken();">Authorize me (make auto or remove?)</button>
</article>

<setup-view />
  `,

  setup() {


    async function showReadWriteStatus() {
      setupResults.value.push("ReadWrite status:");
      const canReadResult = await canRead();
      setupResults.value.push("Can read: " + canReadResult);

      const canWriteResult = await canWrite();
      setupResults.value.push("Can write: " + canWriteResult);


    }

    async function setUpReadAccess() {
      await setUpRead();
      setupResults.value.push("Read access finished being set up");
    }

    async function setUpWriteAccess() {
      await setUpWrite();
      setupResults.value.push("Write access finished being set up");
    }

    async function getItems() {
      if (! await canRead()) {
        await setUpReadAccess();
        console.log("finished setting up read access.");
      }
      console.log("calling getAllListItems");
      await getAllListItems();
      console.log("List items finished being retrieved.");
      setupResults.value.push("List items finished being retrieved.");
    }

    return {
      state, showReadWriteStatus, setUpReadAccess, setUpWriteAccess, getItems, incrementTest

    };
  }

}

