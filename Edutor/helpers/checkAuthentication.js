const flashMessage = require('../helpers/messenger');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // If user is authenticated
        return next(); // Calling next() to proceed to the next statement
    }
    // If not authenticated, show alert message and redirect to ‘/’
    flashMessage(res, 'error', "No permission to access this page!", 'fas fa-sign-in-alt', true);
    res.redirect('/');
};
module.exports = ensureAuthenticated;