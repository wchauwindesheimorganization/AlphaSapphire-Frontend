import { UserContext } from "./UserContext";
import React, { useState, useEffect } from "react";
import { getActiveUser } from "./api/userApi";
import { useMsal } from "@azure/msal-react";
import { User } from "./models/entities/User";
export default function Provider({ children }: { readonly children: React.ReactNode }) {
  const msalInstance = useMsal();
  const activeAccount = msalInstance.instance.getActiveAccount();

  const [account, setAccount] = useState<User | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const acquireUser = async () => {
      if (activeAccount) {
        getActiveUser()
          .then((response) => {
            setAccount(response.account);
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    };

    acquireUser();
  }, []);
  const contextValue = React.useMemo(() => ({ account }), [account]);

  return (
    <UserContext.Provider value={contextValue}>
      {account && children}
      <p>{error}</p>
    </UserContext.Provider>
  );
}
