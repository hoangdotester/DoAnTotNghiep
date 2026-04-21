/// <reference types='cypress' />

describe('Testing auth-controller ', () => {
    it('Verify that forgot-password API working with valid Email ', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.USER);
            const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
            cy.request({
                method: 'post',
                url: '/api/auth/forgot-password',
                qs: {
                    email: randomUser.email,
                },
            }).then((res) => {
                expect(res.status).to.eq(200);
                cy.log(randomUser.email)
            })
        })
    })

    it('Login susseccfully, response 200 and role ADMIN', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.ADMIN);
            const randomAdmin = user.ADMIN[userData[Math.floor(Math.random() * userData.length)]];
            cy.request({
                method: 'post',
                url: '/api/auth/login',
                body: {
                    username: randomAdmin.username,
                    password: randomAdmin.password
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                // cy.log(JSON.stringify(res.body.data.user.role));
                expect(res.body.data.user.role).to.eq('ADMIN');
            })
        })
    })

    it('Login susseccfully, response 200 and role USER', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.USER);
            const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
            cy.request({
                method: 'post',
                url: '/api/auth/login',
                body: {
                    username: randomUser.username,
                    password: randomUser.password
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.user.username).to.eq(randomUser.username);
                expect(res.body.data.user.role).to.eq('USER');
            })
        })
    })

    it('Login false with correct username and wrong password', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.USER);
            const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
            const randomString = randomUser.password + Math.random().toString(36).substring(2, 10);
            cy.request({
                method: 'post',
                url: '/api/auth/login',
                failOnStatusCode: false,
                body: {
                    username: randomUser.username,
                    password: randomString
                }
            }).then((res) => {
                expect(res.status).to.eq(401);
                cy.log(randomUser.username + "|" + randomString);
            })
        })
    })

    it('Login false with wrong username and correct password', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.USER);
            const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
            const randomString = randomUser.username + Math.random().toString(36).substring(2, 10);
            cy.request({
                method: 'post',
                url: '/api/auth/login',
                failOnStatusCode: false,
                body: {
                    username: randomString,
                    password: randomUser.password
                }
            }).then((res) => {
                expect(res.status).to.eq(401);
                cy.log(randomString + "|" + randomUser.password);
            })
        })
    })

    it('Test refresh token and compare old token with new token', () => {
        cy.login("ADMIN").then((res) => {
            const oldToken = res.body.data.token;
            cy.request({
                method: 'post',
                url: '/api/auth/refresh',
                body: {
                    token: oldToken,
                }
            }).then((res) => {
                const newToken = res.body.data.token;
                // expect(res.status).to.eq(200);
                expect(newToken).to.not.eq(oldToken);
                // Cypress.env('newToken', res.body.data.token);
                cy.checkAccountWithToken(newToken, true);
                cy.checkAccountWithToken(oldToken, false);
            })
        })
    })

    it('Test API logout', () => {
        cy.login("USER").then((res) => {
            cy.log(res.body.data.user.username);
            const currentToken = res.body.data.token
            cy.request({
                method: 'post',
                url: '/api/auth/logout',
                body: {
                    token: currentToken,
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                cy.checkAccountWithToken(currentToken, false)
            })
        })
    })

    it('Verify that OTP send from API Forgot-password is working ', () => {
        cy.fixture("users").then((user) => {
            const userData = Object.keys(user.USER);
            const randomUser = user.USER[userData[Math.floor(Math.random() * userData.length)]];
            cy.wait(5000)
            cy.sendOTP(randomUser.email);
            cy.wait(2000);
            cy.getOTPFromMailtrap(randomUser.email).then((otp) => {
                cy.log('OTP: ' + otp);
                expect(otp).to.have.length(6);
            })
        })
    })

    it('Verify that the reset password API is working well', () => {
        cy.fixture('users').then((user) => {
            const data = Object.keys(user.ADMIN)[0];
            cy.wait(5000)
            cy.sendOTP(user.ADMIN[data].email);
            cy.getOTPFromMailtrap(user.ADMIN[data].email).then((otp) => {
                cy.request({
                    method: 'post',
                    url: '/api/auth/reset-password',
                    body: {
                        email: user.ADMIN[data].email,
                        otp: otp,
                        newPassword: 'Admin@123'
                    }
                }).then((res) => {
                    expect(res.status).to.eq(200);
                    cy.request({
                        method: 'post',
                        url: '/api/auth/login',
                        body: {
                            username: 'admin',
                            password: 'Admin@123'
                        }
                    }).then((res) => {
                        expect(res.status).to.eq(200);
                    })
                })
            })
        })
    })
})