import { ref } from 'vue';
import { useStorage } from 'vueuse';

export const AddressesView = {
  template: `
 
  <form @submit.prevent="onSubmit()">
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

	<button type="submit" class="btn btn-success addresses-button">Submit</button>

</form>
  `,

  setup() {

    // const spreadsheetId = ref("spreadsheet id");
    // const clientId = ref("client id");
    // const range = ref("List!A2:C");
    const theDefault = {
      spreadsheetId: "spreadsheet id",
      clientId: "client id",
      range: "List!A2:C"
    }

    const state = useStorage('vue-use-local-storage', theDefault)

    function onSubmit() {
      console.log("onSubmit clicked")
      console.log("spreadsheet id: " + spreadsheetId.value);
      console.log("clientId: " + clientId.value);
      console.log("range:"  + range.value);
    }

    return {
      onSubmit, state
      
    };
  }

}