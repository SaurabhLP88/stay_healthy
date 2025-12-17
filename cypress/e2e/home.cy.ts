describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/#/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("auth-token", "fake-token");
        win.sessionStorage.setItem("name", "Saurabh");
      },
    });

    // Ensure Home is mounted
    cy.get("nav").should("exist");
    cy.get("footer").should("exist");
  });

  it("renders Navbar and Footer", () => {
    cy.get("nav").should("exist");
    cy.get("footer").should("exist");
  });

  it("shows username from sessionStorage", () => {
    cy.contains("Saurabh").should("exist");
  });

  it("shows notification on new-notification event", () => {
    cy.window().then((win) => {
      win.sessionStorage.setItem("auth-token", "fake-token");
      win.sessionStorage.setItem("name", "Saurabh");

      // 🔑 force App.tsx to recompute loggedIn
      win.dispatchEvent(new Event("session-update"));
    });

    // ensure Home re-renders
    cy.get("nav").should("exist");

    cy.window().then((win) => {
      win.dispatchEvent(
        new CustomEvent("new-notification", {
          detail: {
            title: "Instant Booking",
            message: "<p>Doctor assigned</p>",
          },
        })
      );
    });

    // NOW this will exist
    cy.get('[data-testid="notification"]', { timeout: 6000 }).should("exist");
  });

  it("hides notification on notification-deleted event", () => {
    // 🔑 ensure loggedIn is true
    cy.window().then((win) => {
      win.sessionStorage.setItem("auth-token", "fake-token");
      win.dispatchEvent(new Event("session-update"));
    });

    // 🔔 show notification
    cy.window().then((win) => {
      win.dispatchEvent(
        new CustomEvent("new-notification", {
          detail: {
            title: "Instant Booking",
            message: "Doctor assigned",
          },
        })
      );
    });

    // ✅ Cypress will retry until React unmounts
    cy.get('[data-testid="notification"]', { timeout: 6000 }).should("not.exist");
  });

});
