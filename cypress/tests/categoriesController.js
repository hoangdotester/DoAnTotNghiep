/// <reference types='cypress' />

describe('Testing Categories Controller', () => {
    let token = '';
    let categoryId = [];
    before(() => {
        cy.login('ADMIN').then((res) => {
            token = res.body.data.token;
        });
    });

    it('Verify that API create is working correctly', () => {
        cy.fixture('categoriesTest').then((data) => {
            data.forEach((category) => {
                cy.request({
                    method: 'post',
                    url: '/api/categories/create',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: {
                        "categoryCode": category.categoryCode,
                        "name": category.name,
                        "description": category.description,
                        "imageUrl": category.imageUrl
                    },
                }).then((res) => {
                    expect(res.status).to.eq(200);
                    if (res.status === 200) {
                        categoryId.push(res.body.data.categoryId);
                    };
                });
            });
        });
    });

    it('Verify that API get all categories is working correctly', () => {
        cy.fixture('categoriesTest').then((testData) => {
            cy.request({
                method: 'get',
                url: '/api/categories',
                headers: { 'Authorization': `Bearer ${token}` }
            }).then((res) => {
                expect(res.status).to.eq(200);
                const code = res.body.data.map(item => item.categoryCode);
                const name = res.body.data.map(item => item.name);
                const description = res.body.data.map(item => item.description);
                const imageUrl = res.body.data.map(item => item.imageUrl);
                testData.forEach((testItem) => {
                    expect(code).to.include(testItem.categoryCode);
                    expect(name).to.include(testItem.name);
                    expect(description).to.include(testItem.description);
                    expect(imageUrl).to.include(testItem.imageUrl);
                });
            });
        });
    });

    it('Verify that API get category by ID is working correctly', () => {
        const randomNumber = Math.floor(Math.random() * categoryId.length);
        cy.fixture('categoriesTest').then((testData) => {
            cy.request({
                method: 'get',
                url: `/api/categories/${categoryId[randomNumber]}`,
                headers: { 'Authorization': `Bearer ${token}` }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.categoryCode).to.eq(testData[randomNumber].categoryCode);
                expect(res.body.data.name).to.eq(testData[randomNumber].name);
                expect(res.body.data.description).to.eq(testData[randomNumber].description);
                expect(res.body.data.imageUrl).to.eq(testData[randomNumber].imageUrl);
            });
        });
    })

    it('Verify that API update category is working correctly', () => {
        const randomNumber = Math.floor(Math.random() * categoryId.length);
        cy.fixture('categoriesTest').then((testData) => {
            cy.request({
                method: 'put',
                url: `/api/categories?categoryId=${categoryId[randomNumber]}`,
                headers: { 'Authorization': `Bearer ${token}` },
                body: {
                    "categoryCode": testData[randomNumber].categoryCode + '_afterUpdated',
                    "name": testData[randomNumber].name + '_afterUpdated',
                    "description": testData[randomNumber].description + '_afterUpdated',
                    "imageUrl": testData[randomNumber].imageUrl + '_afterUpdated'
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.categoryCode).to.eq(testData[randomNumber].categoryCode + '_afterUpdated');
                expect(res.body.data.name).to.eq(testData[randomNumber].name + '_afterUpdated');
                expect(res.body.data.description).to.eq(testData[randomNumber].description + '_afterUpdated');
                expect(res.body.data.imageUrl).to.eq(testData[randomNumber].imageUrl + '_afterUpdated');
            });
        });
    });

    it('Verify that can not create category with existing code', () => {
        cy.fixture('categoriesTest').then((testData) => {
            const randomNumber = Math.floor(Math.random() * testData.length);
            cy.request({
                method: 'post',
                url: '/api/categories/create',
                headers: { 'Authorization': `Bearer ${token}` },
                body: {
                    "categoryCode": testData[randomNumber].categoryCode,
                    "name": testData[randomNumber].name,
                    "description": testData[randomNumber].description,
                    "imageUrl": testData[randomNumber].imageUrl
                },
                failOnStatusCode: false,

            }).then((res) => {
                if (res.status === 200) {
                    categoryId.push(res.body.data.categoryId);
                }
                expect(res.status).to.eq(400);
            });

        });
    });

    it('Verify that can not create category without login', () => {
        cy.fixture('categoriesTest').then((testData) => {
            const randomNumber = Math.floor(Math.random() * testData.length);
            cy.request({
                method: 'post',
                url: '/api/categories/create',
                body: {
                    "categoryCode": testData[randomNumber].categoryCode,
                    "name": testData[randomNumber].name,
                    "description": testData[randomNumber].description,
                    "imageUrl": testData[randomNumber].imageUrl
                },
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(401);
            });
        });
    });

    after(() => {
        categoryId.forEach(id => {
            cy.request({
                method: 'delete',
                url: `/api/categories/delete/${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });

});