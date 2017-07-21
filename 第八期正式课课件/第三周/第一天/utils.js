/**
 * Created by xiao lei on 2016/8/9.
 */
var utils=(function(){
    return {
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
        jsonParse:function(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        },
        win:function(attr,value){
            if(typeof value === 'undefined'){
                return document.documentElement[attr]||document.body[attr];
            }
            document.documentElement[attr]=document.body[attr]=value;
        }
    }
})();