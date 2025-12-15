describe("Appointments Page", () => {
  //Cypress.on("window:confirm", () => true);
  const mockAppointments = [
    {
      _id: "appt1",
      patientName: "Saurabh",
      phoneNumber: "9876543210",
      bookingType: "scheduled",
      doctorName: "Dr. Sharma",
      doctorSpeciality: "Cardiology",
      appointmentDate: "2025-01-20",
      appointmentTime: "2025-01-20T10:30:00.000Z",
      status: "completed",
      hasReview: false,
      userId: "user1",
      doctorId: "doc1",
    },
  ];

  beforeEach(() => {
    //Cypress.on("window:confirm", () => true);
    // Simulate logged-in patient
    cy.window().then((win) => {
      win.sessionStorage.setItem("auth-token", "fake-token");
      win.sessionStorage.setItem("email", "test@user.com");
      win.sessionStorage.setItem("role", "patient");
    });
  });

  it("redirects to login if not authenticated", () => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    cy.visit("/#/appointments");
    cy.url().should("include", "/login");
  });

  it("shows loading state initially", () => {
    cy.intercept("GET", "**/api/appointments/my", (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send([]);
      });
    });

    cy.visit("/#/appointments");
    cy.contains("Loading appointments").should("be.visible");
  });

  it("renders appointments table for patient", () => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: mockAppointments,
    }).as("getAppointments");

    cy.visit("/#/appointments");
    cy.wait("@getAppointments");

    cy.contains("Your Appointments").should("be.visible");

    // Table headers (patient view)
    cy.contains("Doctor Name").should("be.visible");
    cy.contains("Speciality").should("be.visible");
    cy.contains("Status").should("be.visible");

    // Row data
    cy.contains("Dr. Sharma").should("be.visible");
    cy.contains("Cardiology").should("be.visible");
    cy.contains("Completed").should("be.visible");
  });

  it("shows empty state when no appointments exist", () => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: [],
    });

    cy.visit("/#/appointments");

    cy.contains("You don’t have any appointments yet.").should("be.visible");
    cy.contains("Book one now").should("be.visible");
  });

  it("shows Book Again button for completed appointment", () => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: mockAppointments,
    });

    cy.visit("/#/appointments");

    cy.contains("Book Again").should("be.visible");
  });

  it("opens Add Review flow for completed appointment without review", () => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: mockAppointments,
    });

    cy.visit("/#/appointments");

    cy.contains("Add Review").click();

    cy.get("form").should("exist");
  });

  it("cancels appointment (mocked)", () => {
    const bookedAppt = {
      ...mockAppointments[0],
      status: "booked",
    };

    const cancelledAppt = {
      ...bookedAppt,
      status: "cancelled",
    };

    cy.intercept(
      { method: "GET", url: "**/api/appointments/my", times: 1 },
      { body: [bookedAppt] }
    ).as("getAppointments");

    cy.intercept(
      "DELETE",
      "**/api/appointments/cancel/*",
      { statusCode: 200, body: { success: true } }
    ).as("cancelAppointment");

    cy.intercept(
      { method: "GET", url: "**/api/appointments/my", times: 1 },
      { body: [cancelledAppt] }
    ).as("refetchAppointments");

    cy.visit("/#/appointments", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("auth-token", "fake-token");
        win.sessionStorage.setItem("email", "test@user.com");
        win.sessionStorage.setItem("role", "patient");
      },
    });

    cy.contains("Your Appointments").should("be.visible");
    cy.contains("Cancel").should("be.visible").click();

    //cy.wait("@cancelAppointment");
    cy.wait("@refetchAppointments");

    cy.contains("Cancelled").should("be.visible");
  });


});
