describe("ErrorBoundary (E2E)", () => {
  it("shows fallback UI when a component crashes", () => {
    cy.visit("/#/error-test");

    cy.contains("Something went wrong.").should("be.visible");
    cy.contains("Please try again or refresh the page.").should("be.visible");

    cy.contains("Refresh Page").should("be.visible");
  });

  it("reloads the page when Refresh Page is clicked", () => {
    cy.visit("/#/error-test");

    // Click refresh
    cy.contains("Refresh Page").click();

    // After reload, the error boundary UI should appear again
    // because CrashTest still throws
    cy.contains("Something went wrong.").should("be.visible");
    });
});
