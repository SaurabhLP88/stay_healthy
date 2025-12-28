describe("Sign Up Page", () => {
  beforeEach(() => {
    cy.visit("/#/signup");
  });

  it("renders signup form correctly", () => {
    cy.contains("Sign Up").should("be.visible");
    cy.contains("Already a member?").should("be.visible");

    cy.get("#patientRadio").check();

    cy.get("#name").should("exist");
    cy.get("#phone").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");

    cy.get("#doctorRadio").should("exist");
    cy.get("#patientRadio").should("exist");

    cy.contains("Submit").should("be.enabled");
    cy.contains("Reset").should("be.enabled");
  });

  it("shows validation errors on empty submit", () => {
    cy.get("form").within(() => {
        cy.contains("Submit").click();
    });

    cy.contains("Name is required");
    cy.contains("Phone is required");
    //cy.contains("Email is required");
    cy.contains("Password is required");
    cy.contains("Please select your role");
  });

  it("shows doctor-only fields when Doctor is selected", () => {
    cy.get("#doctorRadio").check();

    cy.get("#speciality").should("be.visible");
    cy.get("#experience").should("be.visible");
  });

  it("does not show doctor fields for Patient", () => {
    cy.get("#patientRadio").check();

    cy.get("#speciality").should("not.exist");
    cy.get("#experience").should("not.exist");
  });

  it("shows validation error for invalid phone", () => {
    cy.get("#patientRadio").check();

    cy.get("#name").type("Test User");
    cy.get("#phone").clear().type("123456789"); // 9 digits
    cy.get("#email").type("test@example.com"); // ✅ must be valid
    cy.get("#password").type("123");

    cy.contains("Submit").click();

    cy.contains("Enter valid 10-digit phone").should("be.visible");
    cy.contains("Password must be at least 6 characters").should("be.visible");
    });


  it("toggles password visibility", () => {
    cy.get("#password")
      .should("have.attr", "type", "password");

    cy.get("svg").last().click();
    cy.get("#password").siblings("span").click();
    cy.get("#password").parent().find("span").click();
    cy.get("#password").should("have.attr", "type", "text");
  });

  it("resets the form when Reset is clicked", () => {
    cy.get("#patientRadio").check();
    cy.get("#name").type("Reset Test");
    cy.get("#phone").type("9876543210");

    cy.contains("Reset").click();

    cy.get("#name").should("have.value", "");
    cy.get("#phone").should("have.value", "");
    cy.get("#patientRadio").should("not.be.checked");
  });

  it("successfully registers a Patient (mocked API)", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 200,
      body: {
        authtoken: "fake-jwt-token",
      },
    }).as("registerUser");

    cy.get("#patientRadio").check();
    cy.get("#name").type("Patient User");
    cy.get("#phone").type("9876543210");
    cy.get("#email").type("patient@test.com");
    cy.get("#password").type("password123");

    cy.get("form").within(() => {
        cy.contains("Submit").click();
    });

    cy.wait("@registerUser");

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Registration successful");
    });

    cy.url().should("include", "/login");
  });

  it("successfully registers a Doctor with speciality", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 200,
      body: {
        authtoken: "fake-doctor-token",
      },
    }).as("registerDoctor");

    cy.get("#doctorRadio").check();
    cy.get("#name").type("Doctor User");
    cy.get("#phone").type("9876543210");
    //cy.get("#email").type("doctor@test.com");
    cy.get('input[placeholder="username"]').type("doctoruser");
    cy.get("#password").type("password123");
    cy.get("#speciality").select(1);
    cy.get("#experience").type("5");

    cy.get("form").within(() => {
        cy.contains("Submit").click();
    });

    cy.wait("@registerDoctor");

    cy.url().should("include", "/login");
  });
});
