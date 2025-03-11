import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: "db776248-192b-4628-b4c8-ac170c5b7e2d",
    authority:
      "https://login.microsoftonline.com/7f90057d-3ea0-46fe-b07c-e0568627081b",
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  system: {
    allowPlatformBroker: false, // Disables WAM Broker
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
// export const loginRequest: PopupRequest = {
//   scopes: ["User.Read"],
// };

// Add here the endpoints for MS Graph API services you would like to use.
// export const graphConfig = {
//   graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
// };
