/**
 * Created by xiao lei on 2016/8/27.
 */
function bind(ele,type,fn){
    //1.做浏览器兼容处理
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }else{
        //匿名函数无法解除事件绑定；
        var tmpFn=function(){
            fn.call(ele);
        };
        tmpFn.name=fn;
        //一开始没有数组，我们在自定义属性上创建一个数组
        if(!ele['bindEvent'+type]){
            ele['bindEvent'+type]=[];
        }
        var a=ele['bindEvent'+type];
        for(var i=0; i<a.length; i++){//避免重复绑定
            if(a[i].name==fn) return;
        }
        a.push(tmpFn); //给自己事件池添加
        ele.attachEvent('on'+type,tmpFn);//给系统事件池添加；
        //给系统事件池和自己事件池同步添加；
    }
}
function unbind(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{//下面都是处理IE的兼容性；
        //1.先拿到自定义属性上数组；要删除也要明白删除的是数组中的哪一个；
        var a=ele['bindEvent'+type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i].name==fn){
                    ele.detachEvent('on'+type,a[i]);//删除系统事件池；
                    a.splice(i,1);
                    break;

                }
                //思路2：提前保存数组中的每一个；
                /*var cur=a[i];
                if(cur.name==fn){
                    a.splice(i,1);
                    ele.detachEvent('on'+type,cur);
                    break;
                }*/
            }
        }
    }
}
//..................................................
/*
* 1.把所有方法都放进自己事件池
* 2.把run方法放入系统事件池
* 3.当行为被触发的时候，调用的是run方法；run方法中，把自己事件池中的所有方法顺序调用；
* 4.off中解除绑定解除的是自己事件池，因为在系统事件池中只有一个run方法；
* */
function on(ele,type,fn){
    //1.把所有方法都放进自己事件池
    if(!ele['onEvent'+type]){
        ele['onEvent'+type]=[];
    }
    var a=ele['onEvent'+type];
    for(var i=0; i<a.length; i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
    //2.绑定系统事件
    bind(ele,type,run);
}
function run(e){//run中让所有自己事件池中的方法顺序调用；
    //this-ele;
    e=e||window.event; //run方法被标准浏览器和IE浏览器同时调用；
    var type=e.type;
    var a=this['onEvent'+type];
    if(a && a.length){
        //思路1：让自己事件池中的每个方法执行，同时预防数组塌陷；
        for(var i=0; i<a.length; i++){
            //判断a[i]是否为函数,是，执行
            if(typeof a[i]=='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;//一定要防止数组塌陷；
            }
        }
        //思路2：让自己事件池中的每个方法执行，同时预防数组塌陷；
        /*for(var i=0; i<a.length;){
            if(typeof a[i]=='function'){
                a[i].call(this,e);
                i++;//预防数组塌陷；
            }else{
                a.splice(i,1);
            }
        }*/
    }

}
//off方法删除的是自己事件池中的方法；
function off(ele,type,fn){
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