import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { AccountInfo } from "@azure/msal-browser";
interface ContextType {
  account: {} | undefined;
}
export const Context = createContext<ContextType>({
  account: undefined,
});
export const useToken = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
