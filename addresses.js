import { createApp, ref, reactive, onMounted } from 'vue'

export const AddressesView = {
  template: `
 
  <form @submit.prevent="onSubmit()">
	<div class="form-group">
	
  <label>Spreadsheet ID (the long text between the /d/ and the /edit/ in the address)</label>
		<input type="text" :placeholder="spreadsheetId" class="form-control" id="sheetId"  name="sheetId">
	</div>

  <div class="form-group">
		<label>Client Id</label>
		<input type="text" :placeholder="clientId" class="form-control" id="clientId" name="clientId">
	</div>

	<div class="form-group">
		<label>Range for testing e.g. Sheet1!A1:C</label>
		<input type="text" :placeholder="range" class="form-control" id="range" name="range">
	</div>

	<button type="submit" class="btn btn-success addresses-button">Submit</button>

</form>
  `,

  setup() {

    const spreadsheetId = ref("spreadsheet id");
    const clientId = ref("client id");
    const range = ref("List!A2:C");

    function onSubmit() {
      console.log("onSubmit clicked")
    }

    return {
      onSubmit, spreadsheetId, clientId, range
      
    };
  }

}