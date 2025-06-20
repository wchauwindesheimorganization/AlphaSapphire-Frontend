import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { AccountInfo } from "@azure/msal-browser";
import { User } from "./models/User";
interface UserContextType {
  account: User | undefined;
}
export const UserContext = createContext<UserContextType>({
  account: undefined,
});
export const useToken = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
