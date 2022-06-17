const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/consultationImage/');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, 1 + '-' + file.filename + "-" + Date.now() +
            path.extname(file.originalname));
    }
});
// Define Upload Function
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('consultationImage'); // Must be the name as the HTML file upload input

// Check File Type -- Image (for consultation slot)
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


module.exports = upload;
