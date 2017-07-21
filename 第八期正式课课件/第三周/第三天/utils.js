/**
 * Created by xiao lei on 2016/8/10.
 */
var utils=(function(){
    return {
        win:function(attr,value){
            if(value===undefined){
                return document.documentElement[attr]||document.body[attr];
            }
            document.documentElement[attr]=document.body[attr]=value;
        },
        getCss:function(curEle,attr){
            var val=null;
            var reg=null;
            if('getComputedStyle' in window){
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
        jsonParse:function(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        },
        rnd:function(n,m){
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
        makeArray:function(arg){
            var ary=[];
            try{
                ary=Array.prototype.slice.call(arg);
            }catch(e){
                for(var i=0; i<arg.length; i++){
                    ary.push(arg[i])
                }
            }
            return ary;
        }
    }
})();