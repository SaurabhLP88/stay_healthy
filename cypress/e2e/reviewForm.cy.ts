describe("ReviewForm (E2E)", () => {
  beforeEach(() => {
    cy.visit("/#/review-form-test"); 

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });
  });

  it("renders the review form", () => {
    cy.contains("Give Review for").should("be.visible");
    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Submit Feedback").should("be.visible");
  });

  it("shows validation warning on empty submit", () => { 
    cy.contains("Submit Feedback").click();

    cy.contains("Please fill out all fields before submitting.")
      .should("be.visible");
  });

  it("submits review successfully", () => {
    cy.get('input[name="title"]').type("Excellent Doctor");

    cy.get('textarea[name="description"]')
        .type("Very professional and helpful");

    // ⭐ FIXED STAR CLICK
    cy.get("span")
        .filter(":contains('★')")
        .eq(4)
        .click();

    cy.contains("Submit Feedback").click();

    cy.get("@alert").should("have.been.calledWith", "Review Submitted");
  });
});
