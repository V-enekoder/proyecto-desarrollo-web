import { describe, expect, it } from "vitest";
import { getInitials } from "./utils";

describe("utils", () => {
  describe("getInitials", () => {
    it("TC-FE-UTIL-001: debe devolver las iniciales para un nombre", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("TC-FE-UTIL-002: debe devolver la inicial para un solo nombre", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("TC-FE-UTIL-003: debe devolver como máximo 2 iniciales", () => {
      expect(getInitials("John Doe Smith")).toBe("JD");
    });

    it("TC-FE-UTIL-004: debe devolver cadena vacía si la entrada está vacía", () => {
      expect(getInitials("")).toBe("");
    });
  });
});
