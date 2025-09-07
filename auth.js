import { state } from './addresses-view.js';
import { canWrite, getAllListItems } from './sheets.js';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// This is needed to wait for the access token callback
let accessPromise;

// let credentialResponse = null; // credential response

// *******************
// Run when the gapi and gis scripts have loaded
// *******************
Promise.all(promises).then(async () => {
  console.log("gis, gapi, vue and window loaded");

  // This is always needed
  setUpRead().then(() => {
    // temp
    // console.log("calling getAllListItems:")
    // getAllListItems();
  });



});
// *******************



// Estimates quickly whether it is likely that reading is allowed
export function canReadProxy() {
  return ((gapi.client !== undefined)
    && (gapi.client.sheets !== undefined));
}

// Estimates quickly whether it is likely that writing is allowed
export function canWriteProxy() {
  return (canReadProxy
    && (state.value.accessToken !== null));
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
    if (!canReadProxy()) {
      // This sets up the gapi client for readonly access using the API key
      // console.log("Calling gapiLoadClient");
      await gapiLoadClient();
      // console.log("calling initializeGapiClient");
      await initializeGapiClient();

      // This sets up, but doesn't call, the readwrite authorisation and the access token using the client id and API key. It's really for the readwrite but it's better doing it here because it only needs to be called once per initial page load.
      await getTokenClient();

      // If there's already an access token, check it hasn't expired
      if (state.value.accessToken !== null) {
        if (state.value.accessTokenExpiry !== null) {
          const expiryDate = new Date(state.value.accessTokenExpiry);
          if (expiryDate <= (new Date())) { // It's expired
            state.value.accessToken = null;
            state.value.accessTokenExpiry = null;
            gapi.client.setToken(null);
          }
          else { // It's going to expire
            prepareTokenExpiry();
            // If there's already an access token, we might as well use it here
            console.log("Reusing existing access token...");
            gapi.client.setToken({ access_token: state.value.accessToken });
          }
        }
      }
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
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: state.value.clientId,
    scope: SCOPES,
    callback: gotToken
  });
}

async function gotToken(tokenResponse) {
  if (tokenResponse && tokenResponse.access_token) {
    state.value.accessToken = tokenResponse.access_token;
    state.value.accessTokenExpiry = (new Date()).valueOf() + (tokenResponse.expires_in * 1000);
    console.log("expiry of new token: " + state.value.accessTokenExpiry.toLocaleString());
    prepareTokenExpiry();
    gapi.client.setApiKey(state.value.APIkey);
    gapi.client.load(DISCOVERY_DOC);
    accessPromise.resolve();
  }
}

function prepareTokenExpiry() {
  // set the accessToken to null when it expires
  const millisecondsToExpiry = state.value.accessTokenExpiry - (new Date()).valueOf();
  setTimeout(() => {
    state.value.accessToken = null;
    state.value.accessTokenExpiry = null;
    gapi.client.setToken(null);
  }, (millisecondsToExpiry));
}

// Set up write access
export async function setUpWrite() {
  await Promise.all(promises).then(async () => {
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
    else {
      console.log("Already have write access.");
    }
  });
}

