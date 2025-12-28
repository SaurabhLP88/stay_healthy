describe("Reviews Page (E2E)", () => {

  /* ---------------------------
     PUBLIC (Logged Out)
  ---------------------------- */
  it("shows public reviews when user is logged out", () => {
    cy.intercept("GET", "**/api/reviews/public", {
      statusCode: 200,
      body: {
        reviews: [
          {
            doctorName: "Dr. Sharma",
            speciality: "Cardiology",
            title: "Great Doctor",
            review: "Very professional and kind",
            rating: 4,
          },
        ],
      },
    }).as("getPublicReviews");

    cy.visit("/#/reviews", {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });

    cy.wait("@getPublicReviews");

    cy.contains("Reviews for Doctors").should("be.visible");
    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Cardiology").should("be.visible");
    cy.contains("Great Doctor").should("be.visible");
    cy.contains("⭐⭐⭐⭐").should("be.visible");
  });

  /* ---------------------------
     PATIENT REVIEWS
  ---------------------------- */
  it("shows patient submitted reviews when patient is logged in", () => {
    cy.intercept("GET", "**/api/reviews/patient/*", {
      statusCode: 200,
      body: {
        reviews: [
          {
            doctorName: "Dr. Mehta",
            speciality: "Dermatology",
            title: "Helpful",
            review: "Solved my issue quickly",
            rating: 5,
          },
        ],
      },
    }).as("getPatientReviews");

    cy.visit("/#/reviews", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("role", "patient");
        win.sessionStorage.setItem("userId", "user123");
      },
    });

    cy.wait("@getPatientReviews");

    cy.contains("Reviews for Doctors").should("be.visible");
    cy.contains("Dr. Mehta").should("be.visible");
    cy.contains("Dermatology").should("be.visible");
    cy.contains("Solved my issue quickly").should("be.visible");
    cy.contains("⭐⭐⭐⭐⭐").should("be.visible");
  });

  /* ---------------------------
     DOCTOR REVIEWS
  ---------------------------- */
  it("shows reviews received by doctor when doctor is logged in", () => {
    cy.intercept("GET", "**/api/reviews/doctor/*", {
      statusCode: 200,
      body: {
        reviews: [
          {
            patientName: "Rahul",
            phone: "9999999999",
            title: "Excellent",
            review: "Very caring doctor",
            rating: 5,
            createdAt: "2025-01-01T10:00:00Z",
          },
        ],
      },
    }).as("getDoctorReviews");

    cy.visit("/#/reviews", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("role", "doctor");
        win.sessionStorage.setItem("doctorId", "doc123");
      },
    });

    cy.wait("@getDoctorReviews");

    cy.contains("Reviews by Patients").should("be.visible");
    cy.contains("Rahul").should("be.visible");
    cy.contains("9999999999").should("be.visible");
    cy.contains("Very caring doctor").should("be.visible");
    cy.contains("⭐⭐⭐⭐⭐").should("be.visible");
  });

  /* ---------------------------
     EMPTY STATE
  ---------------------------- */
  it("shows empty state when no reviews exist", () => {
    cy.intercept("GET", "**/api/reviews/patient/*", {
      statusCode: 200,
      body: { reviews: [] },
    }).as("getEmptyReviews");

    cy.visit("/#/reviews", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("role", "patient");
        win.sessionStorage.setItem("userId", "user123");
      },
    });

    cy.wait("@getEmptyReviews");
    cy.contains("No reviews available").should("be.visible");
  });

});
