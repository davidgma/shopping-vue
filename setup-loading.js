

import { state } from './addresses-view.js';

let credentialResponse = null; // credential response

console.log("monitoring loading of setup files");

function handleCredentialResponse(response) {
    console.log("In handleCredentialResponse");
    credentialResponse = response.credential;
    console.log("Encoded JWT ID token: " + response.credential);
}
window.onload = function () {
    console.log("clientId from within setup-loading.js: " + state.value.clientId);

    google.accounts.id.initialize({
        client_id: state.value.clientId,
        callback: handleCredentialResponse
    });

    console.log("After call to initialize");
    if (credentialResponse === null) {
        console.log("credentialResponse is still null");
    }
    else {
        console.log("credentialResponse:");
        console.log(credentialResponse);
    }

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
    );
    //zx
}