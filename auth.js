import { state } from './addresses-view.js';
import { canRead, canWrite } from './sheets.js';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// This is needed to wait for the access token callback
let accessPromise;

// *******************
// Run when the gapi and gis scripts have loaded
// *******************
Promise.all(promises).then(async () => {
  console.log("gis and gapi loaded");

  // This is always needed
  setUpRead();
});
// *******************

let credentialResponse = null; // credential response

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

// **************************
// Readonly access via API key
// *****************************

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

// Set up read access
export async function setUpRead() {
  await Promise.all(promises).then(async () => {
    if (! await canRead()) {
      // This sets up the gapi client for readonly access using the API key
      console.log("calling gapiLoadClient");
      await gapiLoadClient();
      console.log("calling initializeGapiClient");
      await initializeGapiClient();
      console.log("finished calling initializeGapiClient");
      // console.log("gapi.client.getToken()");
      // console.log(gapi.client.getToken());
    }
    else {
      console.log("Already have read access.");
    }
  });
}


// **************************
// Readwrite access via client id and API key
// *****************************

// This sets up, but doesn't call, readwrite access
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
    accessPromise.resolve();
  }
}

// Set up write access
export async function setUpWrite() {
  await Promise.all(promises).then(async () => {
    if (! await canWrite()) {

      // This sets up, but doesn't call, the readwrite authorisation and the access token using the client id and API key. 
      await getTokenClient();

      // First try re-using an existing access token in case it's still valid
      // console.log("Trying to reuse existing token...");
      // console.log("state.value.accessToken:");
      // console.log(state.value.accessToken);
      if (state.value.accessToken !== null) {
        console.log("Reusing existing access token...");
        gapi.client.setToken({ access_token: state.value.accessToken });
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



    }
    else {
      console.log("Already have write access.");
    }
  });
}


// **************************
// Google sign-in button. This could be used instead of authorise.
// *****************************

window.onload = function () {
  initGoogleSignIn();
}

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

  credentialResponse = response.credential;
  state.value.authenticationToken = response.credential;
  // setupResults.value.push("Encoded JWT ID token: " + response.credential);

  const responsePayload = decodeJwtResponse(response.credential);
  // setupResults.value.push("Decoded JWT ID token: ");
  // setupResults.value = setupResults.value.concat(formatJWT(responsePayload));
  tokenClient.requestAccessToken();
}