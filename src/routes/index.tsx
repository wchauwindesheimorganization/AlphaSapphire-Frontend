import { useContext } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserContext } from "../UserContext";
import axios from "axios";
import { api } from "../Api";
export const Route = createFileRoute("/")({
  component: HomeComponent,
});
function HomeComponent() {
  const { account } = useContext(UserContext);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
