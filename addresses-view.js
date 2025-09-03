// import { ref } from 'vue';
import { useStorage } from 'vueuse';
import { promptForToken } from './setup-loading.js';

const theDefault = {
  spreadsheetId: "1YZWmLktxzprYWLZDHopC0vsz_Z44eavyHyo0lgWsSj4",
  clientId: "285838277656-epg5b87qpis468k0r6crifeiq8m68djf.apps.googleusercontent.com",
  APIkey: "AIzaSyBYAKEDgQCyvtwbUk0Gws7obBycBCva99E",
  range: "list",
  token: "",
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


<setup-view />
  `,

  setup() {

    return {
      state

    };
  }

}