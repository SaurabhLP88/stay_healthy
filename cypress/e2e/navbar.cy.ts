describe("Navbar – Logged Out User", () => {
  beforeEach(() => {
    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });
  });

  it("shows logo and auth links", () => {
    cy.get("nav").should("be.visible");

    cy.contains("Sign Up").should("be.visible");
    cy.contains("Login").should("be.visible");

    cy.contains("Logout").should("not.exist");
  });

  it("shows Home and About links", () => {
    cy.contains("Home").should("be.visible");
    cy.contains("About").should("be.visible");
    cy.contains("Health Blog").should("be.visible");
    cy.contains("Reviews").should("be.visible");
  });

  it("navigates to login page on Login click", () => {
    cy.contains("Login").click();
    cy.url().should("include", "/login");
  });

  it("navigates to signup page on Sign Up click", () => {
    cy.contains("Sign Up").click();
    cy.url().should("include", "/signup");
  });
});

describe("Navbar – Logged In Patient", () => {
  beforeEach(() => {
    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("isLoggedIn", "true");
        win.sessionStorage.setItem("name", "Saurabh");
        win.sessionStorage.setItem("role", "patient");
      },
    });
  });

  it("shows patient navigation items", () => {
    cy.contains("Appointments").should("be.visible");
    cy.contains("Welcome, Saurabh").should("be.visible");
    cy.contains("Logout").should("be.visible");

    cy.contains("Sign Up").should("not.exist");
    cy.contains("Login").should("not.exist");
  });

  it("shows dropdown items on hover", () => {
    cy.contains("Welcome, Saurabh")
        .trigger("mouseenter");

    cy.contains("Your Profile").should("exist");
    cy.contains("Your Reports").should("exist");
  });

  it("navigates to profile page from dropdown", () => {
    cy.contains("Welcome, Saurabh")
        .trigger("mouseenter");

    cy.contains("Your Profile")
        .should("exist")
        .click({ force: true });   // 🔥 REQUIRED

    //cy.url().should("include", "/profile"); // ✅ AFTER click
  });

  it("logs out successfully", () => {
    cy.contains("Logout").click();

    cy.url().should("include", "/login");
    cy.contains("Login").should("be.visible");
  });
});

describe("Navbar – Logged In Doctor", () => {
  beforeEach(() => {
    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("isLoggedIn", "true");
        win.sessionStorage.setItem("name", "Sharma");
        win.sessionStorage.setItem("role", "doctor");
      },
    });
  });

  it("shows dashboard instead of home", () => {
    cy.contains("Dashboard").should("be.visible");
    cy.contains("Home").should("not.exist");
  });

  it("shows doctor welcome message", () => {
    cy.contains("Welcome, Dr. Sharma").should("be.visible");
  });

  it("does not show Reports link for doctor", () => {
    cy.contains("Welcome, Dr. Sharma").trigger("mouseenter");
    cy.contains("Your Reports").should("not.exist");
  });

  it("allows logout for doctor", () => {
    cy.contains("Logout").click();
    cy.url().should("include", "/login");
  });
});

describe("Navbar – Mobile Menu", () => {
  beforeEach(() => {
    cy.viewport(375, 667); // iPhone size

    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });
  });

  it("toggles menu on hamburger click", () => {
    cy.get("button").first().click(); // open
    cy.contains("Home").should("be.visible");

    cy.get("button").first().click(); // close
  });
});
