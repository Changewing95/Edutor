const multer = require('multer');
const path = require('path');



// Clara
// Set Storage Engine
// const tutorialImageStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './public/uploads/' + req.user.id + '/');
//     },
//     filename: (req, file, callback) => {
//         callback(null, req.user.id + '-' + Date.now() +
//             path.extname(file.originalname));
//     }
// });
// // Check File Type
// function tutorialImageCheckFileType(file, callback) {
//     // Allowed file extensions
//     const tutorialImagefiletypes = /jpeg|jpg|png|gif/;
//     // Test extension
//     const tutorialImageExtname =
//         filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Test mime
//     const tutorialImageMimetype = filetypes.test(file.mimetype);
//     if (tutorialImageMimetype && tutorialImageExtname) {
//         return callback(null, true);
//     }
//     else {
//         callback({ message: 'Images Only' });
//     }
// }
// // Define Upload Function
// const tutorialImageUpload = multer({
//     storage: tutorialImageStorage,
//     limits: { fileSize: 1000000 }, // 1MB
//     fileFilter: (req, file, callback) => {
//         tutorialImageCheckFileType(file, callback);
//     }
// }).single('tutorialImageUpload'); // Must be the name as the HTML file upload input
// module.exports = upload;
// const tutorialImageStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './public/uploads/' + req.user.id + '/');
//     },
//     filename: (req, file, callback) => {
//         callback(null, req.user.id + '-' + Date.now() +
//             path.extname(file.originalname));
//     }
// });

// // Check File Type 
// function tutorialImageCheckFileType(file, callback) {
//     // Allowed file extensions 
//     const filetypes1 = /jpeg|jpg|png|gif/;
//     // Test extension 
//     const extname1 = filetypes1.test(path.extname(file.originalname).toLowerCase());
//     // Test mime 
//     const mimetype1 = filetypes1.test(file.mimetype1);
//     if (mimetype1 && extname1) {
//         return callback(null, true);
//     }
//     else {
//         callback({ message: 'Images Only' });
//     }
// }

// // Define Upload Function
// const tutorialImageUpload = multer({
//     storage: tutorialImageStorage,
//     limits: { fileSize: 1000000 }, // 1MB
//     fileFilter: (req, file, callback) => {
//         tutorialImageCheckFileType(file, callback);
//     }
// }).single('tutorialImageUpload'); // Must be the name as the HTML file upload input 


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


// End




// Yong Lin

// // Set Storage Engine
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



// End


// 

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
// module.exports = tutorialImageUpload;