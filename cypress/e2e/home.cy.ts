describe("Home page", () => {
  it("loads successfully", () => {
    cy.visit("/");
    cy.contains("Your Health");
  });
});