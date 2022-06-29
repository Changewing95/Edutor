const multer = require('multer');
const path = require('path');
// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + req.user.id + '/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.id + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Test extension
    const extname =
        filetypes.test(path.extname(file.originalname).toLowerCase());
    // Test mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true);
    }
    else {
        callback({ message: 'Images Only' });
    }
}

// Define Upload Function
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('tutorialImageUpload'); // Must be the name as the HTML file upload input

// //video
// //video
// function checkVideoType(file, callback) {
//     // Allowed file extensions
//     const filetypeVid = /mp4/;
//     // Test extension
//     const extnameVid =
//         filetypeVid.test(path.extname(file.originalname).toLowerCase());
//     // Test mime
//     const mimetypeVid = filetypes.test(file.mimetype);
//     if (mimetypeVid && extnameVid) {
//         return callback(null, true);
//     }
//     else {
//         callback({ message: 'Images Only' });
//     }
// }
// // Define Upload Function
// const uploadVid = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // 1MB
//     fileFilter: (req, file, callback) => {
//         checkVideoType(file, callback);
//     }
// }).single('video'); // Must be the name as the HTML file upload input
module.exports = upload;