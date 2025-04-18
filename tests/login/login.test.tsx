import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { routeTree } from "@/routeTree.gen";
import Provider from "@/UserProvider";
import { PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import "@testing-library/jest-dom";
import { getActiveUser } from "@/api/userApi";

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
vi.mock("@/api/userApi", () => ({
  getActiveUser: vi.fn(),
}));
// Mock the MSAL React library
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

describe("Provider", () => {
  let mockMsalInstance: any;

  beforeEach(() => {
    vi.resetAllMocks();
    const msalConfig = { auth: { clientId: "mock-client-id" } };

    // Instantiate the mocked PublicClientApplication
    new PublicClientApplication(msalConfig);
    mockMsalInstance = (PublicClientApplication as unknown as { mock: any })
      .mock.instances[0];
  });

  it("should render the app if there is an active account", async () => {
    (getActiveUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      account: {
        name: "testuser@example.com",
      },
    });
    (useMsal as ReturnType<typeof vi.fn>).mockReturnValue({
      instance: {
        logout: vi.fn(),
        getActiveAccount: vi
          .fn()
          .mockResolvedValue({ username: "testuser@example.com" }),
      },
      accounts: [{ name: "Roks, Mart" }],
    });

    render(<Provider children={<p>test</p>} />);
    await waitFor(() => {
      expect(screen.getByText("test")).toBeInTheDocument();
    });
  });
  it("should query API when account is present, but not login when API sends error", async () => {
    const router = createRouter({
      routeTree,
      defaultPreload: "intent",
    });
    (getActiveUser as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("test error")
    );

    (useMsal as ReturnType<typeof vi.fn>).mockReturnValue({
      instance: {
        logout: vi.fn(),
        getActiveAccount: vi
          .fn()
          .mockResolvedValue({ username: "testuser@example.com" }),
      },
      accounts: [{ name: "Roks, Mart" }],
    });
    render(<Provider children={<p>test</p>} />);
    await waitFor(() => {
      expect(screen.queryByText("test")).not.toBeInTheDocument();
    });
  });
  it("should not query the API if there is no MSAL account", async () => {
    const { instance } = useMsal();

    (useMsal as ReturnType<typeof vi.fn>).mockReturnValue({
      instance: {
        logout: vi.fn(),
        getActiveAccount: vi.fn().mockReturnValue(null),
      },
    });

    render(<Provider children={<p>test</p>} />);
    await waitFor(() => {
      expect(instance.getActiveAccount).not.toHaveBeenCalled();
      expect(getActiveUser).not.toHaveBeenCalled();
      expect(screen.queryByText("test")).not.toBeInTheDocument();
    });
  });
});
