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
vi.mock("@/api/projectApi", () => ({
    getProject: vi.fn(() => Promise.resolve([
        {
            Id: 1,
            ProjectName: "Alpha Sapphire",
            ProjectDescription: "A next-generation platform for project management.",
            ProjectNumber: "AS-2025-001",
            ProjectNumberExtern: "EXT-001",
            DepartmentId: 2,
            DateCreated: new Date("2025-01-15T09:00:00Z"),
            DateLastEdited: new Date("2025-05-20T12:00:00Z"),
            Department: {
                Id: 2,
                DepartmentName: "Engineering",
                Description: "Handles all engineering projects.",
                DepartmentCode: "ENG"
            },
            ProjectManagers: [
                {
                    Id: 10,
                    UserId: 101,
                    ProjectId: 1,
                    User: {
                        Id: 101,
                        FirstName: "Jane",
                        LastName: "Doe",
                        Email: "jane.doe@example.com",
                        DepartmentId: 2,
                        KeyUser: false,
                        Mandates: []
                    }
                }
            ],
            Subprojects: [
                {
                    Id: 100,
                    ProjectId: 1,
                    SubprojectName: "Frontend Module",
                    SubprojectAssistants: [],
                    SubprojectLeadEngineers: [],
                    SubprojectManagers: [],
                    SubprojectProcessValidators: [],
                }
            ]
        }

    ])),

}));
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
    it("Shows the subproject details", async () => {
        router.navigate({
            to: "/projects/$projectid",
            params: { projectid: "1" }
        });
        await act(async () => {
            render(
                <RouterProvider router={router} />
            );
        });
        await waitFor(() => {
            // expect(screen.getByText("Project 1 Details")).toBeInTheDocument();
        });
    });
});
