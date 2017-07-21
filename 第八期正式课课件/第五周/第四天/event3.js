/**
 * Created by xiao lei on 2016/8/27.
 */
/*
* 1.先处理DOM2级事件兼容：标准addEventListener  IE:attachEvent;
* 2.IE下的this问题；
* 3.IE下重复绑定问题；
* 4.IE下的顺序问题；
* */
//给当前元素的某个行为绑定某个方法；
//绑定方法
function bind(ele,type,fn){
    //1.先处理DOM2级事件兼容：标准addEventListener  IE:attachEvent;
    if(ele.addEventListener){//标准浏览器
        ele.addEventListener(type,fn,false);
    }else{//IE浏览器
        //attachEvent这个方法，绑定fn中this指向的是window；而不是ele,所以，我们需要把this改成ele;
        var tmpFn=function(){
            fn.call(ele);
        };
        tmpFn.name=fn;
        //把数组存在元素的自定义属性上，这样unbind就可以使用这个数组；我们把自己定义的数组叫做自己的事件池；自己事件池通过push来添加；
        if(!ele['bindEvent'+type]){
            ele['bindEvent'+type]=[];
        }
        var a=ele['bindEvent'+type];
        //给数组添加tmpFn这个函数之前，要坚持数组中是否已经存在该函数--目的为了避免重复绑定；
        for(var i=0; i<a.length; i++){
            if(a[i].name==fn) return;
        }
        a.push(tmpFn);//给自己事件池添加了tmpFn;--fn;
        ele.attachEvent('on'+type,tmpFn);//给系统事件池添加tmpFn;--fn;
        //自己事件池中的tmpFn和系统事件池中tmpFn指向同一个堆内存；
    }
}
//解除绑定
function unbind(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{
        var a=ele['bindEvent'+type];//拿到自定义属性上的数组了；
        if(a && a.length){//如果能进if，说明自己事件池和系统事件池中都有方法；因为自己事件池和系统事件池是同步绑定的；
            for(var i=0; i<a.length; i++){
                if(a[i].name==fn){
                    ele.detachEvent('on'+type,a[i]);//解除系统事件池的方法
                    a.splice(i,1);//解除自己事件池的方法；
                    break;
                }
            }

        }
        /*ele.detachEvent('on'+type,tmpFn);*/
    }
}
//...........................................
//1.把所有该行为下的方法，都放进自己事件池；
//如果on方法被调用3次，那自己的事件池中会有3个方法；系统的事件池只有一个run方法；
function on(ele,type,fn){
    if(!ele['onEvent'+type]){
        ele['onEvent'+type]=[];
    }
    var a=ele['onEvent'+type];
    //如果自己事件池中已经有了该方法，不重复添加；
    for(var i=0; i<a.length; i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
    //2.只把run方法放进系统事件池；
    bind(ele,type,run);
}
//4.off要解除事件绑定，我们只需要解除自己事件池中的方法；
function off(ele,type,fn){
    var a=ele['onEvent'+type];//拿到自己事件池
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(a[i]==fn){
                a[i]=null;
                break;
            }
        }
    }
}
//3.run方法要做的就是让自己事件池中的所有方法有顺序的执行；
function run(e){
    //this->ele;
    var e=e||window.event;
    var type=e.type;
    if(window.event){//IE浏览器
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
        e.target=e.srcElement;
        e.preventDefault=function(){//阻止默认事件
            e.returnValue=false;
        };
        e.stopPropagation=function(){
            e.cancelBubble=true;
        };

    }
    var a=this['onEvent'+type];//自己事件池
    if(a && a.length){
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
/*封装on方法和off方法的思路
* 1.把所有的方法都放进自己的事件池
* 2.把run方法放进系统的事件池
* 3.run方法的作用：当行为被触发的时候，run方法中把所有自己事件池中的方法都挨个调用；
* 4.off方法：因为系统事件池中只有一个run方法，所以，我们解除事件绑定时，只需要操作自己事件池中对应的方法即可；
*
* */













