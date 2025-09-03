import { state } from './addresses-view.js';
import { setupResults } from './setup-view.js';

let tokenClient;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';


Promise.all(promises).then(async () => {
  console.log("gis and gapi loaded");

  console.log("calling getTokenClient");
  await getTokenClient();
  console.log("finished calling getTokenClient");
  console.log("tokenClient: ");
  console.log(tokenClient);
  console.log("requesting access token");
  //tokenClient.requestAccessToken(); // fails to open popup window
  console.log("calling gapiLoadClient");
  await gapiLoadClient();
  console.log("calling gapiLoadAuth2");
  await gapiLoadAuth2();
  console.log("finished calling gapiLoadAuth2");

  console.log("calling initializeGapiClient");
  await initializeGapiClient();
  console.log("finished calling initializeGapiClient");
  // console.log("calling initializeGapiAuth2");
  // await initializeGapiAuth2();
  // console.log("finished calling initializeGapiAuth2");
  gapi.client.setToken({access_token: state.value.accessToken}); // this did work
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
  getAllListItems();

});

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

// this works for reading spreadsheet data
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: state.value.APIkey,
    discoveryDocs: [DISCOVERY_DOC]
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

// Get all the items from the shopping list
async function getAllListItems() {
  console.log("in getAllListItems");
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: state.value.spreadsheetId,
      range: state.value.range,
    });
  } catch (err) {
    setupResults.value.push("Error retrieving spreadsheet data: " + err.message);
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    setupResults.value.push('No values found in spreadsheet.');
    return;
  }

  // console.log(range);
  let listItemValues = range.values;
  let listItems = new Array();
  for (let row = 1; row < listItemValues.length; row++) {
    let rowData = listItemValues[row];
    if (rowData.length > 1) {
      let needed = rowData[1];

      let rowNumber = row, itemName = "", source = "",
        typeName = "", brand = "", lastBought = "", notes = "";

      itemName = rowData[0];
      if (rowData.length > 2)
        source = rowData[2];
      if (rowData.length > 3)
        typeName = rowData[3];
      if (rowData.length > 4)
        brand = rowData[4];
      if (rowData.length > 5)
        lastBought = rowData[5];
      if (rowData.length > 6)
        notes = rowData[6];

      let item = new ListItem(rowNumber, itemName, needed, source, typeName, brand, lastBought, notes);
      setupResults.value.push(item.itemName + ", " + item.needed + ", " + item.source);
      listItems.push(item);
    }
  }

  return listItems;
}

class ListItem {


  constructor(rowNumber, itemName, needed, source, typeName, brand, lastBought, notes) {
    this.rowNumber = rowNumber;
    this.itemName = itemName;
    this.needed = needed;
    this.source = source;
    this.typeName = typeName;
    this.brand = brand;
    this.lastBought = lastBought;
    this.notes = notes;
  }

  toString() {
    return JSON.stringify(this);
  }
}

async function writeTest() {
  console.log("in writeTest");
  console.log("gapi.client:");
  console.log(gapi.client);
  console.log("gapi.auth2:");
  console.log(gapi.auth2);
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: state.value.spreadsheetId,
      range: "notes!C2:C2",
      valueInputOption: 'USER_ENTERED',
      body: { values: [[7]] }
    });
  } catch (err) {
    setupResults.value.push("Error updating spreadsheet data: " + err.result.error.message);
    console.log(err);
    return;
  }
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
    accountInitLoaded();
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