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

    pro.queryURLParameter = queryURLParameter;
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
var menuRender = function () {
    var $menu = $('.menu'),
        $menuUL = $menu.children('ul'),
        menuScroll = null;

    //->通过HASH值定位到具体的某一个MENU
    function positionMenu() {
        //->获取地址栏中的HASH值
        var obj = window.location.href.queryURLParameter(),
            hash = obj['HASH'] || 'nba';

        //->获取UL中的所有的A标签,在所有的A中查找到HASH和我们获取结果一致的A:如果获取到了让当前的选中,没有获取到我们选中第一项
        var $link = $menuUL.find('a'),
            $curLink = $link.filter("[href='#" + hash + "']");
        $curLink = $curLink.length === 0 ? $link.eq(0) : $curLink;
        $curLink.addClass('bg');

        //->让MENU区域滚动到选中的位置
        menuScroll.scrollToElement($curLink[0], 300);
    }

    //->给所有的A绑定点击事件
    function bindEvent() {
        var $link = $menuUL.find('a');
        $link.on('click', function () {
            $(this).addClass('bg').parent().siblings().children('a').removeClass('bg');
        });
    }

    return {
        init: function () {
            $.ajax({
                url: 'json/menu.json',
                type: 'GET',
                dataType: 'JSON',
                success: function (result) {
                    if (result) {
                        //->BIND HTML
                        $menuUL.html(ejs.render($('#menuTemplate').html(), {menuData: result}));

                        //->ISCROLL
                        menuScroll = new IScroll('.menu', {
                            scrollbars: true,
                            fadeScrollbars: true,
                            mouseWheel: true,
                            bounce: false
                        });

                        //->通过HASH值定位到具体的某一个MENU
                        positionMenu();

                        //->绑定点击事件
                        bindEvent();
                    }
                }
            });
        }
    }
}();
menuRender.init();







