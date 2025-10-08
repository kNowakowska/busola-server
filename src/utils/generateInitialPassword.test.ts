import { describe, it, expect } from "vitest";
import { generateInitialPassword } from "./generateInitialPassword";

describe("generateInitialPassword", () => {
  it("should generate a password with the correct length", () => {
    const password = generateInitialPassword();
    expect(password.length).toBe(8);

    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$&]/);
    expect(password).toMatch(/[a-z]/);
  });

  it("should throw an error if the length is less than 4", () => {
    expect(() => generateInitialPassword(3)).toThrow(
      "Password length must be at least 4 to include all required character types.",
    );
  });

  it("should generate a password with the correct length", () => {
    const password = generateInitialPassword(10);
    expect(password.length).toBe(10);
  });
});
