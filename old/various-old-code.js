

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
      // console.log("authenticationToken:" + state.value.authenticationToken);
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
  if (state.value.authenticationToken === "") {
    setupResults.value.push("No JWT token is available - fill in the above details then click 'Sign in' to get one.");
    // promptForToken();

  }
  else {
    // There is already a JWT token
    const responsePayload = decodeJwtResponse(state.value.authenticationToken);
    // console.log(responsePayload);
    setupResults.value.push("A token is already available.");
    setupResults.value.push("Decoded JWT ID token: ");
    setupResults.value = setupResults.value.concat(formatJWT(responsePayload));

    // Check it hasn't expired
    const expiry = new Date(responsePayload.exp * 1000);
    if (expiry < new Date()) {
      setupResults.value.push("Token has expired, request another");
      state.value.authenticationToken = "";
      // promptForToken();
    }
    else { // Theres's a valid token - try getting the test cells


    }

  }

  // If the access token is valid, a read will be possible
export async function isAccessTokenValid() {
  let response;
  try {
      response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: state.value.spreadsheetId,
          range: "A1",
      });
  } catch (err) {
      setupResults.value.push("Error retrieving spreadsheet data: " + err.result.error.message);
      return false;
  }
  return true;
}


// this returned false even though the session was valid
gapi.auth.checkSessionState({client_id: "285838277656-epg5b87qpis468k0r6crifeiq8m68djf.apps.googleusercontent.com"}, (result) => {console.log(result)});


let alreadyLoaded = true; // if true then the gapi client was already loaded yet the spreadsheet is unreadable. The most likely explanation is that a previous access_token has expired and needs to be cleaned out.

if (gapi.client === undefined) {
  // This sets up the gapi client for readonly access using the API key
  console.log("Calling gapiLoadClient");
  await gapiLoadClient(); 
  alreadyLoaded = false;
}
if (gapi.client.sheets === undefined) {
  console.log("calling initializeGapiClient");
  await initializeGapiClient();
  console.log("finished calling initializeGapiClient");
  alreadyLoaded = false;
}
// If alreadyLoaded is still true by this stage then the access_token has probably expired and needs to be set to null
if (alreadyLoaded) {
  gapi.auth.setToken(null);
}


if (! await canWrite()) {
  return new Promise(async (resolve, reject) => {
    tokenClient.requestAccessToken({ prompt: '' });
    // tokenClient.requestAccessToken();
    // This doesn't return anything, but calls the callback defined in google.accounts.oauth2.initTokenClient() call
    tokenClient.requestAccessToken();
    // Wait for the resolve from the callback from the authorisation routine
    accessPromise = { resolve, reject }
  });
}

// One-off check that there isn't an old expired state.value.accessToken
const canWriteActual = await canWrite();
if (!canWriteActual && state.value.accessToken !== null) {
  state.value.accessToken = null;
}

// Estimates quickly whether it is likely that writing is allowed
export function canWriteProxy() {
  return (canReadProxy
    && (state.value.accessToken !== null));
}
{/* <button class="addresses-button"  @click="setUpReadAccess();">Set Up Read Access</button> */}

<div id="google"></div>
initGoogleSignIn();

// Initialise the google sign in button 
function initGoogleSignIn() {
  console.log("About to call google.accounts.id.initialize to initialize the Google Sign In button.");
  google.accounts.id.initialize({
    auto_select: true,
    client_id: state.value.clientId,
    callback: handleCredentialResponse,
    prompt_parent_id: 'google'
  });

  google.accounts.id.renderButton(
    document.getElementById("google"),
    { theme: "outline", size: "large" }  // customization attributes
  );
}

function handleCredentialResponse(response) {
  // console.log("In handleCredentialResponse");
  // setupResults.value.push("In handleCredentialResponse");

  // credentialResponse = response.credential;
  state.value.authenticationToken = response.credential;
  // setupResults.value.push("Encoded JWT ID token: " + response.credential);

  const responsePayload = decodeJwtResponse(response.credential);
  // setupResults.value.push("Decoded JWT ID token: ");
  // setupResults.value = setupResults.value.concat(formatJWT(responsePayload));
  tokenClient.requestAccessToken();
}
// **************************
// Google sign-in button. This could be used instead of authorise.
// *****************************

window.onload = function () {
 
  
}


{/* <button class="addresses-button" @click="tokenClient.requestAccessToken();">Authorize me (make auto or remove?)</button> */}

function decodeJwtResponse(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function formatJWT(token) {
  const a = new Array();
  a.push("ID: " + token.sub);
  a.push('Full Name: ' + token.name);
  a.push('Given Name: ' + token.given_name);
  a.push('Family Name: ' + token.family_name);
  a.push("Image URL: " + token.picture);
  a.push("Email: " + token.email);
  a.push("Client ID: " + token.aud);
  a.push("Google account ID: " + token.sub);
  a.push("Creation time: " + new Date(token.iat * 1000).toString());
  a.push("Expiration time: " + new Date(token.exp * 1000).toString());
  return a;
}

if (! await canWrite()) {
  // console.log("in setUpWrite")
  // This sets up, but doesn't call, the readwrite authorisation and the access token using the client id and API key. 
  await getTokenClient();

  // First try re-using an existing access token in case it's still valid.
  // Only valid tokens should be held
  if (state.value.accessToken !== null) {
    console.log("Reusing existing access token...");
    gapi.client.setToken({ access_token: state.value.accessToken });
  }

  // Retest as the existing token might be bad
  if (! await canWrite()) {
    return new Promise(async (resolve, reject) => {
      tokenClient.requestAccessToken({ prompt: '' });
      // tokenClient.requestAccessToken();
      // This doesn't return anything, but calls the callback defined in google.accounts.oauth2.initTokenClient() call
      tokenClient.requestAccessToken();
      // Wait for the resolve from the callback from the authorisation routine
      accessPromise = { resolve, reject }
    });
  }
}
else {
  console.log("Already have write access.");

}

// First try re-using an existing access token in case it's still valid.
      // Only valid tokens should be held
      if (state.value.accessToken !== null) {
        console.log("Reusing existing access token...");
        gapi.client.setToken({ access_token: state.value.accessToken });
      }
