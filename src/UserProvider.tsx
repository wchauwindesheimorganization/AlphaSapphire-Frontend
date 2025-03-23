import { UserContext } from "./UserContext";
import { useState, useEffect, act } from "react";
import React from "react";
import { getActiveUser } from "./api/userApi";
import { useMsal } from "@azure/msal-react";
export default function Provider({ children }: { children: React.ReactNode }) {
  const msalInstance = useMsal();
  const activeAccount = msalInstance.instance.getActiveAccount();

  const [account, setAccount] = useState<Object | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const acquireUser = async () => {
      if (activeAccount) {
        getActiveUser()
          .then((response) => {
            setAccount(response);
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    };

    acquireUser();
  }, []);
  return (
    <UserContext.Provider value={{ account: account }}>
      {account && children}
      <p>{error}</p>
    </UserContext.Provider>
  );
}
