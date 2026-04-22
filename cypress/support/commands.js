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


Cypress.Commands.add('login', (role) => {
    cy.fixture("users").then((user) => {
        const userData = Object.keys(user[role]);
        const randomUser = user[role][userData[Math.floor(Math.random() * userData.length)]];
        cy.request({
            method: 'post',
            url: '/api/auth/login',
            body: {
                username: randomUser.username,
                password: randomUser.password
            }
        }).then((res) => {
            // expect(res.status).to.eq(200);
            Cypress.env('res', res);
        })
    })
})


Cypress.Commands.add('checkAccountWithToken', (token, result) => {
    cy.request({
        method: 'post',
        url: '/api/auth/introspect',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {

            "token": token,

        },
        failOnStatusCode: false,

    }).then((res) => {
        // expect(res.status).to.eq(200);
        expect(res.body.data.valid).to.eq(result)
    })
})

// Cypress.Commands.add('sendOTP', () => {
//     cy.fixture("users").then((user) => {
//         const userData = Object.keys(user.USER);
//         const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
//         cy.request({
//             method: 'post',
//             url: '/api/auth/forgot-password',
//             qs: {
//                 email: randomUser.email,
//             },
//         }).then((res) => {
//             expect(res.status).to.eq(200);
//             cy.log(randomUser.email)
//         })
//     })
// })

Cypress.Commands.add('sendOTP', (email) => {
    cy.request({
        method: 'post',
        url: '/api/auth/forgot-password',
        qs: {
            email: email,
        },
    }).then((res) => {
        expect(res.status).to.eq(200);
    })
})

Cypress.Commands.add('getOTPFromMailtrap', (userEmail) => {
    const accountId = '2691891';
    const inboxId = '4559397';
    const apiToken = 'd1659c800388cc95e50088d66dae8f87';
    return cy.request({
        method: 'GET',
        url: `https://mailtrap.io/api/accounts/${accountId}/inboxes/${inboxId}/messages`,
        headers: { 'Api-Token': apiToken }
    }).then((res) => {
        const message = res.body.find(msg => msg.to_email === userEmail);

        if (!message) {
            throw new Error(`Không tìm thấy mail nào gửi đến ${userEmail}`);
        }
        return cy.request({
            method: 'GET',
            url: `https://mailtrap.io/api/accounts/${accountId}/inboxes/${inboxId}/messages/${message.id}/body.html`,
            headers: { 'Api-Token': apiToken }
        });
    }).then((res) => {
        const fullBody = res.body;
        const otpCode = fullBody.match(/\d{6}/)[0];
        return otpCode;
    });
});