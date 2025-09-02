

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
