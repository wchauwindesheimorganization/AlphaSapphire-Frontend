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
        },
        {
            Id: 2,
            DepartmentCode: "testdepartment2",

        },
    ])),
    createDepartment: vi.fn(() => Promise.resolve({
        Id: 3,
        DepartmentCode: "testdepartment3",
    })),
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
    it("renders the departments page", async () => {
        act(() => {
            router.navigate({ to: "/administrator/departments" });
            render(
                <RouterProvider router={router} />
            );
        });
        await waitFor(() => {
            expect(screen.getByDisplayValue("testdepartment1")).toBeInTheDocument();
            expect(screen.getByDisplayValue("testdepartment2")).toBeInTheDocument();
        });
    });
    it("adds a new department", async () => {
        router.navigate({ to: "/administrator/departments" });
        await act(async () => {
            render(
                <RouterProvider router={router} />
            );
        });
        await act(async () => {
            fireEvent.click(screen.getByText("Add Department"));

        });
        await act(async () => {
            expect(screen.getByText("Save")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
            const input = screen.getAllByRole("textbox");
            fireEvent.change(input[2], { target: { value: "testdepartment3" } });
            fireEvent.click(screen.getByText("Save"));
        });
        expect(screen.getByDisplayValue("testdepartment3")).toBeInTheDocument();
    })
});
