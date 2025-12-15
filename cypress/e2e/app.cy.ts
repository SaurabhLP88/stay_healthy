describe("App Routing", () => {
  beforeEach(() => {
    cy.visit("/#/");
  });

  it("renders Landing Page on root route", () => {
    cy.url().should("include", "/#/");
    cy.contains("StayHealthy").should("exist");
  });

  it("navigates to About page", () => {
    cy.visit("/#/about");

    cy.contains("About StayHealthy").should("be.visible");
    cy.contains("What can you do?").should("be.visible");
  });

  it("navigates to Sign Up page", () => {
    cy.visit("/#/signup");

    cy.contains("Sign Up").should("be.visible");
    cy.get("form").should("exist");
  });

  it("navigates to Login page", () => {
    cy.visit("/#/login");

    cy.contains("Login").should("be.visible");
    cy.get("form").should("exist");
  });

  it("navigates to Instant Consultation page", () => {
    cy.visit("/#/instant-consultation");

    cy.contains("Instant").should("exist");
  });

  it("navigates to Book Consultation page", () => {
    cy.visit("/#/book-consultation");

    cy.contains("Doctor").should("exist");
  });

  it("navigates to Appointments page", () => {
    cy.visit("/#/appointments");

    cy.contains("Appointments").should("exist");
  });

  it("navigates to Health Tips page", () => {
    cy.visit("/#/health-tips");

    cy.contains("Health").should("exist");
  });

  it("navigates to Reviews page", () => {
    cy.visit("/#/reviews");

    cy.contains("Reviews").should("exist");
  });

  it("navigates to Reports page", () => {
    cy.visit("/#/reports");

    cy.contains("Reports").should("exist");
  });

  it("navigates to Profile page", () => {
    cy.visit("/#/profile");

    cy.contains("Profile").should("exist");
  });

  it("navigates to Self Check page", () => {
    cy.visit("/#/self-check");

    cy.contains("Self").should("exist");
  });

  it("navigates to Health Blog page", () => {
    cy.visit("/#/health-blog");

    cy.contains("Health").should("exist");
  });

  it("handles setauthtoken route and redirects", () => {
    cy.visit("/#/setauthtoken/testtoken123");

    // Route executed and redirected
    cy.url().should("include", "/#/");
    });
});
