(function () {
    var zQuery = function (selector, context) {
        return new zQuery.fn.init(selector, context);
    };
    zQuery.fn = zQuery.prototype = {
        constructor: zQuery,
        init: function () {
            console.log("���");
        }
    };
    window.zQuery = window.$ = zQuery;
})();