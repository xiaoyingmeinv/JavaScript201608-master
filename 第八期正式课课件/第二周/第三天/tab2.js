/**
 * Created by xiao lei on 2016/8/4.
 */
(function(){
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;
    var tCells=tHead.rows[0].cells;
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;
    var data=null;
    //1.获取并解析数据
    getData();
    function getData(){
        //1.创建一个xml对象
        var xml=new XMLHttpRequest();
        //2.打开地址
        xml.open('get','data.txt',false);
        //3.响应请求
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        //4.发送请求
        xml.send();
    }
    //2.绑定数据
    bind();
    function bind(){
        var frg=document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var cur=data[i];
            var oTr=document.createElement('tr');
            for(var attr in cur){
                if(attr==='sex'){
                    cur[attr]=cur[attr]===0?'男':'女';
                }
                var oTd=document.createElement('td');
                oTd.innerHTML=cur[attr];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg=null;
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
        var _this=this;
        for(var i=0; i<tCells.length; i++){
            tCells[i].flag=i===n?tCells[i].flag*-1:-1;
            /*if(i===n){
                tCells[i].flag*=-1;
            }else{
                tCells[i].flag=-1;//让其他的列的flag属性恢复初始值
            }*/
        }
        //1.类数组转数组--把获取到每一行的元素集合 转成 数组
        var ary=utils.makeArray(aRows);
        //2.数组的sort排序:每一行的索引为1的每一列的内容；
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){
                return a.localeCompare(b)*_this.flag;
            }
            return (a-b)*_this.flag;//是数字的时候，按数字排序
        });
        window.ary=ary;
        //3.把已经排好序的数组重新放入页面
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
            tCells[i].flag=-1;
            tCells[i].index=i;
            tCells[i].onclick=function(){
                sort.call(this,this.index);
                //sort方法中的this都是当前发生点击事件的这一列；
            }
        }
    }
    /*tCells[1].flag=-1;
    tCells[1].index=1;
    tCells[1].onclick=function(){
        sort.call(this,this.index);
        //sort方法中的this都是当前发生点击事件的这一列；
    }*/
})();