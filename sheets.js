import { state } from './addresses-view.js';
import { setupResults } from './setup-view.js';

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


// Get all the items from the shopping list
export async function getAllListItems() {
    console.log("in getAllListItems");
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: state.value.spreadsheetId,
            range: state.value.range,
        });
    } catch (err) {
        setupResults.value.push("Error retrieving spreadsheet data: " + err.result.error.message);
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