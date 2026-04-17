// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginWithAdmin', () => {
    cy.fixture("users").then((user) => {
        const userData = Object.keys(user.admins);
        const randomAdmin = user.admins[userData[Math.floor(Math.random() * userData.length)]];
        cy.request({
            method: 'post',
            url: '/api/auth/login',
            body: {
                username: randomAdmin.username,
                password: randomAdmin.password
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
        })
    })
})

Cypress.Commands.add('loginWithUser', () => {
    cy.fixture("users").then((user) => {
        const userData = Object.keys(user.users);
        const randomUser = user.users[userData[Math.floor(Math.random() * userData.length)]];
        cy.request({
            method: 'post',
            url: '/api/auth/login',
            body: {
                username: randomUser.username,
                password: randomUser.password
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
        })
    })
})