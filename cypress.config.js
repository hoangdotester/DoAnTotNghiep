const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'http://localhost:8080',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // apiUrl: 'http://localhost:8080/api', // URL của Backend Java
      username_admin: 'admin',
      password_admin: 'Admin@123'
    },
    specPattern: [
      "./cypress/tests/**.*",
      // "./cypress/tests/Smoke/**.*"
    ],
  },
});
