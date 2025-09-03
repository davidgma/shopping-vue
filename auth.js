import { state } from './addresses-view.js';
import { setupResults } from './setup-view.js';
import { isAccessTokenValid, getAllListItems } from './sheets.js';



// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// *******************
// Run when the gapi and gis scripts have loaded
// *******************
Promise.all(promises).then(async () => {
  console.log("gis and gapi loaded");

  await getTokenClient();
  // console.log("tokenClient: ");
  // console.log(tokenClient);

  console.log("calling gapiLoadClient");
  await gapiLoadClient();

  // Initialises the gapi client with the api key. This works for reading but not writing.
  console.log("calling initializeGapiClient");
  await initializeGapiClient();
  console.log("finished calling initializeGapiClient");

  console.log("access_token:");
  console.log(state.value.accessToken);
  console.log("gapi.client.getToken()");
  console.log(gapi.client.getToken());

  gapi.client.setToken({ access_token: state.value.accessToken });
  if (! await isAccessTokenValid()) {
    // tokenClient.requestAccessToken({ prompt: '' });
    tokenClient.requestAccessToken();
  }
  // tokenClient.requestAccessToken({ prompt: '' });

  getAllListItems();

});
// *******************


async function getTokenClient() {
  console.log("In getTokenClient");
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: state.value.clientId,
    scope: SCOPES,
    callback: gotToken // defined later
  });
}

async function gotToken(tokenResponse) {
  console.log("in gotToken");
  if (tokenResponse && tokenResponse.access_token) {
    state.value.accessToken = tokenResponse.access_token;
    gapi.client.setApiKey(state.value.APIkey);
    gapi.client.load(DISCOVERY_DOC);
  }

}

async function gapiLoadClient() {
  return new Promise((resolve) => {
    gapi.load("client", () => {
      resolve();
    },
      (error) => {
        console.log("Error loading client: "
          + JSON.stringify(error));
      });
  });
}


// this works for reading spreadsheet data
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: state.value.APIkey,
    discoveryDocs: [DISCOVERY_DOC]
  });
}





let credentialResponse = null; // credential response

function handleCredentialResponse(response) {
  console.log("In handleCredentialResponse");
  setupResults.value.push("In handleCredentialResponse");

  credentialResponse = response.credential;
  state.value.token = response.credential;
  // setupResults.value.push("Encoded JWT ID token: " + response.credential);

  const responsePayload = decodeJwtResponse(response.credential);
  setupResults.value.push("Decoded JWT ID token: ");
  setupResults.value = setupResults.value.concat(formatJWT(responsePayload));
  tokenClient.requestAccessToken();
}
window.onload = function () {
  console.log("prompting for a token");
  promptForToken();
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

}

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

// Show the google sign in button 
export function promptForToken() {
  console.log("About to call google.accounts.id.initialize");
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