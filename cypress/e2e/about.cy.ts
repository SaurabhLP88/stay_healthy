describe("About Page", () => {
  beforeEach(() => {
    cy.visit("/#/about");
  });

  it("renders About page heading", () => {
    cy.contains("About StayHealthy").should("be.visible");
  });

  it("renders application description", () => {
    cy.contains(
      "StayHealthy is a Medical Appointment Booking System designed to streamline online appointment booking and digital health management."
    ).should("be.visible");
  });

  it("renders 'What can you do?' list correctly", () => {
    cy.contains("What can you do?").should("be.visible");

    cy.get("#what").within(() => {
      cy.get("li").should("have.length", 5);

      cy.contains("Read health blogs and daily tips");
      cy.contains("Watch educational health videos");
      cy.contains("Search and book doctor appointments");
      cy.contains("Manage appointment history");
      cy.contains("Receive notifications and reviews");
    });
  });

  it("renders 'How to use the app' list correctly", () => {
    cy.contains("How to use the app").should("be.visible");

    cy.get("#how").within(() => {
      cy.get("li").should("have.length", 4);

      cy.get("li").eq(0).should("contain.text", "Register or login as a patient");
      cy.get("li").eq(1).should("contain.text", "Browse health content");
      cy.get("li").eq(2).should("contain.text", "Search doctors and book appointments");
      cy.get("li").eq(3).should("contain.text", "Manage everything from your dashboard");
    });
  });
});
