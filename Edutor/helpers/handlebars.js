const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? (value.toString()).replace(/,/g, ' | ') : 'None';
};


const isEqualHelperHandlerbar = function (a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}

const radioCheck = function (value, radioValue) {
    return (value == radioValue) ? 'checked' : '';
};

const formatRating = function (value) {
    const value123 = value;
    return value123.toFixed(2);
};

const calculateTotalRating = function (value) {
    var total = 0;
    var count = 0;
    total += value;
    count += 1;
    return avgRating(total, count);
}

const avgRating = function (total, count) {
    var avgRating = total / count;
    return avgRating.toFixed(1);
}

module.exports = { formatDate, replaceCommas, isEqualHelperHandlerbar, radioCheck, formatRating, calculateTotalRating, avgRating };