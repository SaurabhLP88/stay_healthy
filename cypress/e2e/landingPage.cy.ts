describe("Landing Page – Public User", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    cy.visit("/#/");
  });

  it("shows hero section for public users", () => {
    cy.contains("Your Health").should("be.visible");
    cy.contains("Our Responsibility").should("be.visible");
    cy.contains("Get Started").should("be.visible");
  });

  it("reveals services section after clicking Get Started", () => {
    cy.contains("Get Started").click();

    cy.get("#services").should("be.visible");
    cy.contains("Best Services").should("be.visible");
  });
});


describe("Landing Page – Services Navigation (Logged Out)", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    cy.visit("/#/");
    cy.contains("Get Started").click();
  });

  it("redirects to login when clicking Instant Consultation", () => {
    cy.contains("Instant Consultation").click();
    cy.url().should("include", "/login");
  });

  it("redirects to login when clicking Book Appointment", () => {
    cy.contains("Book an Appointment").click();
    cy.url().should("include", "/login");
  });

  it("navigates to Self Checkup page", () => {
    cy.contains("Self Checkup").click();
    cy.url().should("include", "/self-check");
  });

  it("navigates to Health Tips page", () => {
    cy.contains("Health Tips & Guidance").click();
    cy.url().should("include", "/health-tips");
  });
});

describe("Landing Page – Logged-in Patient", () => {
  beforeEach(() => {
    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("isLoggedIn", "true");
        win.sessionStorage.setItem("role", "patient");
      },
    });
  });

  it("shows hero section (patient)", () => {
    cy.contains("Get Started").should("be.visible");
  });

  it("allows navigation to Instant Consultation", () => {
    cy.contains("Get Started").click();
    cy.contains("Instant Consultation").click();
    cy.url().should("include", "/instant-consultation");
  });
});

describe("Landing Page – Doctor Dashboard", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/doctors/stats*", {
      statusCode: 200,
      body: {
        today: 3,
        pending: 2,
        completed: 5,
        cancelled: 1,
        totalInstantAppointments: 4,
        totalScheduledAppointments: 6,
        doctor: {
          name: "Sharma",
          speciality: "Cardiology",
          experience: 10,
          phone: "9876543210",
          email: "dr.sharma@test.com",
          image: "instant.svg", // ✅ EXISTING IMAGE
        },
        next: {
          patient: "Rahul",
          phone: "9999999999",
          date: "20/01/2025",
          time: "10:30 AM",
        },
      },
    }).as("getDoctorStats");

    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("isLoggedIn", "true");
        win.sessionStorage.setItem("role", "doctor");
        win.sessionStorage.setItem("doctorId", "doc123");
      },
    });

    cy.wait("@getDoctorStats"); // ✅ CRITICAL
  });

  it("shows doctor dashboard", () => {
    cy.contains("Doctor Dashboard").should("be.visible");
    cy.contains("Welcome, Dr. Sharma").should("be.visible");
  });

  it("shows next appointment details", () => {
    cy.contains("Rahul").should("be.visible");
    cy.contains("9999999999").should("be.visible");
  });
});

