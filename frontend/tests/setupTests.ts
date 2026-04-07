// Enable jest-dom matchers like toBeInTheDocument()
import "@testing-library/jest-dom";

// Optional: clean up after each test (RTL best practice)
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Optional: mock Vite env variables used in your app
import { vi } from "vitest";

vi.stubGlobal("import.meta", {
  env: {
    VITE_API_BASE_URL: "http://localhost:4000/api",
  },
});
