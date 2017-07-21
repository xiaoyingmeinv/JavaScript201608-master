/**
 * Created by xiao lei on 2016/8/21.
 */
//进行原型的扩展
(function($){
    $.fn.extend({
        tab:function(){
            //this: 指向调用它的实例；
            var $box=this;
            var $aBtn=$box.children('input'); //找的是孩子们
            var $aDiv=$box.find('div');//找的是子子孙孙们;
            //jquery都是方法函数化，所以一定不要写等号；否则会报错；
            $aBtn.click(function(){
                //this --指向当前发生事件的元素 但是，这里的this是原生的this；
                //不能混淆，就是指JQUERY只能使用jquery的方法，不能使用原生的属性和方法，同理，原生也不能使用jquery的方法；
                $(this).addClass('on').siblings('input').removeClass('on');
                $aDiv.eq($(this).index()).addClass('show').siblings('div').removeClass('show');
            })
        },
        changeColor:function(strColor){
            //this-指向当前调用它的实例；它本身就是一个jquery元素
            this.css('background',strColor)
        }
    })
})(jQuery);