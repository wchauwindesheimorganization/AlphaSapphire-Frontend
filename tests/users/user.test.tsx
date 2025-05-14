import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../../src/routeTree.gen";
import { Mandate } from "@/models/entities/Mandate";
import { getUsers, createUser, getActiveUser, assignMandate, unassignMandate, updateUser } from "@/api/userApi";
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

vi.mock("@azure/msal-react", () => ({
  useMsal: vi.fn(() => ({
    instance: {
      acquireTokenSilent: vi.fn(() => Promise.resolve({})),
      addEventCallback: vi.fn(),
      acquireTokenRedirect: vi.fn(() => Promise.resolve({})),
      acquireTokenPopup: vi.fn(() => Promise.resolve({})),
      logout: vi.fn(),
      getAllAccounts: vi.fn(() => [{ name: "Roks, Mart", DepartmentId: 1 }]),
      getActiveAccount: vi.fn(() => {
        return [{ name: "Roks, Mart", DepartmentId: 1 }];
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
        DepartmentId: "testdepartment1",
        KeyUser: false,
      },
      {
        Id: 2,
        FirstName: "testfirstname2",
        LastName: "testlastname2",
        Email: "testemail2",
        DepartmentId: "testdepartment2",
        KeyUser: true,
      },
    ]);
    router.navigate({ to: "/keyuser/users" });
    render(<RouterProvider router={router} />);
    await waitFor(async () => {
      const users = await getUsers();
      users.forEach((element: User) => {
        expect(screen.getByDisplayValue(element["FirstName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["LastName"])).toBeVisible();
        expect(screen.getByDisplayValue(element["Email"])).toBeVisible();
      });
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).not.toBeChecked;
      expect(checkboxes[1]).toBeChecked();
    });
  });
  it("should have options for creating a new user and error when creating a user goes wrong", async () => {

    await act(async () => {
      router.navigate({ to: "/keyuser/users" });
    });
    await act(async () => {
      vi.mocked(useContext).mockReturnValue({
        account: { FirstName: "test", DepartmentId: 1 },
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
  it("Should open a dialog when clicking on the Id where mandates can be assigned", async () => {
    await act(async () => {
      router.navigate({ to: "/keyuser/users" });
    });
    await act(async () => {
      vi.mocked(useContext).mockReturnValue({
        account: { FirstName: "test", DepartmentId: 1 },
      });
      render(<RouterProvider router={router} />);
      (getMandates as ReturnType<typeof vi.fn>).mockResolvedValue([
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
      ]);
      const mandates = await getMandates();
      (getUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          Id: 1,
          FirstName: "testfirstname",
          LastName: "testlastname",
          Email: "testemail",
          DepartmentId: "testdepartmentid",
          KeyUser: false,
          Mandates: []
        },
        {
          Id: 2,
          FirstName: "testfirstname2",
          LastName: "testlastname2",
          Email: "testemail2",
          DepartmentId: "testdepartmentid2",
          KeyUser: true,
          Mandates: mandates
        },
      ]);


    });
    await act(async () => {
      const id1 = await waitFor(async () =>
        screen.getByText("1")
      );
      userEvent.click(id1);
    })
    await waitFor(() => {
      expect(screen.getByText("Manage mandates for testfirstname testlastname")).toBeVisible()
    })


  })
  it("Should assign a mandate to a user", async () => {
    await act(async () => {
      router.navigate({ to: "/keyuser/users" });
    });
    await act(async () => {
      vi.mocked(useContext).mockReturnValue({
        account: { FirstName: "test", DepartmentId: 1 },
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
          Mandates: []
        },
        {
          Id: 2,
          FirstName: "testfirstname2",
          LastName: "testlastname2",
          Email: "testemail2",
          DepartmentId: "testdepartmentid2",
          KeyUser: true,
          Mandates: []
        },
      ]);
    });
    await act(async () => {
      const id1 = await waitFor(async () =>
        screen.getByText("1")
      );
      userEvent.click(id1);
    })
    await waitFor(() => {
      expect(screen.getByText("Manage mandates for testfirstname testlastname")).toBeVisible()
    })

    let multiselects = await waitFor(async () =>
      screen.getAllByRole("combobox")
    );
    await act(async () => {
      userEvent.click(multiselects[0]);
    });
    // await act(async () => {
    //   userEvent.click(options);
    // });
    // await act(async () => {
    //   fireEvent.change(multiselects[0], {
    //     target: {
    //       value: [{
    //         Id: 1,
    //         MandateName: "testmandate1",
    //         Description: "testdescription1",
    //         DepartmentId: 1
    //       },]
    //     }
    //   });
    // });
    await act(async () => {
      fireEvent.keyDown(multiselects[0], { key: 'ArrowDown' });

    });
    await act(async () => {
      fireEvent.click(screen.getByText('testmandate1'));

    });

    expect(vi.mocked(assignMandate)).toBeCalled();

  });
});
