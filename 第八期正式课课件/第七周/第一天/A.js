function sum() {
    var total = null;
    [].forEach.call(arguments, function (item) {
        item = Number(item);
        !isNaN(item) ? total += item : null;
    });
    return total;
}
module.exports.sum = sum;