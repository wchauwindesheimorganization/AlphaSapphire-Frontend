import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { msalInstance } from "./main";
const account = msalInstance.getAllAccounts()[0];

const bearerToken2 = 
console.log(msalInstance.getAllAccounts()[0])
// console.log(await msalInstance.acquireTokenPopup({scopes: ["User.Read"], account:account
// }))
console.log(await msalInstance.acquireTokenSilent({scopes:["User.Read"], account: account}))
let bearerToken;
// const bearerToken = await msalInstance.acquireTokenSilent({scopes:["User.Read"], account: account})
await msalInstance.acquireTokenSilent({scopes:["User.Read"], account:account}).then(data=>{console.log(data.accessToken);bearerToken = data.accessToken})
// const bearerToken = msalInstance.getActiveAccount()?.idToken
const api = axios.create({baseURL: import.meta.env.VITE_BASE_URL ,headers:{"Authorization":`Bearer ${bearerToken}`}});
export default api;