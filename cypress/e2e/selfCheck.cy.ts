describe("Self Check Page (E2E)", () => {
  const mockMethods = [
    {
      title: "Check Heart Rate",
      image: "self.svg",
      description: "Measure your heart rate regularly to monitor heart health.",
    },
    {
      title: "Check Blood Pressure",
      image: "tips.svg",
      description: "Track blood pressure levels to avoid hypertension risks.",
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/api/selfCheck", {
      statusCode: 200,
      body: mockMethods,
    }).as("getSelfCheck");

    cy.visit("/#/self-check");

    // 🔑 Wait until first card title appears (real render signal)
    cy.contains("Check Heart Rate", { timeout: 8000 }).should("be.visible");
  });

  it("renders Self Check page header", () => {
    cy.contains("Self Health Checkup").should("be.visible");
  });

  it("renders Self Checkup Methods section", () => {
    cy.contains("Self Checkup Methods").should("be.visible");
  });

  it("renders method cards from API", () => {
    // Card titles
    cy.contains("Check Heart Rate").should("be.visible");
    cy.contains("Check Blood Pressure").should("be.visible");

    // Card count (uses actual card container class)
    cy.get(".grid > div").should("have.length", mockMethods.length);
  });

  it("shows Read More button initially", () => {
    cy.contains("Check Heart Rate")
      .parents(".bg-blue-50")
      .find("button")
      .should("contain.text", "Read More");
  });

  it("toggles Read More / Read Less", () => {
    const card = cy.contains("Check Heart Rate").parents(".bg-blue-50");

    card.contains("Read More").should("be.visible").click();
    card.contains("Read Less").should("be.visible");

    card.contains("Read Less").click();
    card.contains("Read More").should("be.visible");
  });

  it("expands only the clicked card", () => {
    const firstCard = cy.contains("Check Heart Rate").parents(".bg-blue-50");
    const secondCard = cy.contains("Check Blood Pressure").parents(".bg-blue-50");

    // Click Read More on first card
    firstCard.contains("Read More").click();

    // First card expanded
    firstCard.contains("Read Less").should("be.visible");

    // Second card remains collapsed
    secondCard.contains("Read More").should("be.visible");
  });
});
