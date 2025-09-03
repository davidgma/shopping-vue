// import { ref } from 'vue';
import { useStorage } from 'vueuse';

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

<button onclick="tokenClient.requestAccessToken();">Authorize me</button>
<button @click="writeToSheet();">Write to sheet</button>

<setup-view />
  `,

  setup() {

    async function writeToSheet() {
      // tokenClient.requestAccessToken();
      console.log("in writeTest");
      console.log("gapi.client:");
      console.log(gapi.client);
      console.log("gapi.auth2:");
      console.log(gapi.auth2);
      console.log("gapi.client.sheets.spreadsheets.values:");
      console.log(gapi.client.sheets.spreadsheets.values);
      let response;
      try {
        response = await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: "1YZWmLktxzprYWLZDHopC0vsz_Z44eavyHyo0lgWsSj4",
          range: "notes!C2:C2",
          valueInputOption: 'USER_ENTERED',
          resource: { values: [[7]] }
        });
      } catch (err) {
        console.log("err:");
        console.log(err);
        console.log("Error updating spreadsheet data: " + err);
        console.log(err);
        return;
      }
    }

    return {
      state, writeToSheet

    };
  }

}