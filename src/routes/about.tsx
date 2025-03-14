import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  axios.get("/api/users/").then((response) => console.log(response));

  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  );
}
