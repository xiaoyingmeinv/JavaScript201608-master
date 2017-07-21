/**
 * Created by xiao lei on 2016/8/4.
 */
/*获取元素：1.获取数据并解析数据，2.绑定数据，3.隔行换色的效果，4.表格排序*/
(function(){
    //获取元素
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;
    var tCells=tHead.rows[0].cells; //第一行的所有列；
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;
    var data=null;
    //1.获取数据并解析数据
    getDate();
    function getDate(){
        var xml=new XMLHttpRequest;
        xml.open('get','data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    }
    //2.绑定数据
    bind();
    /*function bind(){//字符串拼接
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
    }*/
    function bind(){
        var frg=document.createDocumentFragment();//创建一个文档碎片
        for(var i=0; i<data.length; i++){
            var cur=data[i];
            var oTr=document.createElement('tr');
            for(var attr in cur){
                if(attr==='sex'){//判断每个属性是否为sex，如果是需要单独处理；
                    cur[attr]=cur[attr]===0?'男':'女';
                }
                var oTd=document.createElement('td');
                oTd.innerHTML=cur[attr];
                oTr.appendChild(oTd);//把每个td放入tr的容器
            }
            frg.appendChild(oTr);//把每个tr放入frg文档碎片的容器；
        }
        tBody.appendChild(frg);
        frg=null;//在frg完成任务后，他就没用了，把它释放；
    }
    //3.隔行换色的效果
    changeColor();
    function changeColor(){
        for(var i=0; i<aRows.length; i++){
            aRows[i].className='bg'+i%2;//利用%的小技巧，有几种情况就%几；
        }
    }
    //4.表格排序;
    function sort(n){//功能：是为了实现排序
        var _this=this;//把变量保存正确的this：你当前点击的这一列；
        for(var i=0; i<tCells.length; i++){
            tCells[i].flag=i===n?tCells[i].flag*-1:-1;
            /*if(i===n){//说明他是我们当前点击的这一列
                tCells[i].flag*=-1; //1 -1 1 -1.....
            }else{//不是我们点击的列，让他恢复成初始状态-1；
                tCells[i].flag=-1;
            }*/
        }

        //1.类数组转数组
        var ary=utils.makeArray(aRows);//ary里放的是每一行 tr;
        //2.sort排序
        ary.sort(function(a,b){
            //a:当前这一行 b：下一行  aim：那当前行索引为1的列的内容 pk 下一行索引为1的列的内容；
            a= a.cells[n].innerHTML; //n：当前点击这一列的索引；
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){//如果是非有效数字的话，进行汉字的比较；
                return a.localeCompare(b)*_this.flag;//_this：为了避免this的问题；因为在回调函数中this是window；但  我们这里要的应该当前发生点击事件的这一列；
            }
            return (a-b)*_this.flag;//1 -1 1 -1......
        });
        window.ary=ary;
        //3.把排好序的数组重新插入页面；
        var frg=document.createDocumentFragment();
        for(var i=0; i<ary.length; i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeColor();
    }
    for(var i=0; i<tCells.length; i++){
        //判断哪一列的className=='cursor'才让谁有点击事件；
        if(tCells[i].className==='cursor'){
            tCells[i].flag=-1; //给每一列都添加自己的自定义属性：flag；
            tCells[i].index=i;//添加自定义属性index，保存它的索引值；
            tCells[i].onclick=function(){
                //this：当前点击的这一列；
                sort.call(this,this.index);
                //参一：把sort中的this都变成你当前点击的这一列；
                //参二：当前这一列的索引；
            }
        }
    }
    /*//点击第一列的时候，希望拿每一行的第一列进行从小到大的比较；
    tCells[1].flag=-1; //1 -1 1
    tCells[1].index=1;//添加自定义属性，保存它的索引值；
    tCells[1].onclick=function(){
        sort.call(this,this.index);
    }*/
})();