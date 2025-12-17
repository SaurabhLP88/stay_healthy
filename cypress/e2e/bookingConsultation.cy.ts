describe("Booking Consultation Page", () => {
  beforeEach(() => {
    cy.visit("/#/book-consultation", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("auth-token", "fake-jwt-token");
      },
    });

    cy.intercept("GET", "**/api/doctors", {
      statusCode: 200,
      body: [
        {
          _id: "1",
          name: "Dr. Sharma",
          speciality: "Cardiology",
          experience: 10,
          ratings: 4,
          image: "doctor1.png",
        },
        {
          _id: "2",
          name: "Dr. Mehta",
          speciality: "Dermatologist",
          experience: 8,
          ratings: 5,
          image: "doctor1.png",
        },
      ],
    }).as("getDoctors");

    cy.intercept("POST", "**/api/notifications", {
      statusCode: 200,
      body: { notify: { _id: "notif456" } },
    }).as("sendNotification");

    cy.wait("@getDoctors");
  });

  it("renders booking consultation page correctly", () => {
    cy.contains("2 doctors are available").should("be.visible");
    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Dr. Mehta").should("be.visible");
  });

  it("filters doctors by name", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]').type("Sharma");
    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Dr. Mehta").should("not.exist");
  });

  it("filters doctors by speciality", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]').clear().type("Dermatologist");
    cy.contains("Dr. Mehta").should("be.visible");
    cy.contains("Dr. Sharma").should("not.exist");
  });

  it("shows no doctors found message", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]').clear().type("Orthopedic");
    cy.contains("No doctors found").should("be.visible");
  });

  it("successfully books a scheduled appointment", () => {
    cy.get('[data-testid="book-btn"]', { timeout: 6000 }).first().click();

    cy.get('input[placeholder="Enter your full name"]').type("Amit Kumar");
    cy.get('input[placeholder="Enter 10-digit mobile number"]').type("9999999999");

    cy.get('input[type="date"]').type("2025-12-31");

    // ✅ WAIT for options, then select by index
    cy.get("select")
      .should("be.visible")
      .find("option")
      .should("have.length.greaterThan", 1);

    cy.get("select").select(1);

    cy.contains("Book Now").click();
  });
});
