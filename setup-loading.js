
import { setupResults } from './setup-view.js';
import { state } from './addresses-view.js';

let credentialResponse = null; // credential response

setupResults.value.push("Monitoring loading of setup files.");

function handleCredentialResponse(response) {
    setupResults.value.push("In handleCredentialResponse");

    credentialResponse = response.credential;
    setupResults.value.push("Encoded JWT ID token: " + response.credential);
}
window.onload = function () {
    setupResults.value.push("clientId from within setup-loading.js: " + state.value.clientId);

    google.accounts.id.initialize({
        client_id: state.value.clientId,
        callback: handleCredentialResponse
    });

    setupResults.value.push("After call to initialize");
    if (credentialResponse === null) {
        setupResults.value.push("credentialResponse is still null");
    }
    else {
        setupResults.value.push("credentialResponse:");
        setupResults.value.push(JSON.stringify(credentialResponse));
    }


    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
    );

    google.accounts.id.prompt((notification) => {
        console.log("Notification: ");
        console.log(notification);
    }); // also display the One Tap dialog


}