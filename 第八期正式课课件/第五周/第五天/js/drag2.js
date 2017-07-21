/**
 * Created by xiao lei on 2016/8/28.
 */
function down(e){
    //保存4个值
    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx=e.clientX;
    this.my=e.clientY;
    //IE和标准浏览器
    if(this.setCapture){
        this.setCapture();
        $event.on(this,'mousemove',move);
        $event.on(this,'mouseup',up);
    }else{
        this.MOVE=$event.processThis(move,this);
        this.UP=$event.processThis(up,this);
        $event.on(document,'mousemove',this.MOVE);
        $event.on(document,'mouseup',this.UP);
    }
    e.preventDefault();
    //鼠标按下时留的接口
    $event.fire(this,'myMouseDown',e)
}
function move(e){
    //计算位置
    var l=this.x+(e.clientX-this.mx);
    var t=this.y+(e.clientY-this.my);
    //以下都是边界值的判断；
    var maxl=(document.documentElement.clientWidth||document.body.clientWidth)-this.offsetWidth;
    var maxt=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
    if(l+100>maxl){
        l=maxl;
    }else if(l<0){
        l=0;
    }
    if(t>maxt){
        t=maxt;
    }else if(t<0){
        t=0;
    }
    this.style.left=l+'px';
    this.style.top=t+'px';
    //鼠标移动时留的接口
    $event.fire(this,'myMouseMove',e);
}
function up(){
    if(this.releaseCapture){
        this.releaseCapture();
        $event.off(this,'mousemove',move);
        $event.off(this,'mouseup',up);
    }else{
        $event.off(document,'mousemove',this.MOVE);
        $event.off(document,'mouseup',this.UP);
    }
    //鼠标抬起时留的接口
    $event.fire(this,'myMouseUp');
}