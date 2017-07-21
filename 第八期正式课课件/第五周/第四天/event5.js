/**
 * Created by xiao lei on 2016/8/27.
 */
(function(){
    function processThis(fn,obj){
        return function(e){
            fn.call(obj,e)
        }
    }
    function on(ele,type,fn){
        if(ele.addEventListener){//标准浏览器事件绑定
            ele.addEventListener(type,fn,false);
            return;
        }
        //以下都是IE浏览器；
        //1.创建自己事件池
        if(!ele['onEvent'+type]){//if中的代码只会走一次；
            ele['onEvent'+type]=[];
            //注意：把attachEvent放到这里面，就解决了重复绑定的问题；
            //2.给系统事件池添加run方法；
            ele.attachEvent('on'+type,function(){
                run.call(ele);//解决了run方法中的this问题，而且，这个匿名函数不需要解除事件绑定；
            });//run方法中的this指向window，我们需要改成ele;
        }
        var a=ele['onEvent'+type];
        //避免自己事件池重复添加
        for(var i=0; i<a.length; i++){
            if(a[i]==fn) return;
        }
        a.push(fn);
    }
    //run方法只会在IE浏览器下被触发；
    function run(){
        var e=window.event;
        var type=e.type;
        //做IE浏览器下事件对象详细信息的兼容处理；
        e.target=e.srcElement;
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
        e.preventDefault=function(){
            e.returnValue=false;
        };
        e.stopPropagation=function(){
            e.cancelBubble=true;
        };
        var a=this['onEvent'+type];
        if(a && a.length){//函数顺序调用；
            for(var i=0; i<a.length; i++){
                if(typeof a[i]=='function'){
                    a[i].call(this,e);
                }else{
                    a.splice(i,1);
                    i--;
                }
            }
        }
    }
    function off(ele,type,fn){
        if(ele.removeEventListener){//标准浏览器下解除事件绑定
            ele.removeEventListener(type,fn,false);
            return;
        }
        var a=ele['onEvent'+type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i]==fn){
                    a[i]=null;
                    break;
                }
            }
        }
    }
    window.$event={
        on:on,
        off:off,
        processThis:processThis
    }
})();