const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? (value.toString()).replace(/,/g, ' | ') : 'None';
};


const isEqualHelperHandlerbar = function(a, b, opts) {
    if (a == b) {
        return opts.fn(this) 
<<<<<<< HEAD
    } else { 
=======
    } 
    else { 
>>>>>>> master
        return opts.inverse(this) 
    } 
}

<<<<<<< HEAD
const increaseOID = function(a,b) {
    return a+b;
}
  


module.exports = { formatDate, replaceCommas, isEqualHelperHandlerbar, increaseOID};
=======


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



module.exports = { formatDate, replaceCommas, isEqualHelperHandlerbar, if_eq};
>>>>>>> master
