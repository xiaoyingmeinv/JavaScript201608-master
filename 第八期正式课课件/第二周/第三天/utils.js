/**
 * Created by xiao lei on 2016/8/4.
 */
var utils=(function(){
    return {
        /**
         * makeArray:类数组转数组
         * @param arg
         * @returns {Array}
         */
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
        /**
         * jsonParse:把JSON格式的字符串转成JSON格式的数据（对象）
         * @param str
         * @returns {Object}
         */
        jsonParse:function(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        }
    }
})();