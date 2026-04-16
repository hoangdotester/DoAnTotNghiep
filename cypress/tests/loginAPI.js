/// <reference types='cypress' />

describe(' this test for loginAPI ', () => {
    it('this test must response 200 ', () => {
        cy.request({
            method: 'post',
            url: '/api/auth/login',
            body: {
                username: 'admin1',
                password: 'Admin@123'
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
        })
    })
})