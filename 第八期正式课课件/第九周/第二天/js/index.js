/*String.prototype*/
~function (pro) {
    //->解析URL中的问号参数值以及HASH值
    function queryURLParameter() {
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj['HASH'] = reg.exec(this)[1];
        }
        return obj;
    }

    //->格式化时间字符串的
    function myFormatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        template = template.replace(/\{(\d)\}/g, function () {
            return ary[arguments[1]] || '00';
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.myFormatTime = myFormatTime;
}(String.prototype);

/*HEADER*/
~function () {
    var $menu = $('.menu'),
        $nav = $('.nav');
    $menu.singleTap(function () {
        if ($nav.hasClass('show')) {
            $nav.removeClass('show').addClass('hide');
            return;
        }
        $nav.removeClass('hide').addClass('show');
    });
}();

/*MATCH*/
var matchRender = (function () {
    var $match = $('.match');
    var isSupport = false;

    //->bindHTML:数据绑定并且计算比例条的宽度
    function bindHTML(matchInfo) {
        $match.html(ejs.render($('#matchTemplate').html(), {matchInfo: matchInfo}));

        //->加定时器的作用:先让progress渲染,渲染完成后在计算宽度值,这样的话才会执行CSS3中设定的过渡动画效果
        var delayTimer = window.setTimeout(function () {
            var leftSupport = parseFloat(matchInfo['leftSupport']),
                rightSupport = parseFloat(matchInfo['rightSupport']);
            $('.progress').css({
                width: (leftSupport / (leftSupport + rightSupport)) * 100 + '%'
            });
            window.clearTimeout(delayTimer);
        }, 50);
    }

    //->bindEvent:给支持绑定点击事件
    function bindEvent(matchInfo) {
        var $bottom = $match.children('.bottom'),
            $left = $bottom.children('.home'),
            $right = $bottom.children('.away');
        //->在每一次刷新页面的时候,我们首先获取本地存储的信息isSupport,如果存在,就不需要在绑定事件了
        var supportInfo = localStorage.getItem('supportInfo');
        if (supportInfo) {
            supportInfo = JSON.parse(supportInfo);
            supportInfo.type == 1 ? $left.addClass('bg') : $right.addClass('bg');
            return;
        }

        var fn = function () {
            if (isSupport) return;

            //->控制样式
            var oldNum = parseFloat($(this).html());
            $(this).addClass('bg').html(oldNum + 1);

            //->重新计算比例
            var leftNum = parseFloat($left.html()),
                rightNum = parseFloat($right.html());
            $('.progress').css('width', (leftNum / (leftNum + rightNum)) * 100 + '%');

            //->告诉服务器支持的是谁
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1468531&type=' + $(this).attr('type'),
                type: 'GET',
                dataType: 'jsonp'
            });

            //->点击一次后就不能在支持了:需要往本地存储一份,以后刷新页面,首先看本地是否存在信息,存在说明之前支持过,不存在说明之前没有支持过
            isSupport = true;
            localStorage.setItem('supportInfo', JSON.stringify({
                isFlag: true,
                type: $(this).attr('type')
            }));//->localStorage存储的值都是字符串
        };
        $left.singleTap(fn);
        $right.singleTap(fn);
    }

    return {
        init: function () {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531',
                type: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    if (!result || result[0] != 0) return;

                    //->format data
                    result = result[1];
                    var matchInfo = result['matchInfo'];
                    matchInfo['leftSupport'] = result['leftSupport'];
                    matchInfo['rightSupport'] = result['rightSupport'];

                    //->bind html
                    bindHTML(matchInfo);

                    //->bindEvent
                    bindEvent(matchInfo);
                }
            });
        }
    }
})();
matchRender.init();

/*MATCH LIST*/
var matchListRender = (function () {
    var $matchList = $('.matchList'),
        $wrapper = $matchList.children('.wrapper');
    var matchScroll = null;

    function bindHTML(data) {
        $.each(data, function (index, item) {
            var duration = item.duration;
            duration = duration.substr(duration.indexOf(':') + 1);
            item.duration = duration;
        });
        $wrapper.html(ejs.render($('#matchListTemplate').html(), {data: data})).css('width', (data.length * 2.4 + .3) + 'rem');
    }

    function scroll() {
        matchScroll = new IScroll($matchList[0], {
            scrollX: true,
            scrollY: false,
            bounce: false
        });
    }

    return {
        init: function () {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchStatV37?mid=100002:2365',
                type: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    if (!result || result[0] != 0) return;
                    result = result[1];
                    result = result['stats'];

                    var data = null;
                    $.each(result, function (index, item) {
                        if (item.type == 9) {
                            data = item.list;
                            return false;
                        }
                    });

                    //->bind html
                    bindHTML(data);

                    //->scroll
                    scroll();
                }
            });
        }
    }
})();
matchListRender.init();