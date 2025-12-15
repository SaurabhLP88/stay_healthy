describe("Login Page", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

    cy.visit("/#/login");

    // wait until React mounts
    cy.contains("Login", { timeout: 10000 }).should("exist");

    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it("renders login form correctly", () => {
    cy.get("h1").contains("Login").should("be.visible");

    cy.contains("Login as").should("be.visible");

    cy.get('input[type="radio"][value="Doctor"]').should("exist");
    cy.get('input[type="radio"][value="Patient"]').should("exist");

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");

    cy.get('button[type="submit"]').should("contain.text", "Login");
  }); 

  it("shows validation errors when submitting empty form", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("Please select your role").should("be.visible");
  });

  it("shows error for invalid email", () => {
    cy.get('input[type="radio"][value="Patient"]').check({ force: true });

    cy.get('input[name="email"]')
        .clear()
        .type("invalidemail");

    cy.get('input[name="password"]')
        .clear()
        .type("password123");

    // ✅ MUST click the submit button, not text
    cy.get('button[type="submit"]').click();

    cy.contains("Enter a valid email", { timeout: 8000 })
        .should("be.visible");
 });

  it("toggles password visibility", () => {
    cy.get('input[name="password"]').type("secret123");

    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get('input[name="password"]')
      .parent()
      .find("span")
      .click();

    cy.get('input[name="password"]').should("have.attr", "type", "text");
  });

  it("logs in successfully as Patient (API mocked)", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        authtoken: "fake-token",
        role: "Patient",
        id: "user123",
        email: "patient@test.com",
        name: "Patient User",
      },
    }).as("loginRequest");

    cy.get('input[type="radio"][value="Patient"]').check();
    cy.get('input[name="email"]').type("patient@test.com");
    cy.get('input[name="password"]').type("password123");

    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest");

    cy.url().should("include", "/#/");

    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("isLoggedIn")).to.eq("true");
      expect(win.sessionStorage.getItem("role")).to.eq("Patient");
      expect(win.sessionStorage.getItem("userId")).to.eq("user123");
    });
  });

  it("switches to Forgot Password view", () => {
    cy.contains("Forgot Password?").click();

    cy.contains("Forgot Password").should("be.visible");
    cy.get("#forgotEmail").should("exist");

    cy.contains("Login Again?").click();
    cy.get("h1").contains("Login").should("be.visible");
  });
});
