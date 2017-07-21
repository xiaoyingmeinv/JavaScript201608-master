/**
 * Created by xiao lei on 2016/8/13.
 */
window.onload=function(){
    //获取元素
    var oDiv=document.getElementById('div');
    var aUl=oDiv.getElementsByTagName('ul');
    var aLi=oDiv.getElementsByTagName('li');
    var aImg=oDiv.getElementsByTagName('img');
    var oBtn=document.getElementById('btn');
    var timer=null;
    var bOk=false;
    //模拟数据
    var data=[
        {"src":"img2/1.jpg"},
        {"src":"img2/2.jpg"},
        {"src":"img2/3.jpg"},
        {"src":"img2/4.jpg"},
        {"src":"img2/5.jpg"},
        {"src":"img2/6.jpg"},
        {"src":"img2/7.jpg"},
        {"src":"img2/8.jpg"},
        {"src":"img2/9.jpg"},
        {"src":"img2/10.jpg"}
    ];
    /*----------------瀑布流模块 start-----------------------*/
    //创建1个元素
    function createLi(){
        var oLi=document.createElement('li');
        oLi.style.height=utils.rnd(80,150)+'px';
        oLi.innerHTML='<img realImg="'+data[utils.rnd(0,9)].src+'" alt=""/>';
        return oLi;
    }
    //创建50个元素
    function li50(){
        for(var i=0; i<50; i++){
            var oLi=createLi();
            var ary=utils.makeArray(aUl);
            ary.sort(function(a,b){
                return utils.getCss(a,'height')-utils.getCss(b,'height')
            });
            ary[0].appendChild(oLi);
        }
    }
    /*----------------延迟加载 start-----------------------*/
    //符合条件才加载
    function showImg(){
        var scrollBottom=utils.win('scrollTop')+utils.win('clientHeight');
        for(var i=0; i<aLi.length; i++){
            var imgPos=utils.offset(aLi[i]).top+utils.getCss(aLi[i],'height');
            if(imgPos<scrollBottom){
                lazyImg(aImg[i],aLi[i]);
            }
        }
    }
    function lazyImg(img){//图片的延迟加载；
        if(img.loaded) return;
        var tmpImg=new Image;
        tmpImg.src=img.getAttribute('realImg');
        tmpImg.onload=function(){
            img.src=this.src;
            tmpImg=null;
            img.loaded=true;
            img.parentNode.style.height='auto';
        }
    }
    /*----------------延迟加载 end-----------------------*/
    /*----------------回到顶部 start-----------------------*/
    function toTop(){
        var target=utils.win('scrollTop');
        var duration=1000;
        var interval=30;
        var step=target/duration*interval;
        clearInterval(timer); //清除没用的定时器
        timer=setInterval(function(){
            var curTop=utils.win('scrollTop');
            if(curTop<=0){
                clearInterval(timer); //满足条件关闭定时器；
                return;
            }
            curTop-=step;
            utils.win('scrollTop',curTop);
            bOk=false;
        },interval)
    }
    /*----------------回到顶部 end-----------------------*/
    //页面加载进来时，需要调用的函数；
    li50();
    showImg();
    oBtn.onclick=toTop;
    //满足条件，加载内容
    window.onscroll=function(){
        var scrollBottom=utils.win('scrollTop')+utils.win('clientHeight');
        showImg();
        if(scrollBottom+50>=document.body.scrollHeight){
            li50();
        }
        if(bOk){
            clearInterval(timer);
        }
        bOk=true;
        //一开始不显示按钮，满足条件显示按钮
        if(utils.win('scrollTop')>utils.win('clientHeight')){
            oBtn.style.display='block';
        }else{
            oBtn.style.display='none';
        }
    };
    /*----------------瀑布流模块 end-----------------------*/
};