import { useEffect, createContext, useState, useContext } from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useMsal } from "@azure/msal-react";
import { Context } from "../Context";
export const Route = createRootRoute({
  component: () => {
    return RootComponent();
  },
});

function RootComponent() {
  const { account } = useContext(Context);

  useEffect(() => {}, []);

  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
