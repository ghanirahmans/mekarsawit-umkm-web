import { formatCurrency, formatDate, slugify } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("formats number to IDR currency correctly", () => {
      expect(formatCurrency(10000)).toBe("Rp 10.000"); // Note: ID locale might use non-breaking space
    });

    it("handles zero correctly", () => {
      expect(formatCurrency(0)).toBe("Rp 0");
    });
  });

  describe("formatDate", () => {
    it("formats date object to Indonesian format", () => {
      const date = new Date("2023-01-01");
      expect(formatDate(date)).toBe("1 Januari 2023");
    });

    it("formats date string to Indonesian format", () => {
      expect(formatDate("2023-08-17")).toBe("17 Agustus 2023");
    });
  });

  describe("slugify", () => {
    it("converts text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("handles special characters", () => {
      expect(slugify("Café & Restaurant")).toBe("caf-restaurant");
    });

    it("handles multiple spaces", () => {
      expect(slugify("foo   bar")).toBe("foo-bar");
    });
  });
});
