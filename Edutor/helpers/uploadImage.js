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
<<<<<<< HEAD
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
=======


// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|mp4|gif/;
>>>>>>> master
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
<<<<<<< HEAD
// Define Upload Function
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('tutorialImageUpload'); // Must be the name as the HTML file upload input
=======

// Define Upload Function
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000000000 }, // 1MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).fields([{name: 'tutorialImageUpload', maxCount: 1}, {name: 'tutorialVideoUpload', maxCount: 1}]) // Must be the name as the HTML file upload input
>>>>>>> master
module.exports = upload;