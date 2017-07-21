/**
 * Created by xiao lei on 2016/8/27.
 */
function bind(ele,type,fn){
    if(ele.addEventListener){//标准浏览器的添加
        ele.addEventListener(type,fn,false);
    }else{
        //因为tmpFn现在属于私有变量；在其他函数中无法获取到；
        var tmpFn=function(){//如果让tmpFn变成全局变量，会存在覆盖的问题；
            //处理this问题；把this变成ele;
            fn.call(ele);//fn中的this变成了ele;但是匿名函数无法解除事件绑定；
        };
        tmpFn.name=fn;
        if(!ele['bindEvent'+type]){
            ele['bindEvent'+type]=[];
        }
        var a=ele['bindEvent'+type];
        for(var i=0; i<a.length; i++){//避免重复绑定的问题；
            if(a[i].name===fn) return;
        }
        a.push(tmpFn);//把每个方法都放在了自己的事件池中；
        ele.attachEvent('on'+type,tmpFn);//给系统事件池添加方法；
    }
}
function unbind(ele,type,fn){
    if(ele.removeEventListener){//标准浏览器的解除
        ele.removeEventListener(type,fn,false);
    }else{
        var a=ele['bindEvent'+type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i].name==fn){
                    ele.detachEvent('on'+type,a[i]);//解除系统事件池；
                    a.splice(i,1);//不要把它写在前面，否则会出现数组塌陷的问题；
                    break;
                }
            }
        }
        //ele.detachEvent('on'+type,fn)
    }
}