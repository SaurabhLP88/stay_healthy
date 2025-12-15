describe("Health Blog Page", () => {
  const mockVideos = [
    {
      category: "Fitness",
      title: "Morning Stretch",
      description: "Simple stretching routine for flexibility and energy.",
      thumbnail: "exercise.svg",
      videofile: "stretch.mp4",
    },
    {
      category: "Diet",
      title: "Healthy Plate",
      description: "Learn how to build a balanced healthy plate.",
      thumbnail: "meal.svg",
      videofile: "diet.mp4",
    },
  ];

  const mockTips = [
    {
      title: "Drink Water",
      description: "Drink at least 8 glasses of water daily.",
    },
    {
      title: "Daily Walk",
      description: "Walk for 30 minutes every day.",
    },
  ];

  beforeEach(() => {
    // 🔥 INTERCEPT FIRST
    cy.intercept("GET", "**/api/healthblog", {
      statusCode: 200,
      body: mockVideos,
    }).as("getVideos");

    cy.intercept("GET", "**/api/healthtips", {
      statusCode: 200,
      body: mockTips,
    }).as("getTips");

    // 🔥 THEN VISIT
    cy.visit("/#/health-blog");

    // 🔥 WAIT FOR UI, NOT JUST NETWORK
    cy.contains("Morning Stretch").should("be.visible");
    cy.contains("Drink Water").should("be.visible");
  });

  it("renders page header", () => {
    cy.contains("Health Blog").should("be.visible");
    cy.contains("Stay informed with medical news").should("be.visible");
  });

  it("renders videos from API", () => {
    cy.contains("Morning Stretch").should("be.visible");
    cy.contains("Healthy Plate").should("be.visible");
  });

  it("filters videos by category", () => {
    cy.contains("Diet").click();

    cy.contains("Healthy Plate").should("be.visible");
    cy.contains("Morning Stretch").should("not.exist");
  });

  it("searches videos safely", () => {
    cy.get('input[placeholder="Search videos and tips..."]')
      .should("be.enabled")
      .type("stretch");

    cy.contains("Morning Stretch").should("be.visible");
    cy.contains("Healthy Plate").should("not.exist");
  });

  it("expands and collapses video description", () => {
    cy.contains("Read More").first().click();
    cy.contains("Simple stretching routine").should("be.visible");

    cy.contains("Read Less").first().click();
  });

  /*it("opens and closes video modal", () => {
    cy.contains("Watch Video").first().click();

    cy.get('[data-testid="health-video"]').should("be.visible");

    cy.contains("×").click();
    cy.get('[data-testid="health-video"]').should("not.exist");
  });*/

  it("renders daily health tips", () => {
    cy.contains("Drink Water").should("be.visible");
    cy.contains("Daily Walk").should("be.visible");
  });

  it("expands and collapses daily tips", () => {
    cy.contains("Drink Water").click();
    cy.contains("8 glasses of water").should("be.visible");

    cy.contains("Drink Water").click();
    cy.contains("8 glasses of water").should("not.exist");
  });

});

describe("Health Blog Empty States", () => {

  it("shows 'No videos found.'", () => {
    cy.intercept("GET", "**/api/healthblog", {
      statusCode: 200,
      body: [],
    });

    cy.intercept("GET", "**/api/healthtips", {
      statusCode: 200,
      body: [],
    });

    cy.visit("/#/health-blog");

    cy.contains("No videos found.").should("be.visible");
  });

  it("shows 'No daily tips found.'", () => {
    cy.intercept("GET", "**/api/healthblog", {
      statusCode: 200,
      body: [],
    });

    cy.intercept("GET", "**/api/healthtips", {
      statusCode: 200,
      body: [],
    });

    cy.visit("/#/health-blog");

    cy.contains("No daily tips found.").should("be.visible");
  });

});

