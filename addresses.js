const AddressesView = {
  template: `
    <br>
<form @submit="onSubmit()">
	<div class="form-group">
		<label>Spreadsheet ID (the long text between the /d/ and the /edit/ in the address)</label>
		<input type="text" class="form-control" id="sheetId" required  name="sheetId">
	</div>

	<div class="form-group">
		<label>Range e.g. Sheet1!A1:C</label>
		<input type="text" class="form-control" id="range" required name="range">
	</div>

	<button type="submit" class="btn btn-success">Submit</button>

</form>
<br>
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