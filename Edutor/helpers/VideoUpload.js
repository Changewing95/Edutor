
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


// Define Upload Function
const upload = multer({ storage: storage })
module.exports = upload;