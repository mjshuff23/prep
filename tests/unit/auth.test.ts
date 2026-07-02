/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { assertOwner, getCurrentUser, requireUser } from "../../src/lib/auth-helpers";
import { auth } from "../../src/lib/auth";

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

  describe("getCurrentUser", () => {
    it("returns user when session exists", async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user123" } } as any);
      const user = await getCurrentUser();
      expect(user).toEqual({ id: "user123" });
    });

    it("returns undefined when session is missing", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as any);
      const user = await getCurrentUser();
      expect(user).toBeUndefined();
    });
  });

  describe("requireUser", () => {
    it("returns user when present", async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user123" } } as any);
      const user = await requireUser();
      expect(user).toEqual({ id: "user123" });
    });

    it("redirects when user is missing", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as any);
      await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT");
    });
  });
});
