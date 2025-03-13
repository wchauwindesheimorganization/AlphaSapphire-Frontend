import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { msalInstance } from "./main";
const account = msalInstance.getAllAccounts()[0];

const bearerToken2 = console.log(msalInstance.getAllAccounts()[0]);
let bearerToken;
// const bearerToken = await msalInstance.acquireTokenSilent({scopes:["User.Read"], account: account})
console.log("idtoken = " + msalInstance.getActiveAccount()?.idToken);
await msalInstance
  .acquireTokenSilent({
    scopes: [`api://${import.meta.env.VITE_SAPPHIRE_CLIENT_ID}/access_as_user`],
    account: account,
  })
  .then((data) => {
    console.log(data.accessToken);
    bearerToken = data.accessToken;
  });
// const bearerToken = msalInstance.getActiveAccount()?.idToken
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { Authorization: `Bearer ${bearerToken}` },
});
export default api;
