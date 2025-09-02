
let tokenClient;
const promises = [];
let gisPromise;
let gapiPromise;
// let accountInitPromise;
promises.push(new Promise((resolve, reject) => {
    gisPromise = {resolve, reject}
}));
promises.push(new Promise((resolve, reject) => {
    gapiPromise = {resolve, reject}
}));
// promises.push(new Promise((resolve, reject) => {
//     accountInitPromise = {resolve, reject}
// }));


function gisLoaded() {
    console.log("gsi loaded");
    gisPromise.resolve();
}

function gapiLoaded() {
    console.log("gapi loaded");
    gapiPromise.resolve();
}

// function accountInitLoaded() {
//     console.log("google.accounts.id.initialize loaded and called back");
//     accountInitPromise.resolve();
// }

function writeToSheet() {
    writeTest();
}

async function writeTest() {
    // tokenClient.requestAccessToken();
    console.log("in writeTest");
    console.log("gapi.client:");
    console.log(gapi.client);
    console.log("gapi.auth2:");
    console.log(gapi.auth2);
    console.log("gapi.client.sheets.spreadsheets.values:");
    console.log(gapi.client.sheets.spreadsheets.values);
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: "1YZWmLktxzprYWLZDHopC0vsz_Z44eavyHyo0lgWsSj4",
        range: "notes!C2:C2",
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[7]] }
      });
    } catch (err) {
        console.log("err:");
        console.log(err);
      console.log("Error updating spreadsheet data: " + err);
      console.log(err);
      return;
    }
  }
