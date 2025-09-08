// for the things that need to be global because otherwise
// the load can't see them.

let tokenClient;

const promises = [];
let gisPromise;
let gapiPromise;
let windowPromise;
let vueMountedPromise;

promises.push(new Promise((resolve, reject) => {
    gisPromise = {resolve, reject}
}));
promises.push(new Promise((resolve, reject) => {
    gapiPromise = {resolve, reject}
}));
promises.push(new Promise((resolve, reject) => {
    windowPromise = {resolve, reject}
}));
promises.push(new Promise((resolve, reject) => {
    vueMountedPromise = {resolve, reject}
}));


function gisLoaded() {
    console.log("gsi loaded");
    gisPromise.resolve();
}

function gapiLoaded() {
    console.log("gapi loaded");
    gapiPromise.resolve();
}

window.onload = function () {
    console.log("window loaded");
    windowPromise.resolve();
}

