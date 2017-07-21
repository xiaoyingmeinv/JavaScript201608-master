/*计算CON BODY区域的高度*/
~function () {
    var fn = function () {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var conH = winH - 64 - 40;
        $('#conBody').css('height', conH);
        $('.menu').css('height', conH - 2);
    };
    fn();
    $(window).on('resize', fn);//->当浏览器的窗口大小发生改变的时候触发window的 resize事件执行
}();

/*MENU*/
var menuRender = function () {
    var $menu = $('.menu'),
        $menuUL = $menu.children('ul');

    //->bindHTML:根据获取的数据实现内容的绑定
    function bindHTML(result) {
        var str = '';
        $.each(result, function (index, item) {
            str += '<li>';
            str += '<a href="#' + item.hash + '">';
            str += item.title;
            str += '<i>';
            str += '<span class="arrow over"></span>';
            str += '<span class="arrow"></span>';
            str += '</i>';
            str += '</a>';
            str += '</li>';
        });
        $menuUL.html(str);
        //->字符串拼接实现数据绑定存在很多的问题:
        //开发效率慢,我们每一次都需要把写好的HTML结构一点点的复制到JS中拼接,如果结构比较复杂的话,拼接处理就要花好多的时间
        //JS中既有获取数据的代码也有操作JS的代码还存在HTML代码，看上去非常的混乱，不方便后期的维护
        //......
    }

    return {
        init: function () {
            $.ajax({
                url: 'json/menu.json',
                type: 'GET',
                dataType: 'JSON',
                success: function (result) {
                    if (result) {
                        bindHTML(result);

                    }
                }
            });
        }
    }
}();
menuRender.init();







