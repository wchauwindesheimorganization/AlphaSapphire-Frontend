import axios from "axios";
import { msalInstance } from "./main";
const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });
api.interceptors.request.use(async (config) => {
  const activeAccount = msalInstance?.getActiveAccount();
  if (activeAccount) {
    const token = await msalInstance?.acquireTokenSilent({
      scopes: [
        `api://${import.meta.env.VITE_SAPPHIRE_CLIENT_ID}/access_as_user`,
      ],
      account: activeAccount,
    });
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});
export { api };
