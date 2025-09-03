

// old template in addresses-view.js with ability to set client id etc
const AddressesView = {
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
          <label>API key</label>
          <input v-model="state.APIkey" type="text" :placeholder="APIkey" class="form-control" id="APIkey" name="APIkey">
      </div>
  
      <div class="form-group">
          <label>Range for testing e.g. Sheet1!A1:C</label>
          <input v-model="state.range" type="text" :placeholder="range" class="form-control" id="range" name="range">
      </div>
  
  </form>
  
  
  <setup-view />
    `,
  
    setup() {
  
      //<button @click="refreshToken" type="button">Refresh token</button>
      // console.log("Under useStorage:");
      // console.log(localStorage.getItem('local'));
      // console.log("spreadsheetId: " + state.value.spreadsheetId);
      // console.log("clientId: " + state.value.clientId);
      // console.log("APIkey: " + state.value.APIkey);
      // console.log("range:" + state.value.range);
      // console.log("token:" + state.value.token);
      // console.log("version:" + state.value.version);
  
      function refreshToken() {
        console.log("refreshing token");
        promptForToken();
      }
  
      return {
        state, refreshToken
  
      };
    }
  
  }