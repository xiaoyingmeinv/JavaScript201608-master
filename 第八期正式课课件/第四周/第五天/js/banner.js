/**
 * Created by xiao lei on 2016/8/21.
 */
(function(){
    //获取元素
    var $box=$('#box');
    var $boxInner=$('.boxInner');
    var $aDiv=null;
    var $aImg=null;
    var $ul=$box.find('ul');
    var $aLi=null;
    var $btnLeft=$('.btnLeft');
    var $btnRight=$('.btnRight');
    var data=null;
    var timer=null;
    var step=0;
    //1.获取并解析数据
    getData();
    function getData(){
        $.ajax({
            type:'get', //请求方式
            url:'json/data.txt', //接口地址
            dataType:'json',//返回的数据格式
            async:false,//是否异步
            success:function(val){ //成功的时候返回数据
                data=val;
            }
        })
    }
    //2.bind
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        //原型上的each方法，只能遍历jquery元素
        //类上的each方法，不仅可以遍历jquery元素，也可以遍历数组，对象，类数组
        $.each(data,function(index,item){
            strDiv+='<div><img realImg="'+item.imgSrc+'" alt=""/></div>';
            strLi+=index==0?'<li class="on"></li>':'<li></li>';
        });
        $boxInner.html(strDiv);
        $ul.html(strLi);
    }
    //注意：jquery没有DOM映射，当页面结构变化的时候，我们提前获取到的元素集合不会跟着发生变化；
    $aDiv=$boxInner.children('div');
    $aImg=$boxInner.find('img');
    $aLi=$ul.find('li');
    //3.lazyImg
    lazyImg();
    function lazyImg(){
        $.each($aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=$(item).attr('realImg');
            tmpImg.onload=function(){
                item.src=this.src;
                /*$aDiv.eq(0).css('zIndex',1).stop().animate({opacity:1},1000);*/
                $aDiv.eq(0).css('zIndex',1).stop().fadeIn(1000);
            }
        })

    }
    //4.autoMove
    clearInterval(timer);
    timer=setInterval(autoMove,1000);
    function autoMove(){
        if(step>=$aDiv.length-1){
            step=-1;
        }
        step++;
        setBanner();
    }
    function setBanner(){
        $.each($aDiv,function(index,item){
            if(index==step){
                $(item).css('zIndex',1).stop().fadeIn(500,function(){
                    $(this).siblings().stop().fadeOut(500);
                });
            }else{
                $(item).css('zIndex',0)
            }
        });
        bannerTip();
    }
    //5.bannerTip
    function bannerTip(){
        $.each($aLi,function(index,item){
            index==step?$(item).addClass('on'):$(item).removeClass('on');
        })
    }
    //6.overout
    $box.mouseover(function(){
        clearInterval(timer);
        $btnLeft.show();
        $btnRight.show();
    });
    $box.mouseout(function(){
        timer=setInterval(autoMove,1000);
        $btnLeft.hide();
        $btnRight.hide();
    });
    //7.handleChange
    $.each($aLi,function(index,item){
        $(item).click(function(){
            step=index;
            setBanner();
        })
    });
    //8.leftRight
    $btnRight.click(function(){
        autoMove();
    });
    $btnLeft.click(function(){
        if(step<=0){
            step=$aLi.length;
        }
        step--;
        setBanner();
    })
})();