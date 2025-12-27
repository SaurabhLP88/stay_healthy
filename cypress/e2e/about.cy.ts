describe("About Page", () => {
  beforeEach(() => {
    cy.visit("/#/about");
  });

  it("renders About page heading", () => {
    cy.contains("About StayHealthy").should("be.visible");
  });

  it("renders intro description", () => {
    cy.contains(
      "StayHealthy is a digital healthcare platform created to simplify the way people discover doctors"
    ).should("be.visible");
  });

  it("renders 'Why StayHealthy?' section", () => {
    cy.contains("Why StayHealthy?").should("be.visible");

    cy.contains(
      "Finding the right doctor, remembering appointments, and keeping track of medical records"
    ).should("be.visible");
  });

  it("renders 'How StayHealthy Works' section with 3 steps", () => {
    cy.contains("How StayHealthy Works").should("be.visible");

    cy.contains("Create an Account").should("be.visible");
    cy.contains("Find & Book Doctors").should("be.visible");
    cy.contains("Manage Everything").should("be.visible");
  });

  it("renders 'What You Can Do on StayHealthy' list", () => {
    cy.contains("What You Can Do on StayHealthy").should("be.visible");

    cy.contains("Discover doctors and healthcare services").should("be.visible");
    cy.contains("Book and manage appointments seamlessly").should("be.visible");
    cy.contains("View appointment history and medical reports").should("be.visible");
    cy.contains("Share feedback and reviews after consultations").should("be.visible");
    cy.contains("Receive timely updates and notifications").should("be.visible");
  });

  it("renders Vision section", () => {
    cy.contains("Our Vision").should("be.visible");

    cy.contains(
      "StayHealthy aims to make healthcare more accessible and organized"
    ).should("be.visible");
  });
});

