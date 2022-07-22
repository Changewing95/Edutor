// const path = require('path');
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//        if (file.fieldname === "tutorialImageUpload") {
//            cb(null, './public/uploads/' + req.user.id + '/')
//        }
//        else if (file.fieldname === "video") {
//            cb(null, './uploads/videos/'+ req.user.id + '/');
//        }
//     },
//     filename:(req,file,cb)=>{
//         if (file.fieldname === "tutorialImageUpload") {
//             cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
//         }
//       else if (file.fieldname === "video") {
//         cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
//       }
      
//     }
// });
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10
//     },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).fields(
//     [
//         {
//             name:'tutorialImageUpload',
//             maxCount:1
//         },
//         {
//             name: 'video', maxCount:1
//         }
//     ]
// );

// function checkFileType(file, cb) {
//     if (file.fieldname === "certificate") {
//         if (
//             file.mimetype === 'video/mp4' 
           
//           ) { // check file type to be pdf, doc, or docx
//               cb(null, true);
//           } else {
//               cb(null, false); // else fails
//           }
//     }
//     else if (file.fieldname === "tutorialImageUpload"){
//         if (
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpg' ||
//             file.mimetype === 'image/jpeg'||
//             fiel.mimetype==='image/gif'
//           ) { // check file type to be png, jpeg, or jpg
//             cb(null, true);
//           } else {
//             cb(null, false); // else fails
//           }
//         }
//     }
//     module.exports = upload;


















// // const multer = require('multer');
// // const path = require('path');
// // // Set Storage Engine
// // const storage = multer.diskStorage({
// //     destination: (req, file, callback) => {
// //         callback(null, './public/uploads/' + req.user.id + '/');
// //     },
// //     filename: (req, file, callback) => {
// //         callback(null, req.user.id + '-' + Date.now() +
// //             path.extname(file.originalname));
// //     }
// // });
// // // Check File Type
// // // function checkFileType(file, callback) {
// // //     // Allowed file extensions
// // //     const filetypes = /jpeg|jpg|png|gif/;
// // //     // Test extension
// // //     const extname =
// // //         filetypes.test(path.extname(file.originalname).toLowerCase());
// // //     // Test mime
// // //     const mimetype = filetypes.test(file.mimetype);
// // //     if (mimetype && extname) {
// // //         return callback(null, true);
// // //     }
// // //     else {
// // //         callback({ message: 'Images Only' });
// // //     }
// // // }

// // // Define Upload Function
// // const uploads = multer({
// //     storage: storage,
// //     limits: { fileSize: 1000000 }, // 1MB
// //     // fileFilter: (req, file, callback) => {
// //     //     checkFileType(file, callback);
// //     // }
// // }).single('video'); // Must be the name as the HTML file upload input
// // module.exports = uploads