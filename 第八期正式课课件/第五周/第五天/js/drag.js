/**
 * Created by xiao lei on 2016/8/28.
 */
function down(e){
    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx=e.clientX;
    this.my=e.clientY;
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
    //return false 也是阻止默认事件，但是他一遇到DOM2级事件绑定，就失效了；
    e.preventDefault?e.preventDefault(): e.returnValue=false;
    //页面中如果有内容的话，一定要添加阻止默认事件；
    //.......以下都是跟拖拽无关的代码.....；
    $event.fire(this,'myDragStart',e); //留一个当开始拖拽时候的接口
}
function move(e){
    this.style.left=this.x+(e.clientX-this.mx)+'px';
    this.style.top=this.y+(e.clientY-this.my)+'px';
    //.......以下都是跟拖拽无关的代码.....；
    $event.fire(this,'myDragging',e); //给拖拽过程中留一个接口

}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        $event.off(this,'mousemove',move);
        $event.off(this,'mouseup',up);
    }else{
        $event.off(document,'mousemove',this.MOVE);
        $event.off(document,'mouseup',this.UP);
    }
    //.......以下都是跟拖拽无关的代码.....；
    $event.fire(this,'myDragEnd',e); //给拖拽结束留下一个接口
}
