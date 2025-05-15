import { useContext } from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useMsal } from "@azure/msal-react";
import { UserContext } from "../UserContext";
import NavigationAdmin from "@/components/NavigationAdmin";
import NavigationKeyUser from "@/components/NavigationKeyUser";
export const Route = createRootRoute({
  component: () => {
    return RootComponent();
  },
});

function RootComponent() {
  const { account } = useContext(UserContext);



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
        <Link
          to="/projects"
          activeProps={{
            className: "font-bold",
          }}>Projects</Link>
        {account && <>
          {account.Administrator && <NavigationAdmin />}
          {account.KeyUser && <NavigationKeyUser />}
        </>}

      </div>
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
