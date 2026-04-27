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

Cypress.Commands.add('uploadImage', (fileName, folderName, token) => {
    // 1. Đọc file dưới dạng 'binary'
    return cy.fixture(fileName, 'binary').then((imageBin) => {
        // 2. Chuyển đổi sang Blob
        const blob = Cypress.Blob.binaryStringToBlob(imageBin, 'image/png');

        // 3. Khởi tạo FormData
        const formData = new FormData();
        formData.append('file', blob, fileName);

        // 4. DÙNG XMLHttpRequest (Cypress request không support FormData tốt)
        return new Cypress.Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${Cypress.config('baseUrl')}/api/files/upload/image?folder=${folderName}`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    // Ép kiểu về JSON để Cypress dùng được
                    resolve({ body: JSON.parse(xhr.response), status: xhr.status });
                } else {
                    reject(xhr.response);
                }
            };
            xhr.onerror = () => reject(xhr.response);
            xhr.send(formData);
        });
    });
});