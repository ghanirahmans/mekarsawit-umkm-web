import { normalizePhoneNumber } from "@/lib/wa";

describe("normalizePhoneNumber", () => {
  it("should normalize 08xxx to +628xxx", () => {
    expect(normalizePhoneNumber("08123456789")).toBe("+628123456789");
  });

  it("should normalize 8xxx to +628xxx", () => {
    expect(normalizePhoneNumber("8123456789")).toBe("+628123456789");
  });

  it("should normalize 628xxx to +628xxx (adding plus)", () => {
    expect(normalizePhoneNumber("628123456789")).toBe("+628123456789");
  });

  it("should normalize +628xxx to +628xxx (keep as is)", () => {
    expect(normalizePhoneNumber("+628123456789")).toBe("+628123456789");
  });

  it("should strip non-numeric characters but keep prefix", () => {
    expect(normalizePhoneNumber("0812-3456-789")).toBe("+628123456789");
    expect(normalizePhoneNumber("+62 812 3456 789")).toBe("+628123456789");
    expect(normalizePhoneNumber("(0812) 3456 789")).toBe("+628123456789");
  });

  it("should handle empty string", () => {
    // Based on current implementation "+" + clean, it returns "+"
    expect(normalizePhoneNumber("")).toBe("+");
  });

  it("should handle short numbers", () => {
    expect(normalizePhoneNumber("081")).toBe("+6281");
  });
});
