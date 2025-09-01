import { state } from './addresses-view.js';

Promise.all(promises).then(async () => {
    console.log("gis and gapi loaded");
    await loadClient();
    console.log("gapi client loaded.");
    // gapi.client.setToken(state.value.token);
    await initClient();
    console.log("gapi client initiated.");
    // await loadGapiClient();
    // console.log("gapi client spreadsheet discovery loaded.");

});

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



async function initClient() {
    return new Promise((resolve) => {
        console.log("APIkey: " + state.value.APIkey);
        gapi.client.init({
            apiKey: state.value.APIkey,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
            clientId: state.value.clientId,
            scope: "https://www.googleapis.com/auth/spreadsheets"
        }, () => {
            resolve();
        },
            (error) => {
                console.log("Error initiating client: " 
                + JSON.stringify(error));
            });
    });
}

async function loadGapiClient() {
    return new Promise((resolve) => {
        gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4', () => {
            resolve();
        },
            (error) => {
                console.log("Error loading gapi client: " 
                + JSON.stringify(error));
            });
    });
}
