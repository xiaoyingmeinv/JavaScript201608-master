var A = require('./A');
function avg() {
    var total = A.sum.apply(null, arguments);
    return total / arguments.length;
}
module.exports.avg = avg;