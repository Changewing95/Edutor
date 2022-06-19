const multer = require('multer');
const path = require('path');
// Set Storage Engine
const storage = multer.diskStorage({
    /* change 1 to req.user.id */
    destination: (req, file, cb) => {
        cb(null, './public/uploads/' + 1 + '/');
    },
    /* change 1 to req.user.id */
    filename: (req, file, cb) => {
        cb(null, 1 + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
// Check File Type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Test extension
    const extname =
        filetypes.test(path.extname(file.originalname).toLowerCase());
    // Test mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb({ message: 'Images Only' });
    }
}
// Define Upload Function
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('consultationUpload'); // Must be the name as the HTML file upload input

module.exports = upload;
