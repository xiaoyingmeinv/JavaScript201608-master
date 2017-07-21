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
        $menuUL = $menu.children('ul');

    //->bindHTML:根据获取的数据实现内容的绑定
    function bindHTML(result) {
        //第二步:为模板提供数据
        //->获取到HTML中的模板
        var template = $('#menuTemplate').html();
        console.log(template);

        //->使用EJS为其提供数据即可:ejs.render([模板],[{提供数据的属性名:数据值}])
        var res = ejs.render(template, {menuData: result});
        console.log(res);

        //->把EJS解析完成的结果放在UL中
        $menuUL.html(res);
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







