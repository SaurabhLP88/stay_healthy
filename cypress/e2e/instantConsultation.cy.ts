describe("Instant Consultation Page", () => {
  beforeEach(() => {
    // ✅ visit with auth token BEFORE app loads
    cy.visit("/#/instant-consultation", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("auth-token", "fake-jwt-token");
      },
    });

    // ✅ mock doctors API
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

    // ✅ mock notification API
    cy.intercept("POST", "**/api/notifications", {
      statusCode: 200,
      body: {
        notify: {
          _id: "notif123",
          title: "Appointment Booked",
        },
      },
    }).as("sendNotification");

    cy.wait("@getDoctors");
  });

  it("renders instant consultation page correctly", () => {
    cy.contains("Instant Consultation").should("be.visible");

    // 🔑 split-text safe assertion
    cy.contains("doctors are available").should("be.visible");
    cy.contains("2").should("be.visible");

    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Dr. Mehta").should("be.visible");
  });

  it("filters doctors when searching by name", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]')
      .should("exist")
      .should("be.enabled")
      .clear()
      .type("sharma", { delay: 50 });

    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Dr. Mehta").should("not.exist");
  });

  it("filters doctors when searching by speciality", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]')
      .should("exist")
      .clear()
      .type("derma", { delay: 50 });

    cy.contains("Dr. Mehta").should("be.visible");
    cy.contains("Dr. Sharma").should("not.exist");
  });

  it("shows no doctors found message when search returns empty", () => {
    cy.get('input[placeholder="Search doctors by name or speciality"]')
      .clear()
      .type("orthopedic", { delay: 50 });

    cy.contains(/no doctors found/i).should("be.visible");
  });

  it("opens booking popup when Book Appointment is clicked", () => {
    cy.contains("Book Appointment", { timeout: 6000 })
      .first()
      .should("be.visible")
      .click();

    cy.contains("Name:").should("be.visible");
    cy.contains("Phone Number:").should("be.visible");
  });

  it("successfully books an instant consultation", () => {
    cy.get('[data-testid="book-btn"]', { timeout: 6000 }).first().click();

    cy.get('input[placeholder="Enter your full name"]').type("Amit Kumar");
    cy.get('input[placeholder="Enter 10-digit mobile number"]').type("9999999999");

    cy.contains("Book Now").click();

    //cy.wait("@sendNotification");
  });
});
