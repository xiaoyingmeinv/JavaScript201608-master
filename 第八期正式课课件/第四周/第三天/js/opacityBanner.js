/**
 * Created by xiao lei on 2016/8/18.
 */
(function(){
    //获取元素
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aImg=oBoxInner.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oBox.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var data=null;
    var step=0;
    var timer=null;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest();
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText)
            }
        }
        xml.send();
    }
    // 2.绑定数据
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0; i<data.length; i++){
            strDiv+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        oBoxInner.innerHTML=strDiv;
        oUl.innerHTML=strLi;
    }
    // 3.延迟加载
    lazyImg();
    function lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    aImg[index].src=this.src;
                    var oDiv1=aDiv[0];
                    utils.css(oDiv1,'zIndex',1);
                    animate(oDiv1,{opacity:1},500)
                }
            })(i);
        }
    }
    // 4.图片自动渐隐渐现
    clearInterval(timer);
    timer=setInterval(autoMove,1000)
    //step决定让哪个div显示：
    function autoMove(){
        //0 1 2 3
        if(step>=aDiv.length-1){
            step=-1;
        }
        step++; //1 2 3 0
        setBanner();
    }
    function setBanner(){
        for(var i=0; i<aDiv.length; i++){
            if(i===step){// 1.哪个div的索引等于step时，让哪个div的层级是最高的；其他的div层级都是0；
                utils.css(aDiv[i],'zIndex',1);
                //2.应该把索引等于step的div透明度从0-1；等他结束运动后，让他的所有兄弟元素透明度变成0；
                animate(aDiv[i],{opacity:1},500,function(){
                    //i在异步中一定会出错；所以此处要用this(因为封装回调函数时，已经通过call修改了this指向为当前这个元素)，不能用aDiv[i]
                    var siblings=utils.siblings(this);
                    for(var i=0; i<siblings.length; i++){
                        animate(siblings[i],{opacity:0});
                    }
                })
                continue;
            }
            utils.css(aDiv[i],'zIndex',0)
        }
        bannerTip();
    }

    // 5.焦点自动轮播
    function bannerTip(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i===step?'on':null;
        }
    }
    // 6.鼠标移入停止，移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display='block';
        oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,1000);
        oBtnLeft.style.display='none';
        oBtnRight.style.display='none';
    };
    // 7.点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                step=this.index;
                setBanner();
            }
        }
    }
    // 8.点击按钮左右切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(step<=0){
            step=aLi.length;
        }
        step--;
        setBanner();
    }

})()