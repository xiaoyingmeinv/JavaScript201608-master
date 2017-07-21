//->CUSTOM RENDER
var customRender = (function () {
    var conList = document.getElementById('conList');

    //->BIND EVENT
    function bindEvent() {
        conList.onclick = function (ev) {
            ev = ev || window.event;
            var tar = ev.target || ev.srcElement,
                tarTag = tar.tagName.toUpperCase(),
                tarInn = tar.innerHTML;
            if (tarTag === 'A' && tarInn === '删除') {
                //->ALERT、CONFIRM、PROMPT
                var cusId = tar.getAttribute('data-id'),
                    flag = window.confirm('确定要删除编号为 [ ' + cusId + ' ] 的客户吗?');
                if (flag) {//->点击的是确定按钮:调取对应的API接口实现删除即可
                    ajax({
                        url: '/removeInfo?id=' + cusId,
                        cache: false,
                        success: function (result) {
                            if (result && result.code == 0) {
                                //->删除成功后在HTML结构中移除对应的LI标签
                                conList.removeChild(tar.parentNode.parentNode);
                            }
                        }
                    });
                }
            }
        }
    }

    //->BIND HTML
    function bindHTML(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li>';
            str += '<span class="fir">' + cur.id + '</span>';
            str += '<span>' + cur.name + '</span>';
            str += '<span class="fir">' + cur.age + '</span>';
            str += '<span>' + cur.phone + '</span>';
            str += '<span>' + cur.address + '</span>';
            str += '<span class="control">';
            str += '<a href="add.html?id=' + cur.id + '">修改</a>';
            str += '<a href="javascript:;" data-id="' + cur.id + '">删除</a>';
            str += '</span>';
            str += '</li>';
        }
        conList.innerHTML = str;
    }

    return {
        init: function () {
            //->SEND AJAX GET DATA
            ajax({
                url: '/getAllList',
                type: 'GET',
                dataType: 'JSON',
                cache: false,
                success: function (result) {
                    if (result && result.code == 0) {
                        //->BIND HTML
                        bindHTML(result.data);

                        //->BIND EVENT
                        bindEvent();
                    }
                }
            });
        }
    }
})();
customRender.init();