const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: true,

  e2e: {
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'http://localhost:8080',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      // apiUrl: 'http://localhost:8080/api', // URL của Backend Java
      //   username_admin: 'admin',
      //   password_admin: 'Admin@123',
      // allowCypressEnv : true
    },
    specPattern: [
      "./cypress/tests/regression/**.*",
      "./cypress/tests/smoke/**.*"
    ],
  },
});
