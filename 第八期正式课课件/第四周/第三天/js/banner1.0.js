/**
 * Created by xiao lei on 2016/8/18.
 */
function Banner(id,url,effect){ //构造函数
    this.oBox=document.getElementById(id);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oUl.getElementsByTagName('li');
    this.oBtnLeft=this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight=this.oBox.getElementsByTagName('a')[1];
    this.data=null;
    this.effect=effect;
    this.timer=null;
    this.url=url;
    this.step=0;
    this.init();//注意，如果不调用init，所有的代码都无法执行；

}
Banner.prototype={
    constructor:Banner,
    init:function(){//init中放所有的思路
        var _this=this;
        //1.获取并解析数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.延迟加载
        setTimeout(function(){
            _this.lazyImg();
        },500);
        //4.图片自动轮播
        this.timer=setInterval(function(){
            _this.autoMove();
        },1400);
        //6.鼠标移入停止，移出继续
        this.overout();
        //7.点击焦点手动切换
        this.handleChange();
        //8.点击左右按钮手动切换
        this.leftRight();
    },
    getData:function getData(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get',this.url,false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind:function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0; i<this.data.length; i++){
            strDiv+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            strLi+=i===0?'<li class="on"></li>':'<li></li>';
            //通过判断，索引为0的，让其点亮，其他不用点亮
        }
        //注意：要把5个src都改成realImg;
        strDiv+='<div><img realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        //如果用字符串拼接的方式，插入页面，应该给innerHTML赋值；
        //如果通过创建元素的方式，插入页面，应该给appendChild or insertBefore赋值；
        this.oBoxInner.innerHTML+=strDiv;
        this.oBoxInner.style.width=this.aDiv.length*this.aDiv[0].offsetWidth+'px';
        this.oUl.innerHTML+=strLi;
    },
    lazyImg:function lazyImg(){
        var _this=this;
        for(var i=0; i<_this.aImg.length; i++){
            (function(index){
                var curImg=_this.aImg[index];
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
    },
    autoMove:function autoMove(){
        if(this.step>=this.aDiv.length-1){
            this.step=0;
            utils.css(this.oBoxInner,'left',0)
        }
        this.step++;
        animate(this.oBoxInner,{left:-this.step*1000},700,this.effect)
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        var tmpStep=this.step>=this.aLi.length?0:this.step;
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].className=i==tmpStep?'on':null;
        }
    },
    overout:function overout(){
        var _this=this;
        _this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.oBtnLeft.style.display='block';
            _this.oBtnRight.style.display='block';
        };
        _this.oBox.onmouseout=function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },1400);
            _this.oBtnLeft.style.display='none';
            _this.oBtnRight.style.display='none';
        };
    },
    handleChange:function handleChange(){
        var _this=this;
        for(var i=0; i<_this.aLi.length; i++){
            _this.aLi[i].index=i;
            _this.aLi[i].onclick=function(){
                _this.step=this.index;
                animate(_this.oBoxInner,{left:-_this.step*1000},700,_this.effect);
                _this.bannerTip();
            }
        }
    },
    leftRight:function leftRight(){
        var _this=this;
        _this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        _this.oBtnLeft.onclick=function(){
            if(_this.step<=0){
                _this.step=_this.aDiv.length-1;
                utils.css(_this.oBoxInner,'left',-_this.step*1000);
            }
            _this.step--;
            animate(_this.oBoxInner,{left:-_this.step*1000},700,_this.effect);
            _this.bannerTip();
        }
    }
}