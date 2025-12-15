describe("Notification (E2E)", () => {
  beforeEach(() => {
    cy.visit("/#/notification-test");
  });

  it("shows notification bell initially", () => {
    cy.get(".fixed.bottom-\\[80px\\].right-5")
      .find("button")
      .should("have.length", 1);
  });

  it("opens notification when bell is clicked", () => {
    cy.get(".fixed.bottom-\\[80px\\].right-5")
      .find("button")
      .first()
      .click();

    cy.contains("Appointment Booked").should("be.visible");
  });

  it("closes notification when close button is clicked", () => {
    // open
    cy.get(".fixed.bottom-\\[80px\\].right-5")
      .find("button")
      .first()
      .click();

    // close
    cy.get(".fixed.bottom-\\[80px\\].right-5")
      .find("button")
      .last()
      .click();

    // bell visible again
    cy.get(".fixed.bottom-\\[80px\\].right-5")
      .find("button")
      .should("have.length", 1);
  });
});
