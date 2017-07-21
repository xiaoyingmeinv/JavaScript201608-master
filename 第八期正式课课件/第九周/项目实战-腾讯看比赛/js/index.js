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

/*计算CON BODY区域的高度*/
~function () {
    var fn = function () {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var conH = winH - 64 - 40;
        $('#conBody').css('height', conH);
        $('.menu').css('height', conH - 2);
    };
    fn();
    $(window).on('resize', fn);
}();

/*MENU*/
var menuRender = (function () {
    var $menu = $('.menu'),
        $menuUL = $menu.children('ul'),
        menuScroll = null;

    //->发布订阅模式:创建一个计划$menuPlain.add()/$menuPlain.remove()
    var $menuPlain = $.Callbacks();

    //->BIND HTML
    $menuPlain.add(function (result) {
        $menuUL.html(ejs.render($('#menuTemplate').html(), {menuData: result}));
    });

    //->ISCROLL
    $menuPlain.add(function (result) {
        menuScroll = new IScroll('.menu', {
            scrollbars: true,
            fadeScrollbars: true,
            mouseWheel: true,
            bounce: false
        });
    });

    //->POSITION
    $menuPlain.add(function (result) {
        var obj = window.location.href.queryURLParameter(),
            hash = obj['HASH'] || 'nba';
        var $link = $menuUL.find('a'),
            $curLink = $link.filter("[href='#" + hash + "']");
        $curLink = $curLink.length === 0 ? $link.eq(0) : $curLink;
        $curLink.addClass('bg');
        menuScroll.scrollToElement($curLink[0], 300);

        //->控制右侧日期的数据跟着改变
        calenderRender.init($curLink.attr('data-id'));
    });

    //->BIND EVENT
    $menuPlain.add(function (result) {
        var $link = $menuUL.find('a');
        $link.on('click', function () {
            $(this).addClass('bg').parent().siblings().children('a').removeClass('bg');

            //->控制右侧日期的数据跟着改变
            calenderRender.init($(this).attr('data-id'));
        });
    });

    return {
        init: function () {
            $.ajax({
                url: 'json/menu.json',
                type: 'GET',
                dataType: 'JSON',
                success: function (result) {
                    if (result) {
                        $menuPlain.fire(result);//->当数据获取成功后通知相关的方法依次执行,并且把获取的结果分别传递给每一个方法
                    }
                }
            });
        }
    }
})();

/*CALENDER*/
var calenderRender = (function () {
    var $calenderPlan = $.Callbacks(),
        $calender = $('.calender'),
        $wrapper = $calender.find('.wrapper');
    var maxL = 0, minL = 0;

    //->BIND HTML
    $calenderPlan.add(function (today, data) {
        var result = ejs.render($('#calenderTemplate').html(), {calenderData: data});
        $wrapper.html(result).css('width', data.length * 110);

        //->计算最小的LEFT值
        minL = -(data.length - 7) * 110;
    });

    //->日期定位:定位到今天日期的位置;如果今天的日期在列表中不存在,我们定位到它后面最近的那一项;如果后面没有日期了,定位到列表的最后一项;默认让选中的这一项在当前展示的七个中的最中间的位置...
    $calenderPlan.add(function (today, data, columnId) {
        var $link = $wrapper.children('a'),
            $curLink = $link.filter("[data-time='" + today + "']");
        if ($curLink.length === 0) {
            today = parseInt(today.replace(/-/g, ''));
            $link.each(function (index, item) {
                var itemTime = $(item).attr('data-time');
                itemTime = parseInt(itemTime.replace(/-/g, ''));
                if (itemTime > today) {
                    $curLink = $(item);
                    return false;//->结束EACH循环
                }
            });
            //->没有比今天日期大的:让其等于最后一项即可
            if ($curLink.length === 0) {
                $curLink = $link.eq($link.length - 1);
            }
        }
        //->定位到$curLink这个位置
        var curIndex = $curLink.index(),
            curLeft = -curIndex * 110 + 3 * 110;
        curLeft = curLeft > maxL ? maxL : (curLeft < minL ? minL : curLeft);
        $wrapper.css('left', curLeft);
        $curLink.addClass('bg');

        //->(控制比赛列表区域的数据跟着改变)
        matchRender.init(columnId);
    });

    //->使用事事件委托实现点击的处理
    $calenderPlan.add(function (today, data, columnId) {
        var $link = $wrapper.children('a');
        $calender.on('click', function (ev) {
            var tar = ev.target,
                tarTag = tar.tagName.toUpperCase();
            tarTag === 'SPAN' ? (tar = tar.parentNode, tarTag = tar.tagName.toUpperCase()) : null;
            if (tarTag === 'A') {
                //->左右按钮
                var cName = tar.className;
                if (cName === 'btnLeft' || cName === 'btnRight') {
                    var curL = parseFloat($wrapper.css('left'));
                    //->为了防止快速点击的时候出现不完整的展示A,我们保证每一次动画都是从110的倍数开始运行的
                    curL = Math.round(curL / 110) * 110;
                    cName === 'btnLeft' ? curL -= 770 : curL += 770;
                    curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
                    $wrapper.stop().animate({
                        left: curL
                    }, 300, 'linear', function () {
                        //->让当前七个中的第一个选中
                        var firIn = Math.abs(curL / 110);
                        $link.eq(firIn).addClass('bg').siblings().removeClass('bg');

                        //->(控制比赛列表区域的数据跟着改变)
                        matchRender.init(columnId);
                    });
                    return;
                }

                //->日期区域:(控制比赛列表区域滚动到具体的某一个位置)
                $(tar).addClass('bg').siblings().removeClass('bg');
            }
        });
    });

    return {
        init: function (columnId) {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                type: 'GET',
                dataType: 'JSONP',
                success: function (result) {
                    if (result && result.code == 0) {
                        //->解析数据:在返回的复杂数据结构中找到我们需要的数据
                        var data = result['data'],
                            today = data['today'];
                        data = data['data'];

                        //->通知绑定的方法执行
                        $calenderPlan.fire(today, data, columnId);
                    }
                }
            });
        }
    }
})();

/*MATCH*/
var matchRender = (function () {
    return {
        init: function (columnId, startTime, endTime) {

        }
    }
})();

menuRender.init();







