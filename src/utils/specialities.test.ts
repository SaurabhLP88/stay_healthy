import specialities, { specialities as namedSpecialities } from "./specialities";

describe("specialities utility", () => {
  it("should export an array", () => {
    expect(Array.isArray(specialities)).toBe(true);
  });

  it("should not be empty", () => {
    expect(specialities.length).toBeGreaterThan(0);
  });

  it("should contain expected core specialities", () => {
    expect(specialities).toEqual(
      expect.arrayContaining([
        "Dentist",
        "Cardiologist",
        "Neurologist",
        "Pediatrician",
      ])
    );
  });

  it("should not contain duplicate values", () => {
    const uniqueValues = new Set(specialities);
    expect(uniqueValues.size).toBe(specialities.length);
  });

  it("should be exported both as default and named export", () => {
    expect(namedSpecialities).toBe(specialities);
  });

  it("should contain only strings", () => {
    specialities.forEach((item) => {
      expect(typeof item).toBe("string");
    });
  });
});
