const promises = [];
let gisPromise;
let gapiPromise;
promises.push(new Promise((resolve, reject) => {
    gisPromise = {resolve, reject}
}));
promises.push(new Promise((resolve, reject) => {
    gapiPromise = {resolve, reject}
}));


function gisLoaded() {
    console.log("gsi loaded");
    gisPromise.resolve();
}

function gapiLoaded() {
    console.log("gapi loaded");
    gapiPromise.resolve();
}

