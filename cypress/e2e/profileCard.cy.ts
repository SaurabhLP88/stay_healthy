describe("Profile Page (E2E)", () => {
  const mockUser = {
    name: "Saurabh",
    email: "saurabh@test.com",
    phone: "9876543210",
    speciality: "Cardiology",
    experience: 5,
  };

  beforeEach(() => {
    cy.visit("/#/profile", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("auth-token", "fake-token");
        win.sessionStorage.setItem("email", "saurabh@test.com");
        win.sessionStorage.setItem("role", "Patient");
        win.sessionStorage.setItem("name", "Saurabh");
      },
    });

    cy.intercept("GET", "**/api/auth/user", {
      statusCode: 200,
      body: mockUser,
    }).as("getProfile");
  });

  it("loads profile in view mode", () => {
    cy.wait("@getProfile");

    cy.contains("Your Profile").should("be.visible");
    cy.contains("Welcome, Saurabh").should("be.visible");
    cy.contains("Email:").parent().should("contain.text", mockUser.email);
    cy.contains("Phone:").parent().should("contain.text", mockUser.phone);
    cy.contains("Edit").should("be.visible");
  });

  it("enters edit mode", () => {
    cy.wait("@getProfile");

    cy.contains("Edit").click();

    cy.get("#email").should("be.disabled");
    cy.get("#name").should("have.value", mockUser.name);
    cy.get("#phone").should("have.value", mockUser.phone);
    cy.contains("Save").should("be.visible");
  });

  it("validates invalid phone number", () => {
    cy.wait("@getProfile");
    cy.contains("Edit").click();

    cy.get("#phone").clear().type("123");
    cy.contains("Save").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contain("Phone must be 10 digits");
    });
  });

  it("validates short password", () => {
    cy.wait("@getProfile");
    cy.contains("Edit").click();

    cy.get("#password").type("123");
    cy.contains("Save").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contain("Password must be at least 6 characters");
    });
  });

  it("updates profile successfully", () => {
    cy.intercept("PUT", "**/api/auth/user", {
      statusCode: 200,
      body: { success: true },
    }).as("updateProfile");

    cy.wait("@getProfile");
    cy.contains("Edit").click();

    cy.get("#name").clear().type("Updated Name");
    cy.get("#phone").clear().type("9999999999");
    cy.contains("Save").click();

    cy.wait("@updateProfile");

    cy.on("window:alert", (text) => {
      expect(text).to.contain("Profile Updated Successfully");
    });
  });

  it("toggles password visibility", () => {
    cy.wait("@getProfile");
    cy.contains("Edit").click();

    cy.get("#password")
      .should("have.attr", "type", "password");

    cy.get(".eye-icon").click();

    cy.get("#password")
      .should("have.attr", "type", "text"); 
  });

  it("redirects to login if not authenticated", () => {
    cy.visit("/#/profile", {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });

    cy.contains("Login", { timeout: 6000 }).should("be.visible");
  });
});
