
import { setupResults } from './setup-view.js';
import { state } from './addresses-view.js';

let credentialResponse = null; // credential response

setupResults.value.push("Monitoring loading of setup files.");

function handleCredentialResponse(response) {
    setupResults.value.push("In handleCredentialResponse");

    credentialResponse = response.credential;
    setupResults.value.push("Encoded JWT ID token: " + response.credential);

    const responsePayload = decodeJwtResponse(response.credential);

    setupResults.value.push("Decoded JWT ID token: ");
    setupResults.value.push("ID: " + responsePayload.sub);
    setupResults.value.push('Full Name: ' + responsePayload.name);
    setupResults.value.push('Given Name: ' + responsePayload.given_name);
    setupResults.value.push('Family Name: ' + responsePayload.family_name);
    setupResults.value.push("Image URL: " + responsePayload.picture);
    setupResults.value.push("Email: " + responsePayload.email);
}
window.onload = function () {
    setupResults.value.push("clientId from within setup-loading.js: " + state.value.clientId);

    google.accounts.id.initialize({
        auto_select: true,
        client_id: state.value.clientId,
        callback: handleCredentialResponse,
        prompt_parent_id: 'google',
        button_auto_select: true,
        use_fedcm_for_prompt: true
    });

    setupResults.value.push("After call to initialize");


    google.accounts.id.renderButton(
        document.getElementById("google"),
        { theme: "outline", size: "large" }  // customization attributes
    );

    google.accounts.id.prompt((notification) => {
        setupResults.value.push("Notification: ");
        setupResults.value.push(JSON.stringify(notification));
    }); // also display the One Tap dialog


}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }