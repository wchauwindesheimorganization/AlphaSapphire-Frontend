import { createFileRoute } from "@tanstack/react-router";
import { api } from "../Api";
export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  );
}
