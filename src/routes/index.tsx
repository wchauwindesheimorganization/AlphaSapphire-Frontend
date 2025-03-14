import { useContext } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Context } from "../Context";
import axios from "axios";
export const Route = createFileRoute("/")({
  component: HomeComponent,
});
function HomeComponent() {
  axios.get("/api/users/").then((response) => console.log(response.data));
  const { account } = useContext(Context);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
