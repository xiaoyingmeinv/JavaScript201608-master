/**
 * Created by xiao lei on 2016/8/7.
 */
(function(){
    //获取元素  1.获取并解析数据 2.绑定数据 3.隔行换色 4.表格排序 （不断的优化）
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;
    var tCells=tHead.rows[0].cells;
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;
    var data=null;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    //2.绑定数据
    //思路1：字符串拼接
    bind();
    function bind(){
        var str='';
        for(var i=0; i<data.length; i++){
            var cur=data[i];
            cur.sex=cur.sex===0?'男':'女';
            str+='<tr>\
                <td>'+cur.name+'</td>\
                <td>'+cur.age+'</td>\
                <td>'+cur.score+'</td>\
                <td>'+cur.sex+'</td>\
                </tr>';
        }
        tBody.innerHTML=str;
    }
    //3.隔行换色
    changeColor();
    function changeColor(){
        for(var i=0; i<aRows.length; i++){
            aRows[i].className='bg'+i%2;
        }
    }
    //4.表格排序
    function sort(n){
        for(var i=0; i<tCells.length; i++){
            tCells[i].flag=i===n?tCells[i].flag*-1:-1;
        }
         //1 -1 1 -1
        //1.类数组转数组
        var ary=utils.makeArray(aRows);
        //2.sort排序
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;
        });
        //3.重新插入页面
        var frg=document.createDocumentFragment();
        for(var i=0; i<ary.length; i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeColor();
    }
    for(var i=0; i<tCells.length; i++){
        if(tCells[i].className==='cursor'){
            tCells[i].index=i;
            tCells[i].flag=-1;
            tCells[i].onclick=function(){
                sort(this.index);
            }
        }
    }
    /*tCells[1].index=1;
    tCells[1].flag=-1;
    tCells[1].onclick=function(){
        sort(this.index);
    }*/
})();