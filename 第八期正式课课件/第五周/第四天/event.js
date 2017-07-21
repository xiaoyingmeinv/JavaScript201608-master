/**
 * Created by xiao lei on 2016/8/27.
 */
//1.this问题 2.重复 3.顺序
function bind(ele,type,fn){ //绑定事件
    if(ele.addEventListener){//标准浏览器的事件绑定
        ele.addEventListener(type,fn,false);
    }else{//处理IE浏览器的兼容
        var tmpFn=function(){
            fn.call(ele)
        };
        tmpFn.name=fn;
        if(!ele['bindEvent'+type]){//没有数组的时候，我们创建一个数组；
            ele['bindEvent'+type]=[];
        }
        var a=ele['bindEvent'+type];
        a.push(tmpFn);//放到我们自己的事件池中；
        ele.attachEvent('on'+type,tmpFn);//系统事件池中；
    }
}
function unbind(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{
        var a=ele['bindEvent'+type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i].name==fn){
                    ele.detachEvent('on'+type,a[i]);//这里解除的是系统的tmpFn;
                    a.splice(i,1);
                }
            }
        }

    }
}