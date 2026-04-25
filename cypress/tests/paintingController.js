// /// <reference types='cypress' />

// describe('Testing Painting Controller', () => {
//     let token = '';
//     before(() => {
//         cy.login('ADMIN').then((res) => {
//             token = res.body.data.token;
//         });
//     });

//     it('Verify that create painting works with uploaded image', () => {
//         const fileName = 'download.png'; // File bạn đang có trong hình Swagger
//         const folder = 'TEST';

//         // Bước 1: Upload ảnh trước
//         cy.uploadImage(fileName, folder).then((response) => {
//             expect(response.status).to.eq(200);
//             const imageUrl = response.body.data; // Đây là link Cloudinary trả về
//             cy.log('🔥 Image URL: ' + imageUrl);

//             // Bước 2: Dùng link ảnh này để tạo Painting
//             cy.request({
//                 method: 'POST',
//                 url: '/api/paintings/create',
//                 headers: { 'Authorization': `Bearer ${token}` },
//                 body: {
//                     "name": "Tranh phong cảnh 01",
//                     "imageUrl": imageUrl, // Nạp link vừa upload vào đây
//                     "categoryId": categoryIds[0], // Lấy từ mảng ID bạn đã tạo
//                     "price": 150000,
//                     "quantity": 5,
//                     "size": "MEDIUM"
//                 }
//             }).then((paintRes) => {
//                 expect(paintRes.status).to.eq(200);
//                 cy.log('✅ Tạo tranh thành công với ảnh thật!');
//             });
//         });
//     });
// })