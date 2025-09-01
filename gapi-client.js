import { state } from './addresses-view.js';
import { setupResults } from './setup-view.js';

let tokenClient;
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

Promise.all(promises).then(async () => {
    console.log("gis and gapi loaded");
    getTokenClient();
    await loadClient();
    console.log("gapi client loaded.");
    await initializeGapiClient();
    // gapi.client.setToken(state.value.token);
    console.log("gapi client initialized.");
    // getTestData();
    getAllListItems();

});

async function getTokenClient() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: state.value.clientId,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        callback: '', // defined later
    });
}

async function loadClient() {
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

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: state.value.APIkey,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

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