const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? (value.toString()).replace(/,/g, ' | ') : 'None';
};



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

const isEqualHelperHandlerbar = function(a, b, opts) {
    if (a == b) {
        return opts.fn(this) 
    } 
    else { 
        return opts.inverse(this) 
    } 
}

const increaseOID = function(a,b) {
    return a+b;
}
  




const Multiply = function(a, b) {
    return a * b;
}

const if_eq = function () {
	const args = Array.prototype.slice.call(arguments, 0, -1);
    const options = arguments[arguments.length - 1];
	const allEqual = args.every(function (expression) {
  		return args[0] === expression;
  	});
    
    return allEqual ? options.fn(this) : options.inverse(this);
};



module.exports = { formatDate, replaceCommas, isEqualHelperHandlerbar, if_eq,increaseOID, Multiply, radioCheck, formatRating, calculateTotalRating, avgRating};
