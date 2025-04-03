import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Route as UsersRoute } from "../../src/routes/users";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { UserContext } from "@/UserContext";
import { routeTree } from "../../src/routeTree.gen";
import Provider from "../../src/UserProvider";
import { useMsal } from "@azure/msal-react";
import { getUsers, createUser, getActiveUser } from "@/api/userApi";
import "@testing-library/jest-dom";
import { User } from "@/models/User";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
vi.mock("@/api/userApi", () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  getActiveUser: vi.fn(),
}));
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    createContext: vi.fn(() => ({
      Provider: ({ children }: { children: ReactNode }) => children,
    })),
    useContext: vi.fn(),
  };
});
vi.mock("@azure/msal-react", () => ({
  useMsal: vi.fn(() => ({
    instance: {
      logout: vi.fn(),
      getAllAccounts: vi.fn(() => [{ name: "Roks, Mart" }]),
      getActiveAccount: vi.fn(() => {
        return [{ name: "Roks, Mart" }];
      }),
    },
  })),
}));
describe("Users Route", () => {
  let router: ReturnType<typeof createRouter>;
  (useContext as ReturnType<typeof vi.fn>).mockResolvedValue({
    account: { FirstName: "test" },
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (getActiveUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      account: {
        name: "testuser@example.com",
      },
    });
    router = createRouter({
      routeTree,
      defaultPreload: "intent",
    });
  });

  it("Show loaded users", async () => {
    (getUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        Id: 1,
        FirstName: "testfirstname",
        LastName: "testlastname",
        Email: "testemail",
        DepartmentId: "testdepartmentid",
        KeyUser: false,
      },
      {
        Id: 2,
        FirstName: "testfirstname2",
        LastName: "testlastname2",
        Email: "testemail2",
        DepartmentId: "testdepartmentid2",
        KeyUser: true,
      },
    ]);
    router.navigate({ to: "/users" });
    render(<RouterProvider router={router} />);
    await waitFor(async () => {
      const users = await getUsers();
      users.forEach((element: User) => {
        expect(screen.getByDisplayValue(element["FirstName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["LastName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["DepartmentId"])).toBeVisible();
        expect(screen.getByDisplayValue(element["Email"])).toBeVisible();
      });
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).not.toBeChecked;
      expect(checkboxes[1]).toBeChecked();
    });
  });
  it("should have options for creating a new user and error when creating a user goes wrong", async () => {
    await act(async () => {
      router.navigate({ to: "/users" });
    });
    await act(async () => {
      vi.mocked(useContext).mockReturnValue({
        account: { FirstName: "test" },
      });
      render(<RouterProvider router={router} />);

      (getUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          Id: 1,
          FirstName: "testfirstname",
          LastName: "testlastname",
          Email: "testemail",
          DepartmentId: "testdepartmentid",
          KeyUser: false,
        },
        {
          Id: 2,
          FirstName: "testfirstname2",
          LastName: "testlastname2",
          Email: "testemail2",
          DepartmentId: "testdepartmentid2",
          KeyUser: true,
        },
      ]);
    });

    (createUser as ReturnType<typeof vi.fn>).mockRejectedValue(
      Object.assign(new Error("An error occurred"), {
        response: { data: ["test"] },
      })
    );
    // Find and click the "Add New User" button
    const addNewUserButton = await waitFor(async () =>
      screen.getByText("Add New User")
    );
    await act(async () => {
      fireEvent.click(addNewUserButton); // Example: Simulate a button click
    });
    // Check if the "Save" and "Cancel" buttons are visible in the Actions column
    let saveButton = await screen.findByText("Save");
    let cancelButton = await screen.findByText("Cancel");
    expect(saveButton).toBeVisible();
    expect(cancelButton).toBeVisible();
    await act(async () => fireEvent.click(saveButton));
    saveButton = await screen.findByText("Save");
    cancelButton = await screen.findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(createUser).toBeCalledTimes(1);
    expect(saveButton).not.toBeVisible();
    expect(cancelButton).not.toBeVisible();
  });
});
