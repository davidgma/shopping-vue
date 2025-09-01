// import { ref } from 'vue';
import { useStorage } from 'vueuse';
import { promptForToken } from './setup-loading.js';

const theDefault = {
  spreadsheetId: "spreadsheet id",
  clientId: "client id",
  range: "List!A2:C",
  token: "none",
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
		<label>Client Id</label>
		<input v-model="state.clientId" type="text" :placeholder="clientId" class="form-control" id="clientId" name="clientId">
	</div>

	<div class="form-group">
		<label>Range for testing e.g. Sheet1!A1:C</label>
		<input v-model="state.range" type="text" :placeholder="range" class="form-control" id="range" name="range">
	</div>

</form>

<button @click="refreshToken" type="button">Refresh token</button>
<setup-view />
  `,

  setup() {

    console.log("Under useStorage:");
    console.log(localStorage.getItem('local'));
    console.log("spreadsheetId: " + state.value.spreadsheetId);
    console.log("clientId: " + state.value.clientId);
    console.log("range:" + state.value.range);
    console.log("token:" + state.value.token);
    console.log("version:" + state.value.version);


    function handleCredentialResponse() {
      console.log("in handleCredentialResponse");
    }

    function refreshToken() {
      console.log("refreshing token");
      promptForToken();
    }

    return {
      state, refreshToken

    };
  }

}