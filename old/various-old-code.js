

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

  // promises.push(new Promise((resolve, reject) => {
//     accountInitPromise = {resolve, reject}
// }));
// function accountInitLoaded() {
//     console.log("google.accounts.id.initialize loaded and called back");
//     accountInitPromise.resolve();
// }

// google.accounts.id.prompt((notification) => {
    //     setupResults.value = [];
    // }); // also display the One Tap dialog

    // console.log("requesting access token");
  //tokenClient.requestAccessToken(); // fails to open popup window

  // <button onclick="tokenClient.requestAccessToken();">Authorize me</button>

  console.log("calling gapiLoadAuth2");
  await gapiLoadAuth2();
  console.log("finished calling gapiLoadAuth2");

  async function gapiLoadAuth2() {
    return new Promise((resolve) => {
      gapi.load("auth2", () => {
        resolve();
      },
        (error) => {
          console.log("Error loading client: "
            + JSON.stringify(error));
        });
    });
  }

  // this doesn't work either
async function initializeGapiAuth2() {
  await gapi.auth2.init({
    client_id: state.value.clientId
  });
}

// async function initTokenClient() {
//   return new Promise((resolve, revoke) => {
//     tokenClient = google.accounts.oauth2.initTokenClient({
//       client_id: state.value.clientId,
//       scope: SCOPES,
//       callback: (response) => {
//         console.log("initTokenClient response: ");
//         console.log(response);
//         resolve(response);
//       },
//     });

//   });
// } 

async function getTestData() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: state.value.spreadsheetId,
      range: state.value.range,
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.log('No values found in spreadsheet.');
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
    (str, row) => `${str}${row[0]}, ${row[4]}\n`);
  console.log(output);
}

 // console.log("calling initializeGapiAuth2");
  // await initializeGapiAuth2();
  // console.log("finished calling initializeGapiAuth2");

  <button onclick="tokenClient.requestAccessToken();">Authorize me</button>



  // console.log("gapi.client.getToken() === null:" + (gapi.client.getToken() === null));
  // if (gapi.client.getToken() === null) {
  //   // Prompt the user to select a Google Account and ask for consent to share their data
  //   // when establishing a new session.
  //   tokenClient.requestAccessToken({ prompt: 'consent' });
  // } else {
  //   // Skip display of account chooser and consent dialog for an existing session.
  //   tokenClient.requestAccessToken({ prompt: '' });
  // }
  // console.log("gapi.client.getToken() === null:" + (gapi.client.getToken() === null));
  // console.log("gapi client initialized.");
  // getTestData();
  // writeTest();

  // Check to see whether there is already a JWT ID token
  if (state.value.token === "") {
    setupResults.value.push("No JWT token is available - fill in the above details then click 'Sign in' to get one.");
    // promptForToken();

  }
  else {
    // There is already a JWT token
    const responsePayload = decodeJwtResponse(state.value.token);
    // console.log(responsePayload);
    setupResults.value.push("A token is already available.");
    setupResults.value.push("Decoded JWT ID token: ");
    setupResults.value = setupResults.value.concat(formatJWT(responsePayload));

    // Check it hasn't expired
    const expiry = new Date(responsePayload.exp * 1000);
    if (expiry < new Date()) {
      setupResults.value.push("Token has expired, request another");
      state.value.token = "";
      // promptForToken();
    }
    else { // Theres's a valid token - try getting the test cells


    }

  }