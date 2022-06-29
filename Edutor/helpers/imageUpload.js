const multer = require('multer');
const path = require('path');
// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + 1 + '/');
    },
    filename: (req, file, callback) => {
        callback(null, 1 + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png/;
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
}).single('image'); // Must be the name as the HTML file upload input
module.exports = upload;
