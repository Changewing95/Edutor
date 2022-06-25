const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
}

const Multiply = function(a, b) {
    return a * b;
}
  
module.exports = { formatDate, replaceCommas, Multiply};