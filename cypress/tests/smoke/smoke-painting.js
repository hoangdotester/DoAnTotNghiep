/// <reference types='cypress' />
describe('Smoke Test - Painting', () => {
    let token = '';
    let categoryIds = [];
    let paintingId = '';
    let dataTest = [];
    before(() => {
        cy.login('ADMIN').then((res) => {
            token = res.body.data.token;
        });

        cy.fixture("categoriesTest").then((data) => {
            dataTest = data.slice(0, 2);
        });
    });

    after(() => {
        cy.request({
            method: 'DELETE',
            url: `/api/paintings?paintingId=${paintingId}`,
            headers: { 'Authorization': `Bearer ${token}` },
            failOnStatusCode: false,
        });
        categoryIds.forEach(categoryId => {
            cy.request({
                method: 'DELETE',
                url: `/api/categories/delete/${categoryId}`,
                headers: { 'Authorization': `Bearer ${token}` },
                failOnStatusCode: false,
            });
        });

    });

    it('Verify that create painting works with uploaded image', () => {
        const fileName = '/testPicture/download.png';
        const folder = 'TEST';

        cy.uploadImage(fileName, folder, token).then((response) => {
            expect(response.status).to.eq(200);
            const imageUrl = response.body.data.secure_url;
            let count = 0;
            dataTest.forEach((category) => {
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
                        "imageUrl": imageUrl
                    },
                }).then((res) => {
                    expect(res.status).to.eq(200);
                    count++;
                    if (res.status === 200) {
                        categoryIds.push(res.body.data.categoryId);
                    };
                    if (count === dataTest.length) {
                        cy.request({
                            method: 'POST',
                            url: '/api/paintings/create',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: {
                                "name": "Tranh test",
                                "imageUrl": imageUrl,
                                "categoryIds": [categoryIds[0]],
                                "price": 150000,
                                "quantity": 5,
                                "size": "SIZE_30x40"
                            }
                        }).then((res) => {
                            expect(res.status).to.eq(200);
                            paintingId = res.body.data.paintingId;
                        });
                    }
                });
            });
        });
    });

    it('Verify that API get painting works correctly', () => {
        cy.request({
            method: 'GET',
            url: '/api/paintings',
            qs: {
                page: 1,
                size: 12,
                sort: 'name,asc'
            },
        }).then((res) => {
            expect(res.status).to.eq(200);
            const responseData = res.body.data;
            expect(responseData).to.have.property('items').and.be.an('array');
            expect(responseData.items).to.have.lengthOf(12);
            expect(responseData.totalItems).to.eq(23 + 1);
            expect(responseData.totalPages).to.eq(2);
            const firstItem = responseData.items[0];
            expect(firstItem).to.have.property('paintingId');
            expect(firstItem.price).to.be.a('number');
        });
    })
});