/**
 * Created by xiao lei on 2016/8/18.
 */
function Banner(id){
    this.oBox=document.getElementById(id);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oBox.getElementsByTagName('li');
    this.oBtnLeft=this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight=this.oBox.getElementsByTagName('a')[1];
    this.data=null;
    this.step=0;
    this.timer=null;

    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        //1.获取并解析数据
        this.getData();
        //2.绑定
        this.bind();
        //3.延迟加载
        this.lazyImg();
        //4.自动播放
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.autoMove();
        },1000);
        //5.焦点自动播放
        //6.鼠标移入停止，移出继续
        this.overout();
        //7.点击焦点手动切换
        this.handleChange();
        //8.点击左右按钮切换
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function(){
        var strDiv='';
        var strLi='';
        for(var i=0; i<this.data.length; i++){
            strDiv+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        this.oBoxInner.innerHTML=strDiv;
        this.oUl.innerHTML=strLi;
    },
    lazyImg:function(){
        var _this=this;
        for(var i=0; i<this.aImg.length; i++){
            (function(index){
                var cur=_this.aImg[index];
                var tmpImg=new Image;
                tmpImg.src=cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src=this.src;
                    var oDiv1=_this.aDiv[0];
                    utils.css(oDiv1,'zIndex',1);
                    animate(oDiv1,{opacity:1},500)
                }
            })(i);
        }
    },
    autoMove:function(){
        if(this.step>=this.aDiv.length-1){
            this.step=-1;
        }
        this.step++;
        this.setBanner();
    },
    setBanner:function(){
        for(var i=0; i<this.aDiv.length; i++){
            if(i===this.step){
                utils.css(this.aDiv[i],'zIndex',1);
                animate(this.aDiv[i],{opacity:1},500,function(){
                    var siblings=utils.siblings(this);
                    for(var i=0; i<siblings.length; i++){
                        animate(siblings[i],{opacity:0});
                    }
                })
                continue;
            }
            utils.css(this.aDiv[i],'zIndex',0);
        }
        this.bannerTip();
    },
    bannerTip:function(){
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].className=i==this.step?'on':null;
        }
    },
    overout:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            utils.css(_this.oBtnLeft,'display','block');
            utils.css(_this.oBtnRight,'display','block');
        };

        this.oBox.onmouseout=function(){
           _this.timer=setInterval(function(){
               _this.autoMove();
           },1000)
            utils.css(_this.oBtnLeft,'display','none');
            utils.css(_this.oBtnRight,'display','none');
            console.log(_this.oBtnLeft)
        };

    },
    handleChange:function(){
        var _this=this;
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].index=i;
            this.aLi[i].onclick=function(){
                _this.step=this.index;
                _this.setBanner();
            }
        }
    },
    leftRight:function(){
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        this.oBtnLeft.onclick=function(){
            if(_this.step<=0){
                _this.step=_this.aDiv.length;
            }
            _this.step--;
            _this.setBanner();
        }
    }
}