import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import Provider from "./UserProvider";
import { routeTree } from "./routeTree.gen";
// MSAL imports
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import { MsalProvider } from "@azure/msal-react";
export const msalInstance = new PublicClientApplication(msalConfig);

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});
// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const silentRequest = {
  scopes: ["access_as_user"],
  loginHint: "user@contoso.com"
};
msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts.length == 1) {
    msalInstance.setActiveAccount(accounts[0]);
  } else {
    msalInstance.loginPopup();
  }

  console.log(msalInstance)
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
      window.document.location.reload();
    }
  });
  const rootElement = document.getElementById("app")!;
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <MsalProvider instance={msalInstance}>
        {msalInstance && msalInstance.getActiveAccount() && (
          <Provider>
            <RouterProvider router={router} />
          </Provider>
        )}
      </MsalProvider>
    );
  }
});
