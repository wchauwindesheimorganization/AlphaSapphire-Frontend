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
import { Mandate } from "@/models/Mandate";
import { routeTree } from "../../src/routeTree.gen";
import Provider from "../../src/UserProvider";
import { useMsal } from "@azure/msal-react";
import { getUsers, createUser, getActiveUser, assignMandate, unassignMandate } from "@/api/userApi";
import { createMandate, Mandates } from "@/api/mandateApi";
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
    assignMandate: vi.fn(),
    unassignMandate: vi.fn(),

}));
vi.mock("@/api/mandateApi", () => ({
    Mandates: vi.fn(),
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

vi.mock("@azure/msal-react", () => ({
    useMsal: vi.fn(() => ({
        instance: {
            acquireTokenSilent: vi.fn(() => Promise.resolve({})),
            acquireTokenRedirect: vi.fn(() => Promise.resolve({})),
            addEventCallback: vi.fn(),
            acquireTokenPopup: vi.fn(() => Promise.resolve({})),
            logout: vi.fn(),
            getAllAccounts: vi.fn(() => [{ name: "Roks, Mart", DepartmentId: 1 }]),
            getActiveAccount: vi.fn(() => {
                return [{ name: "Roks, Mart", DepartmentId: 1 }];
            }),
        },
    })),
}));
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

        (Mandates as ReturnType<typeof vi.fn>).mockResolvedValue([
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
        router.navigate({ to: "/mandates" });
        render(<RouterProvider router={router} />);
        await waitFor(async () => {
            const mandates = await Mandates();
            mandates.forEach((element: Mandate) => {
                expect(screen.getByDisplayValue(element["MandateName"])).toBeVisible();
                expect(screen.getByDisplayValue(element["Description"])).toBeVisible();

            });
        });
    });
    it("should have options for creating a new mandate and error when creating a user goes wrong", async () => {

        await act(async () => {
            router.navigate({ to: "/mandates" });
        });
        await act(async () => {
            vi.mocked(useContext).mockReturnValue({
                account: { FirstName: "test", DepartmentId: 1 },
            });
            render(<RouterProvider router={router} />);

            (Mandates as ReturnType<typeof vi.fn>).mockResolvedValue([
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

            expect(screen.getByText("Mandate name is required")).toBeVisible()
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
