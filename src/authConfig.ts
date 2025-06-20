import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_SAPPHIRE_CLIENT_ID,
    authority: import.meta.env.VITE_AUTHORITY,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  system: {
    allowPlatformBroker: false, // Disables WAM Broker
  },
};

import.meta.env.VITE_BASE_URL;
