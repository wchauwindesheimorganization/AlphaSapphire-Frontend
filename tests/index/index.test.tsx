import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { getUsers, createUser, getActiveUser, assignMandate } from "@/api/userApi";
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
        useContext: vi.fn(() => { return { account: { FirstName: "test", Department: { DepartmentCode: 1 } } } },
        ),
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

    beforeEach(() => {
        vi.clearAllMocks();

        (getActiveUser as ReturnType<typeof vi.fn>).mockResolvedValue({
            account: {
                name: "testuser@example.com",
                DepartmentId: 1
                , Keyuser: true, Administrator: true
            },
        });
        router = createRouter({
            routeTree,
            defaultPreload: "intent",
        });
    });
    it("Should allow navigation using the navbar", async () => {

        router.navigate({ to: "/" })
        vi.mocked(useContext).mockReturnValue({
            account: { FirstName: "test", KeyUser: true, Administrator: true, Department: { DepartmentCode: 1 } },
        });
        render(<RouterProvider router={router} />);
        screen.debug()
        expect(screen.getByRole("button", { name: /admin/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /key user/i })).toBeVisible();


    })

});
