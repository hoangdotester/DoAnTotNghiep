/// <reference types='cypress' />
describe('Smoke Test - Category', () => {
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
});