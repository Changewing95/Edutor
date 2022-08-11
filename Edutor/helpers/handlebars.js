const { blockParams } = require('handlebars');
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


const isEqualHelperHandlerbar = function (a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    }
    else {
        return opts.inverse(this)
    }
}

const increaseOID = function (a, b) {
    return a + b;
}





const Multiply = function (a, b) {
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

const times = function (iter, block) {
    var accum = '';
    for (var i = 0; i < iter; ++i){
        accum += block.fn(i);
    }
    return accum;
}



module.exports = { formatDate, replaceCommas, isEqualHelperHandlerbar, if_eq, increaseOID, Multiply, radioCheck, formatRating, times };