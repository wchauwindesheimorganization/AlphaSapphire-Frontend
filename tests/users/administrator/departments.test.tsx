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
import { getActiveUser } from "@/api/userApi";


import "@testing-library/jest-dom";
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

describe("Departments Route", () => {
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
    it("renders the users page", async () => {

        router.navigate({ to: "/administrator/departments" });
        render(
            <RouterProvider router={router} />
        );
        await waitFor(() => {
            expect(screen.getByDisplayValue("testdepartment1")).toBeInTheDocument();
            expect(screen.getByDisplayValue("testdepartment2")).toBeInTheDocument();
        });
    });
});
