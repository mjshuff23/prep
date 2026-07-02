import { describe, it, expect, vi } from "vitest";

vi.mock("../../src/lib/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn()
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  })
}));

import { assertOwner } from "../../src/lib/auth-helpers";

describe("auth-helpers", () => {
  describe("assertOwner", () => {
    it("does not throw when currentUserId matches resourceUserId", () => {
      expect(() => assertOwner("user123", "user123")).not.toThrow();
    });

    it("throws when currentUserId is missing", () => {
      expect(() => assertOwner("user123", undefined)).toThrow("NEXT_REDIRECT");
    });

    it("throws when currentUserId does not match resourceUserId", () => {
      expect(() => assertOwner("user123", "user456")).toThrow("NEXT_REDIRECT");
    });
  });
});
