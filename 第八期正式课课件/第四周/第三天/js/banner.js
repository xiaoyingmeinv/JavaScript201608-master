/**
 * Created by xiao lei on 2016/8/18.
 */
(function(id){
    //获取元素
    var oBox=document.getElementById(id);
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aImg=oBoxInner.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oUl.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var data=null;
    var timer=null;
    var step=0;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    //2.绑定数据
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0; i<data.length; i++){
            strDiv+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            strLi+=i===0?'<li class="on"></li>':'<li></li>';
            //通过判断，索引为0的，让其点亮，其他不用点亮
        }
        //注意：要把5个src都改成realImg;
        strDiv+='<div><img realImg="'+data[0].imgSrc+'" alt=""/></div>';
        //如果用字符串拼接的方式，插入页面，应该给innerHTML赋值；
        //如果通过创建元素的方式，插入页面，应该给appendChild or insertBefore赋值；
        oBoxInner.innerHTML+=strDiv;
        oBoxInner.style.width=aDiv.length*aDiv[0].offsetWidth+'px';
        oUl.innerHTML+=strLi;
    }
    //3.延迟加载图片
    setTimeout(lazyImg,500);
    function lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var curImg=aImg[index];
                //1.创建一个图片对象
                var tmpImg=new Image;
                //2.给图片对象赋值正确的地址
                tmpImg.src=curImg.getAttribute('realImg');
                //3.校验地址
                tmpImg.onload=function(){
                    curImg.src=this.src;
                    tmpImg=null;
                }
            })(i);
        }
    }
    //4.图片自动轮播
    timer=setInterval(autoMove,1400);
    function autoMove(){
        if(step>=aDiv.length-1){
            step=0;
            utils.css(oBoxInner,'left',0)
        }
        step++;
        animate(oBoxInner,{left:-step*1000})
        bannerTip();
    }
    //5.焦点自动轮播
    function bannerTip(){
        var tmpStep=step>=aLi.length?0:step;
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==tmpStep?'on':null;
        }
    }

    //6.鼠标移入停止，移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display='block';
        oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,1400);
        oBtnLeft.style.display='none';
        oBtnRight.style.display='none';
    };
    //7.点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                step=this.index;
                animate(oBoxInner,{left:-step*1000});
                bannerTip();
            }
        }
    }
    //8.点击左右按钮手动切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(step<=0){
            step=aDiv.length-1;
            utils.css(oBoxInner,'left',-step*1000);
        }
        step--;
        animate(oBoxInner,{left:-step*1000});
        bannerTip();
    }
})();