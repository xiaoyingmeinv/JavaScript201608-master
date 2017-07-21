var pageRender = (function () {
    var n = 1,
        total = 0;
    var oBox = document.getElementById('box'),
        content = document.getElementById('content'),
        footer = document.getElementById('footer'),
        numBox = document.getElementById('numBox'),
        pageNum = document.getElementById('pageNum');

    //->SEND AJAX AND BIND HTML
    function bindHTML() {
        //->SUCCESS AND BIND HTML
        function callback(result) {
            if (!result) return;
            total = parseInt(result['total']);

            //->GET DATA CONCAT STR
            var data = result['data'],
                str = '';
            for (var i = 0, len = data.length; i < len; i++) {
                var cur = data[i];
                str += '<li data-id="' + cur['id'] + '">';
                str += '<span>' + cur['id'] + '</span>';
                str += '<span>' + cur['name'] + '</span>';
                str += '<span>' + (cur['sex'] == 1 ? '女' : '男') + '</span>';
                str += '<span>' + cur['score'] + '</span>';
                str += '</li>';
            }
            content.innerHTML = str;

            //->CONCAT PAGE
            str = '';
            for (i = 1; i <= total; i++) {
                if (i == n) {
                    str += '<li class="bg">' + i + '</li>';
                    continue;
                }
                str += '<li>' + i + '</li>';
            }
            numBox.innerHTML = str;

            //->PAGE NUM SHOW N
            pageNum.value = n;
        }

        //->SEND AJAX GET DATA
        ajax({
            url: '/getList?n=' + n,
            type: 'GET',
            dataType: "JSON",
            cache: false,
            success: callback
        });
    }

    //->BIND EVENT
    function bindEvent() {
        oBox.onclick = function (ev) {
            ev = ev || window.event;
            var tar = ev.target || ev.srcElement,
                tarTag = tar.tagName.toUpperCase(),
                tarInn = tar.innerHTML,
                tarParent = tar.parentNode,
                tarGrandparent = tarParent.parentNode;

            //->CONTENT LI OR SPAN
            if ((tarTag === 'LI' && tarParent.id === 'content') || (tarTag === 'SPAN' && tarGrandparent.id === 'content')) {
                if (tarTag === 'SPAN') {
                    tar = tarParent;
                }
                var id = tar.getAttribute('data-id');
                //window.location.href = 'detail.html?id=' + id;
                window.open('detail.html?id=' + id);
                return;
            }

            //->NUM BOX LI
            if (tarTag === 'LI' && tarParent.id === 'numBox') {
                tarInn = parseInt(tarInn);
                if (tarInn === n) {
                    return;
                }
                n = tarInn;
                bindHTML();
                return;
            }

            //->FOOTER SPAN
            if (tarTag === 'SPAN' && tarParent.id === 'footer') {
                if (tarInn === 'FIRST') {
                    if (n === 1) {
                        return;
                    }
                    n = 1;
                }
                if (tarInn === 'LAST') {
                    if (n === total) {
                        return;
                    }
                    n = total;
                }
                if (tarInn === 'PREV') {
                    if (n === 1) {
                        return;
                    }
                    n--;
                }
                if (tarInn === 'NEXT') {
                    if (n === total) {
                        return;
                    }
                    n++;
                }
                bindHTML();
            }

        }
    }

    return {
        init: function () {
            //->BIND HTML
            bindHTML();

            //->BIND EVENT
            bindEvent();

            //->INPUT KEY UP
            pageNum.onkeyup = function (ev) {
                ev = ev || window.event;
                //->ENTER
                if (ev.keyCode === 13) {
                    var val = parseFloat(this.value);
                    if (isNaN(val) || val === n) {
                        this.value = n;
                        return;
                    }
                    n = val < 1 ? 1 : (val > total ? total : val);
                    bindHTML();
                }
            }
        }
    }
})();
pageRender.init();