import { state } from './addresses-view.js';
import { setupResults } from './setup-view.js';
import { setUpRead, setUpWrite } from './auth.js';


// Whether the spreadsheet is readable
export async function canRead() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: state.value.spreadsheetId,
            range: "readwrite",
        });
    } catch (err) {
        // setupResults.value.push("Error retrieving spreadsheet data: " + err.result.error.message);
        return false;
    }
    return true;
}

// Whether the spreadsheet is writeable
export async function canWrite() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: state.value.spreadsheetId,
            range: "readwrite",
            valueInputOption: 'USER_ENTERED',
            resource: { values: [["write test"]] }
        });
    } catch (err) {
        return false;
    }
    return true;
}


// Get all the items from the shopping list
export async function getAllListItems() {
    await setUpRead();
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

async function getValueInCell(rangeName) {
    await setUpRead();
    // console.log("in getValueInCell");
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: state.value.spreadsheetId,
            range: rangeName,
        });
    } catch (err) {
        setupResults.value.push("Error retrieving spreadsheet data: " + err.result.error.message);
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        // console.log("empty value returned");
        return "";
    }

    // console.log("values returned: " + range.values[0][0]);
    return range.values[0][0];
}

export async function incrementTest() {
    await setUpWrite();

    let valueToWrite;
    const returnValue = await getValueInCell("increment");
    // console.log("returned from getValueInCell: " + returnValue);
    let currentValue = Number(returnValue);
    // console.log("current value: " + currentValue);
    if (currentValue.length === 0) {
        // console.log("setting valueToWrite to 0");
        valueToWrite = 0;
    }
    else if (isNaN(currentValue)) {
        // console.log("currentValue isn't a number");
        // console.log("setting valueToWrite to 1");
        valueToWrite = 1;
    }
    else {
        // console.log("currentValue is a number: " + currentValue)
        valueToWrite = currentValue + 1;
    }

    // console.log("in writeToSheet. Writing value: " + valueToWrite);
    // console.log("gapi.client:");
    // console.log(gapi.client);
    // console.log("gapi.auth2:");
    // console.log(gapi.auth2);
    // console.log("gapi.client.sheets.spreadsheets.values:");
    // console.log(gapi.client.sheets.spreadsheets.values);
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: state.value.spreadsheetId,
            range: "increment",
            valueInputOption: 'USER_ENTERED',
            // resource: { values: [[value]] }
            resource: { values: [[valueToWrite]] }
        });
    } catch (err) {
        console.log("err:");
        console.log(err);
        console.log("Error updating spreadsheet data: " + err);
        console.log(err);
        return;
    }
}

