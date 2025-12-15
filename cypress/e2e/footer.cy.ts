describe("Footer (E2E)", () => {
  beforeEach(() => {
    cy.visit("/#/");
  });

  it("renders the footer", () => {
    cy.get("footer").should("exist");
  });

  it("shows current year dynamically", () => {
    const year = new Date().getFullYear();

    cy.contains(`© ${year} StayHealthy`).should("be.visible");
  });

  it("shows author name", () => {
    cy.contains("Saurabh Lakhanpal").should("be.visible");
  });

  it("has correct GitHub link", () => {
    cy.contains("Saurabh Lakhanpal")
      .should("have.attr", "href", "https://github.com/SaurabhLP88")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel")
      .and("include", "noopener");
  });

  it("is visible at the bottom of the page", () => {
    cy.get("footer").scrollIntoView().should("be.visible");
  });
});
