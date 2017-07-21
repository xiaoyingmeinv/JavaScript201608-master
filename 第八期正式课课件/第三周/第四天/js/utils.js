/**
 * Created by xiao lei on 2016/8/10.
 */
var utils=(function(){
    //惰性思想：对以后都会用到的东西，现存在一个变量中，以后再使用直接使用变量即可；
    var flag='getComputedStyle' in window;
    return {
        win:function win(attr,value){
            if(value===undefined){
                return document.documentElement[attr]||document.body[attr];
            }
            document.documentElement[attr]=document.body[attr]=value;
        },
        jsonParse:function jsonParse(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        },
        rnd:function rnd(n,m){
            n=Number(n);
            m=Number(m);
            if(isNaN(n) || isNaN(m)){
                return Math.random();
            }
            if(n>m){
                var tmp=m;
                m=n;
                n=tmp;
            }
            return Math.round(Math.random()*(m-n)+n);
        },
        makeArray:function makeArray(arg){
            var ary=[];
            if(flag){
                ary=Array.prototype.slice.call(arg);
            }else{
                for(var i=0; i<arg.length; i++){
                    ary.push(arg[i])
                }
            }
            return ary;
        },
        offset:function offset(curEle){
            var l=curEle.offsetLeft;
            var t=curEle.offsetTop;
            var par=curEle.offsetParent;
            while(par){
                if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                    l+=par.clientLeft;
                    t+=par.clientTop;
                }
                l+=par.offsetLeft;
                t+=par.offsetTop;
                par=par.offsetParent;
            }
            return {left:l,top:t}
        },
        getByClass:function(strClass,parent){
            parent=parent||document;
            if(flag){
                return this.makeArray(parent.getElementsByClassName(strClass));
            }
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            var nodeList=parent.getElementsByTagName('*');
            var ary=[];
            for(var i=0; i<nodeList.length; i++){
                var curEle=nodeList[i];
                var bOk=true;
                for(var j=0; j<aryClass.length; j++){
                    //var reg=new RegExp('\\b'+aryClass[j]+'\\b');
                    var reg=new RegExp('(^| +)'+aryClass[j]+'( +|$)');
                    if(!reg.test(curEle.className)){
                        bOk=false;
                    }
                }
                if(bOk){
                    ary.push(curEle);
                }
            }
            return ary;
        },
        //hasClass：检查元素身上是否包含cName这个class名；
        //hasClass检测只检测一个class名；
        hasClass:function hasClass(curEle,cName){
            var reg=new RegExp('(^| +)'+cName+'( +|$)');
            return reg.test(curEle.className);
        },
        //addClass:给元素身上添加一些class名；
        addClass:function addClass(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0; i<aryClass.length; i++){
                var curClass=aryClass[i]; //字符串中传过来的每个class名；
                //如果元素身上没有这个class名的话，我们才添加这个class名；
                if(!this.hasClass(curEle,curClass)){
                    curEle.className+=' '+curClass;
                }
            }
        },
        removeClass:function removeClass(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0; i<aryClass.length; i++){
                //var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)');
                var reg=new RegExp('(\\b)'+aryClass[i]+'(\\b)');
                //如果元素身上有这个class名的话，我们删除该class名
                if(this.hasClass(curEle,aryClass[i])){
                    curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
                    //1.把找到的如何正则内容的字符串替换成空格字符串
                    //2.去除首尾空格
                    //3.把多余的空格替换为一个空格；
                }
            }
        },
        getCss:function getCss(curEle,attr){
            var val=null;
            var reg=null;
            if(flag){
                val=getComputedStyle(curEle,false)[attr];
            }else{
                if(attr==='opacity'){
                    val=curEle.currentStyle.filter;//'alpha(opacity=10)'
                    reg=/^alpha\(opacity[=:](\d+)\)$/i;
                    /*reg=/^alpha\(opacity[=:](\d+)\)$/gi;//但我们添加了全局g,用test时会影响lastIndex；那么，用exec就捕获不到值了；我们通过RegExp.$1取数字值；
                     return reg.test(val)?RegExp.$1/100:1;*/
                    return reg.test(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=curEle.currentStyle[attr];
                }
            }
            reg=/^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
            return reg.test(val)?parseFloat(val):val;
        },
        //setCss:设置一个样式
        setCss:function setCss(curEle,attr,value){
            if(attr==='float'){//处理float的兼容性
                curEle.style.cssFloat=value;//IE
                curEle.style.styleFloat=value;//chrome firfox safari
                return;
            }
            if(attr==='opacity'){//处理透明度的兼容性
                curEle.style.opacity=value;
                curEle.style.filter='alpha(opacity='+(value*100)+')';
                return;
            }
            //对单位的处理：width，height，left...,margin,padding
            var reg=/^(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))$/i;
            if(reg.test(attr)){
                value=parseFloat(value)+'px';   //注意处理如果别人已经加了单位，我们应该点掉他的单位，然后再自己加；
            }
            curEle.style[attr]=value; //核心语句
        },
        setGroupCss:function setGroupCss(curEle,opt){
            for(var attr in opt){
                this.setCss(curEle,attr,opt[attr])
            }
        },
        css:function css(curEle){
            //第二个参数是不确定，所以我们不需要写第二个形参；
            var arg2=arguments[1];
            if(typeof arg2==='string'){//两种情况：1）获取时，没有第三个参数 2）设置一个样式；
                var arg3=arguments[2];
                if(arg3===undefined){//当第三个参数不存在，说明是获取；
                    return this.getCss(curEle,arg2);
                }else{//说明第三个参数存在,用来设置一个样式；
                    this.setCss(curEle,arg2,arg3);
                }
            }
            if(arg2.toString()==='[object Object]'){//设置一组样式
                this.setGroupCss(curEle,arg2);
            }
            /*if(arg2.constructor===Object){
                this.setGroupCss(curEle,arg2);
            }*/

        }

    }
})();