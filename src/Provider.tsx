import { useMsal } from "@azure/msal-react";
import { Context } from "./Context";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { msalInstance } from "./main";
import { AccountInfo } from "@azure/msal-browser";
export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<string | null>(null);
  const activeAccount = msalInstance?.getActiveAccount();
  const [account, setAccount] = useState<Object | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const acquireToken = async () => {
      if (activeAccount) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            scopes: [
              `api://${import.meta.env.VITE_SAPPHIRE_CLIENT_ID}/access_as_user`,
            ],
            account: activeAccount,
          });
          axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${response.accessToken}`;
          axios
            .get("/api/users/me")
            .then((response) => {
              setAccount(response.data.account);
            })
            .catch((error) => {
              setError(error.response.data);
            });
        } catch (error) {
          console.error(error);
        }
      }
    };

    acquireToken();
  }, []);
  return (
    <Context.Provider value={{ account: account }}>
      {account && children}
      <p>{error}</p>
    </Context.Provider>
  );
}
