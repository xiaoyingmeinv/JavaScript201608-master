/**
 * Created by xiao lei on 2016/8/7.
 */
var utils=(function(){
    //惰性思想的运用--预告
    return {
        //makeArray：类数组转数组
        makeArray:function(arg){
            var ary=[];
            try{
                ary=Array.prototype.slice.call(arg);
            }catch(e){
                for(var i=0; i<arg.length; i++){
                    ary.push(arg[i]);
                }
            }
            return ary;
        },
        //jsonParse:JSON格式的字符串 转成 JSON格式的对象
        jsonParse:function(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        }
    }
})();