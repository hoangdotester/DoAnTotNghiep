/// <reference types='cypress' />

const { random } = require("lodash");

describe('Testing coupons-controller ', () => {
    let createdId = [];
    let authToken = '';
    before(() => {
        cy.login('ADMIN').then((res) => {
            authToken = res.body.data.token;
        });
    })
    it('Verify that API create coupons working!! ', () => {
        cy.fixture('couponsTest').then((coupons) => {
            coupons.forEach((coupon) => {
                cy.request({
                    method: 'post',
                    url: '/api/coupons/create',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
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
    })

    it('Verify that API get all coupons working!!', () => {
        cy.request({
            method: 'get',
            url: '/api/coupons',
        }).then((res) => {
            expect(res.status).to.eq(200);
        })
    })

    it('Verify that API get coupon by CODE working!!', () => {
        cy.fixture('couponsTest').then((coupons) => {
            const couponData = Object.keys(coupons);
            const randomCoupon = coupons[couponData[Math.floor(Math.random() * couponData.length)]];
            cy.request({
                method: 'get',
                url: `/api/coupons/${randomCoupon.code}`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((res) => {
                expect(res.status).to.eq(200);
                cy.log(JSON.stringify(res.body.data.code));
            })
        });

    })

    after(() => {
        if (createdId.length > 0) {
            cy.request({
                method: 'delete',
                url: '/api/coupons/cleanup',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: createdId
            }).then((res) => {
                expect(res.status).to.eq(200);
            })
        }
    })
})