import { describe, it, expect } from "vitest";
import { assertOwner } from "../../src/lib/auth-helpers";

describe("auth-helpers", () => {
  describe("assertOwner", () => {
    it("does not throw when currentUserId matches resourceUserId", () => {
      expect(() => assertOwner("user123", "user123")).not.toThrow();
    });

    it("throws when currentUserId is missing", () => {
      expect(() => assertOwner("user123", undefined)).toThrow("Unauthorized");
    });

    it("throws when currentUserId does not match resourceUserId", () => {
      expect(() => assertOwner("user123", "user456")).toThrow("Unauthorized");
    });
  });
});
