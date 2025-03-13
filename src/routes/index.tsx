import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import api from "../Api";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  api.get("/api/users").then((response) => console.log(response.data));
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
