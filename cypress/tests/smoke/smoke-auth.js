/// <reference types='cypress' />
describe('Smoke Test - Authentication', () => {
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
});