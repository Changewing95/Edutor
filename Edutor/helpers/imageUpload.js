const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + 1 + '/');
    },
    filename: (req, file, callback) => {
        callback(null, 1 + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check File Type 
function checkFileType(file, callback) {
    // Allowed file extensions 
    const filetypes = /jpeg|jpg|png|gif/;
    // Test extension 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
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
}).single('consultationUpload'); // Must be the name as the HTML file upload input 

// const multer = require('multer');
// const path = require('path');
// // Set Storage Engine
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './public/uploads/' + 1 + '/');
//     },
//     filename: (req, file, callback) => {
//         callback(null, 1 + '-' + Date.now() +
//             path.extname(file.originalname));
//     }
// });
// // Check File Type
// function checkFileType(file, callback) {
//     // Allowed file extensions
//     const filetypes = /jpeg|jpg|png/;
//     // Test extension
//     const extname =
//         filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Test mime
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//         return callback(null, true);
//     }
//     else {
//         callback({ message: 'Images Only' });
//     }
// }
// // Define Upload Function
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // 1MB
//     fileFilter: (req, file, callback) => {
//         checkFileType(file, callback);
//     }
// }).single('image'); // Must be the name as the HTML file upload input
// module.exports = upload;



// const multer = require("multer");
// const path = require('path');


// //profilepicture
// const storageForUploads = multer.diskStorage({
//     destination: './public/images/profilepictures',
//     filename: function(req, file, cb) { //cb is a callback function (null, destination string)
//         console.log(file);
//         cb(null,req.user.id +'-'+ file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// });

// //Init upload
// const upload = multer({
//     storage: storageForUploads,
//     limits: {fileSize:  10000000000000},
//     fileFilter: function(req,file,cb){
//         checkFileType(file, cb);
//     }
// }).single('profilePictureUpload')




// function checkFileType(file, cb){
//     //Allowed ext
//     const filetypes =  /jpeg|jpg|png|gif/; //reqex
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());//test the file ext on all the allowed file types
  
//     const mimetype = filetypes.test(file.mimetype);
  
//     if(mimetype && extname){
//         return cb(null,true);
//     } else{
//         cb('Error: Images Only!')
//     }
  
// };

// >>>>>>> master

module.exports = upload;