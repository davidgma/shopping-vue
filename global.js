// for the things that need to be global because otherwise
// the load can't see them.

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


function gisLoaded() {
    console.log("gsi loaded");
    gisPromise.resolve();
}

function gapiLoaded() {
    console.log("gapi loaded");
    gapiPromise.resolve();
}