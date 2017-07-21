/**
 * Created by samsung on 2016/8/18.
 */
function Banner(id,url,effect){
    this.oBox=document.getElementById(id);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oUl.getElementsByTagName('li');
    this.oBtnL=this.oBox.getElementsByTagName('a')[0];
    this.oBtnR=this.oBox.getElementsByTagName('a')[1];
    this.step=0;
    this.url=url;
    this.effect=effect;
    this.data=null;
    this.timer=null;
    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        //1.获取并解析数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片加载
        setTimeout(function(){
            _this.lazyImg();
        },400);
        //4.图片轮播
        this.timer=setInterval(function(){
            _this.autoMove();
        },2000);
        //5.bannerTip();
        this.bannerTip();
        //6.移入移除
        this.overout()
    },
    getData:function getData(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        }
        xml.send()
    },
    bind:function bind(){
        var strD='';
        var strL='';
        for(var i=0;i<this.data.length;i++){
            strD+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            strL+=i===0?'<li class="on"></li>':'<li></li>';
        }
        strD+='<div><img realImg="'+this.data[0].imgSrc+'" alt=""></div>';
        this.oBoxInner.innerHTML+=strD;
        utils.css(this.oBoxInner,'width',this.aDiv[0].offsetWidth*this.aDiv.length);
        this.oUl.innerHTML+=strL;
    },
    lazyImg:function lazyImg(){
        var _this=this;
        for(var i=0;i<_this.aImg.length;i++){
            (function(index){
                var curImg=_this.aImg[index];
                var tmpImg=new Image;
                tmpImg.src=curImg.getAttribute('realImg');
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
        animate(this.oBoxInner,{left:-this.step*1000},1000,2)
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        var tmpStep=this.step>=this.aLi.length?0:this.step;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i===tmpStep?'on':null;
        }
    },
    overout:function overout(){
        var _this=this;
        _this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.oBtnL.style.display='block';
            _this.oBtnR.style.display='block';
        };
        _this.oBox.onmouseout=function(){
            _this.timer=setInterval(function(){
                _this.autoMove()
            },2000);
            _this.oBtnL.style.display='none';
            _this.oBtnR.style.display='none';
        }
    }

}