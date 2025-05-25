import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Mandate } from "@/models/entities/Mandate";
import { routeTree } from "../../src/routeTree.gen";
import { createUser, getActiveUser } from "@/api/userApi";
import { createMandate, getMandates } from "@/api/mandateApi";
import "@testing-library/jest-dom";
import {
    useContext,
    ReactNode,
} from "react";
vi.mock("@/api/userApi", () => ({
    getUsers: vi.fn(),
    createUser: vi.fn(),
    getActiveUser: vi.fn(),
    assignMandate: vi.fn(),
    unassignMandate: vi.fn(),

}));
vi.mock("@/api/mandateApi", () => ({
    getMandates: vi.fn(),
    createMandate: vi.fn(),
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

describe("Mandate Route", () => {
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

    it("Show loaded mandates", async () => {

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
        router.navigate({ to: "/keyuser/mandates" });
        render(<RouterProvider router={router} />);
        await waitFor(async () => {
            const mandates = await getMandates();
            mandates.forEach((element: Mandate) => {
                expect(screen.getByDisplayValue(element["MandateName"])).toBeVisible();
                expect(screen.getByDisplayValue(element["Description"])).toBeVisible();

            });
        });
    });
    it("should have options for creating a new mandate and error when creating a user goes wrong", async () => {

        await act(async () => {
            router.navigate({ to: "/keyuser/mandates" });
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
        });

        (createUser as ReturnType<typeof vi.fn>).mockRejectedValue(
            Object.assign(new Error("An error occurred"), {
                response: { data: ["test"] },
            })
        );
        // Find and click the "Add New User" button
        const addNewUserButton = await waitFor(async () =>
            screen.getByText("Add New Mandate")
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

            expect(screen.getByText("Mandate Name is required")).toBeVisible()
            expect(screen.queryByText("Department Id is empty, contact app administrator")).not.toBeInTheDocument()

        })
        await act(async () => {
            fireEvent.click(cancelButton);
        });
        expect(createMandate).not.toBeCalled();
        expect(saveButton).not.toBeVisible();
        expect(cancelButton).not.toBeVisible();
    });


});
