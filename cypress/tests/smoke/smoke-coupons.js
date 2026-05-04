/// <reference types='cypress' />
describe('Smoke Test - Coupons', () => {
    let coupons = [];
    let createdId = [];
    let adminToken = '';
    let userToken = '';
    before(() => {
        cy.fixture('couponsTest').then((data) => {
            coupons = data;
        });

        cy.login('ADMIN').then((res) => {
            adminToken = res.body.data.token;
        });

        cy.login('USER').then((res) => {
            userToken = res.body.data.token;
        });
    })

    after(() => {
        if (createdId.length > 0) {
            cy.request({
                method: 'delete',
                url: '/api/coupons/cleanup',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                body: createdId
            }).then((res) => {
                expect(res.status).to.eq(200);
            })
        }
    })

    it('Verify that API create coupons successfully with admin account!! ', () => {
        const coupon = coupons.slice(0, coupons.length / 2);
        coupon.forEach((coupon) => {
            cy.request({
                method: 'post',
                url: '/api/coupons/create',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                body: {
                    "createdAt": Date.now().toString(),
                    "updatedAt": Date.now().toString(),
                    "code": coupon.code,
                    "imageUrl": coupon.imageUrl,
                    "description": "This coupon for test",
                    "condition": "Test",
                    "discountPercentage": coupon.discountPercentage,
                    "startDate": Date.now().toString(),
                    "endDate": (Date.now() + (365 * 24 * 60 * 60 * 1000)).toString(),
                    "isPublic": true,
                    "active": true
                }
            }).then((res) => {
                createdId.push(res.body.data.couponId);
            })
        });
    })
});