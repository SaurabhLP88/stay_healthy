// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'dkp6ur',
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // node events (optional)
    },
  },
});
