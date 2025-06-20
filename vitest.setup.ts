import "@testing-library/jest-dom";
import { vi } from "vitest";
vi.stubGlobal("open", vi.fn());
globalThis.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
