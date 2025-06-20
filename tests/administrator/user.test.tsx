import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { getUsers, createUser, getActiveUser, adminGetUsers } from "@/api/userApi";
import { getMandates } from "@/api/mandateApi";

import "@testing-library/jest-dom";
import { User } from "@/models/entities/User";
import {
  useContext,
  ReactNode,
} from "react";
vi.mock("@/api/userApi", () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  getActiveUser: vi.fn(),
  assignMandate: vi.fn(() => Promise.resolve({})),
  unassignMandate: vi.fn(),
  adminGetUsers: vi.fn(),
}));
vi.mock("@/api/departmentApi", () => ({
  getDepartments: vi.fn(() => Promise.resolve([
    {
      Id: 1,
      DepartmentCode: "testdepartment1",
      DepartmentName: "testdepartmentname1",
    },
    {
      Id: 2,
      DepartmentCode: "testdepartment2",
      DepartmentName: "testdepartmentname2",
    },
  ])),
}));
vi.mock("@/api/mandateApi", () => ({
  getMandates: vi.fn(() => Promise.resolve([
    {
      Id: 1,
      MandateName: "testmandate1",
      Description: "testdescription1",
      DepartmentId: 1
    },
    {
      Id: 2,
      MandateName: "testmandate2",
      Description: "testdescription2",
      DepartmentId: 1
    },
  ])),
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

vi.mock("@azure/msal-browser", () => {
  const mockLoginPopup = vi.fn(); // Mock loginPopup method
  const mockAcquireTokenSilent = vi.fn(); // Mock acquireTokenSilent method
  const mockGetAllAccounts = vi.fn(); // Mock getAllAccounts method
  const mockGetActiveAccount = vi.fn();
  return {
    PublicClientApplication: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined), // Mock initialize
      loginPopup: mockLoginPopup, // Attach mock loginPopup
      addEventCallback: vi.fn(),
      acquireTokenSilent: mockAcquireTokenSilent, // Attach mock acquireTokenSilent
      getAllAccounts: mockGetAllAccounts, // Attach mock getAllAccounts
      getActiveAccount: mockGetActiveAccount, // Mock getActiveAccount method
    })),
  };
});

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

    const mandates = await getMandates();
    (adminGetUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        Id: 1,
        FirstName: "testfirstname",
        LastName: "testlastname",
        Email: "testemail",
        Department: { DepartmentCode: 2 },
        Mandates: mandates,
        KeyUser: false,
      },
      {
        Id: 2,
        FirstName: "testfirstname2",
        LastName: "testlastname2",
        Email: "testemail2",
        Department: { DepartmentCode: 2 },
        Mandates: [],
        KeyUser: true,
      },
    ]);
    router.navigate({ to: "/administrator/users" });
    render(<RouterProvider router={router} />);
    await waitFor(async () => {
      const users = await adminGetUsers();
      users.forEach((element: User) => {
        expect(screen.getByDisplayValue(element["FirstName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["LastName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["Email"])).toBeVisible();
      });
      expect(screen.getByText("testmandate1, testmandate2")).toBeVisible();

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).not.toBeChecked;
      expect(checkboxes[1]).toBeChecked();
    });
  });
  it("should have options for creating a new user and error when creating a user goes wrong", async () => {

    await act(async () => {
      router.navigate({ to: "/administrator/users" });
    });
    await act(async () => {
      vi.mocked(useContext).mockReturnValue({
        account: { FirstName: "test", DepartmentId: 1, Department: { DepartmentCode: 1 } },
      });
      render(<RouterProvider router={router} />);

      (getUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          Id: 1,
          FirstName: "testfirstname",
          LastName: "testlastname",
          Email: "testemail",
          Department: { DepartmentCode: 2 },

          KeyUser: false,
        },
        {
          Id: 2,
          FirstName: "testfirstname2",
          LastName: "testlastname2",
          Email: "testemail2",
          Department: { DepartmentCode: 2 },

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
    console.log("test")
    let saveButton = await screen.findByText("Save");
    let cancelButton = await screen.findByText("Cancel");
    expect(saveButton).toBeVisible();
    expect(cancelButton).toBeVisible();
    await act(async () => fireEvent.click(saveButton));
    saveButton = await screen.findByText("Save");
    cancelButton = await screen.findByText("Cancel");
    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeVisible()
      expect(screen.getByText("Last name is required")).toBeVisible()
      expect(screen.getByText("Email is required")).toBeVisible()
      expect(screen.getByText("Must be valid email")).toBeVisible()
      expect(screen.getByText("Email must belong to the '@arcadis.com' domain")).toBeVisible()
      expect(screen.queryByText("Department Id is empty, contact app administrator")).not.toBeInTheDocument()

    })
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(createUser).not.toBeCalled();
    expect(saveButton).not.toBeVisible();
    expect(cancelButton).not.toBeVisible();
  });

});
