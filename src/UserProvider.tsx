import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { msalInstance } from "./main";
import { api } from "./Api";
import { getActiveUser } from "./api/userApi";
export default function Provider({ children }: { children: React.ReactNode }) {
  const activeAccount = msalInstance?.getActiveAccount();
  const [account, setAccount] = useState<Object | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  console.log(account);
  useEffect(() => {
    const acquireUser = async () => {
      if (activeAccount) {
        getActiveUser().then((response) => {
          setAccount(response);
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
