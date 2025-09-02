
import { setupResults } from './setup-view.js';
import { state } from './addresses-view.js';

let credentialResponse = null; // credential response

function handleCredentialResponse(response) {
    console.log("In handleCredentialResponse");
    setupResults.value.push("In handleCredentialResponse");

    credentialResponse = response.credential;
    state.value.token = response.credential;
    // setupResults.value.push("Encoded JWT ID token: " + response.credential);

    const responsePayload = decodeJwtResponse(response.credential);
    setupResults.value.push("Decoded JWT ID token: ");
    setupResults.value = setupResults.value.concat(formatJWT(responsePayload));
    accountInitLoaded();
}
window.onload = function () {
    console.log("prompting for a token");
    promptForToken();
    // Check to see whether there is already a JWT ID token
    if (state.value.token === "") {
        setupResults.value.push("No JWT token is available - fill in the above details then click 'Sign in' to get one.");
        // promptForToken();

    }
    else {
        // There is already a JWT token
        const responsePayload = decodeJwtResponse(state.value.token);
        // console.log(responsePayload);
        setupResults.value.push("A token is already available.");
        setupResults.value.push("Decoded JWT ID token: ");
        setupResults.value = setupResults.value.concat(formatJWT(responsePayload));

        // Check it hasn't expired
        const expiry = new Date(responsePayload.exp * 1000);
        if (expiry < new Date()) {
            setupResults.value.push("Token has expired, request another");
            state.value.token = "";
            // promptForToken();
        }
        else { // Theres's a valid token - try getting the test cells


        }

    }

}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function formatJWT(token) {
    const a = new Array();
    a.push("ID: " + token.sub);
    a.push('Full Name: ' + token.name);
    a.push('Given Name: ' + token.given_name);
    a.push('Family Name: ' + token.family_name);
    a.push("Image URL: " + token.picture);
    a.push("Email: " + token.email);
    a.push("Client ID: " + token.aud);
    a.push("Google account ID: " + token.sub);
    a.push("Creation time: " + new Date(token.iat * 1000).toString());
    a.push("Expiration time: " + new Date(token.exp * 1000).toString());
    return a;
}

// Show the google sign in button 
export function promptForToken() {
    console.log("About to call google.accounts.id.initialize");
    google.accounts.id.initialize({
        auto_select: true,
        client_id: state.value.clientId,
        callback: handleCredentialResponse,
        prompt_parent_id: 'google'
    });

    google.accounts.id.renderButton(
        document.getElementById("google"),
        { theme: "outline", size: "large" }  // customization attributes
    );

    // google.accounts.id.prompt((notification) => {
    //     setupResults.value = [];
    // }); // also display the One Tap dialog
}