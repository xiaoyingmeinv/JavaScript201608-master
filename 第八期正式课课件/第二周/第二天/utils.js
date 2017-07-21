/**
 * Created by xiao lei on 2016/8/3.
 */
var utils={
    /**
     * makeArray:把类数组转成数组
     * @param arg：类数组
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
     * jsonParse:把JSON格式的字符串转成JSON格式的数据
     * @param jsonStr
     */
    jsonParse:function(jsonStr){
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')')
    }
}