describe("Health Tips Page", () => {
  const mockTips = [
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water a day.",
      image: "water.svg",
    },
    {
      title: "Exercise Regularly",
      description: "30 minutes of exercise keeps you healthy.",
      image: "exercise.svg",
    },
  ];

  beforeEach(() => {
    // Mock API before visit
    cy.intercept("GET", "**/api/healthtips", {
      statusCode: 200,
      body: mockTips,
    }).as("getHealthTips");

    cy.visit("/#/health-tips");
    cy.wait("@getHealthTips");
  });

  it("renders page title and description", () => {
    cy.contains("Health Tips").should("be.visible");
    cy.contains(
      "Small daily habits can make a big difference in your long-term health."
    ).should("be.visible");
  });

  it("renders health tips from API", () => {
    cy.contains("Stay Hydrated").should("exist");
    cy.contains("Exercise Regularly").should("exist");

    cy.contains("Drink at least 8 glasses of water a day.").should("exist");
    cy.contains("30 minutes of exercise keeps you healthy.").should("exist");
  });

  it("renders images for each health tip", () => {
    cy.get(".grid > div").should("have.length", mockTips.length);
    cy.get(".grid > div img").should("have.length", mockTips.length);
    cy.get(".grid > div img").first().should("have.attr", "src").and("include", "water");
  });

  it("renders correct number of tip cards", () => {
    cy.get(".grid > div").should("have.length", mockTips.length);
  });
});
