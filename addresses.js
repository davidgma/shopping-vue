// import { createApp, ref, reactive, onMounted } from 'vue'

export const AddressesView = {
  template: `
 
  <form @submit="onSubmit()">
	<div class="form-group">
	
  <label>Spreadsheet ID (the long text between the /d/ and the /edit/ in the address)</label>
		<input type="text" class="form-control" id="sheetId"  name="sheetId">
	</div>

  <div class="form-group">
		<label>Client Id</label>
		<input type="text" class="form-control" id="clientId" name="clientId">
	</div>

	<div class="form-group">
		<label>Range for testing e.g. Sheet1!A1:C</label>
		<input type="text" class="form-control" id="range" name="range">
	</div>

	<button type="submit" class="btn btn-success addresses-button">Submit</button>

</form>
  `,

  setup() {

    function onSubmit() {
      console.log("onSubmit clicked")
    }

    return {
      onSubmit
      
    };
  }

}