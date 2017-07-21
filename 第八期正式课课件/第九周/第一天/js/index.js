/*REM*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 640) * 100 + 'px';

/*BIND DATA AND ALL*/
var bannerRender = (function () {
    var banner = document.querySelector('.banner'),
        wrapper = banner.querySelector('.wrapper'),
        tip = banner.querySelector('.tip');
    var step = 1,
        count = 0,
        speed = 200,
        autoInterval = 3000,
        maxL = 0,
        minL = 0;
    var winW = document.documentElement.clientWidth;

    function bindWrapper(result) {
        //->为了实现LOOP模式,我们需要把第一张放在末尾,把最后一张放在开头
        result.push(result[0]);
        result.unshift(result[result.length - 2]);
        wrapper.innerHTML = ejs.render(document.querySelector('#wrapperTemplate').innerHTML, {data: result});

        //->重新计算值
        wrapper.style.width = count * winW + 'px';
        wrapper.style.left = -winW + 'px';
        [].forEach.call(wrapper.querySelectorAll('.slide'), function (item, index) {
            item.style.width = winW + 'px';
        });
    }

    function bindTip(result) {
        //->result已经是多出两张的结果,我们需要去除首尾才是真实图片的个数
        result.pop();
        result.shift();
        tip.innerHTML = ejs.render(document.querySelector('#tipTemplate').innerHTML, {data: result});
    }

    //->lazyImg:图片的延迟加载,只是把当前块和相邻的两块做延迟加载
    function lazyImg() {
        var imgList = wrapper.querySelectorAll('img');
        var stepPrev = step - 1,
            stepNext = step + 1;
        stepPrev < 0 ? stepPrev = 0 : null;
        stepNext > count - 1 ? stepNext = count - 1 : null;
        [].forEach.call(imgList, function (curImg, index) {
            if (curImg.isLoad) return;
            if (index == step || index == stepPrev || index == stepNext) {
                var oImg = new Image;
                oImg.src = curImg.getAttribute('data-src');
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.isLoad = true;
                    oImg = null;
                }
            }
        });
    }

    //->处理左右滑动
    var isSwipe = function (changeX, changeY) {
        return Math.abs(changeX) > 10 || Math.abs(changeY) > 10;
    };
    var swipeDir = function (changeX, changeY) {
        return Math.abs(changeX) >= Math.abs(changeY) ? (changeX < 0 ? 'left' : 'right') : (changeY < 0 ? 'up' : 'down');
    };
    var start = function (ev) {
        //->touchs只有手机在屏幕上才可以获取到,离开就不存在了,changeTouches只要发生改变就会有
        var point = ev.touches[0];
        this['strX'] = point.clientX;
        this['strY'] = point.clientY;
        this['strL'] = parseFloat(wrapper.style.left);
        wrapper.style.webkitTransitionDuration = '0s';
    };
    var move = function (ev) {
        var point = ev.touches[0];
        this['changeX'] = point.clientX - this['strX'];
        this['changeY'] = point.clientY - this['strY'];
        this['isFlag'] = isSwipe(this['changeX'], this['changeY']);
        this['swipeDir'] = swipeDir(this['changeX'], this['changeY']);

        if (this['isFlag'] && /(left|right)/.test(this['swipeDir'])) {
            var curL = this['strL'] + this['changeX'];
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
            wrapper.style.left = curL + 'px';
        }
    };
    var end = function (ev) {
        var isFlag = this['isFlag'],
            dir = this['swipeDir'],
            changeX = this['changeX'];
        if (isFlag && /(left|right)/.test(dir)) {
            if (Math.abs(changeX) >= winW / 2) {
                if (dir === 'left') {
                    step++;
                }
                if (dir === 'right') {
                    step--;
                }
            }
            wrapper.style.webkitTransitionDuration = speed / 1000 + 's';
            wrapper.style.left = -step * winW + 'px';
            lazyImg();
            wrapper.addEventListener('transitionend', function () {
                wrapper.style.webkitTransitionDuration = '0s';
                if (step === count - 1) {
                    step = 1;
                    wrapper.style.left = -step * winW + 'px';
                    lazyImg();
                }
                if (step === 0) {
                    step = count - 2;
                    wrapper.style.left = -step * winW + 'px';
                    lazyImg();
                }
            }, false);
            //window.setTimeout(function () {
            //    wrapper.style.webkitTransitionDuration = '0s';
            //    if (step === count - 1) {
            //        step = 1;
            //        wrapper.style.left = -step * winW + 'px';
            //        lazyImg();
            //    }
            //    console.log(step);
            //    if (step === 0) {
            //        step = count - 2;
            //        console.log(step);
            //        wrapper.style.left = -step * winW + 'px';
            //        console.log(-step * winW);
            //        lazyImg();
            //    }
            //}, speed);
        }
    };

    return {
        init: function () {
            ajax({
                url: 'json/banner.json',
                type: 'GET',
                dataType: 'JSON',
                cache: false,
                success: function (result) {
                    count = result.length + 2;
                    minL = -(count - 1) * winW;

                    //->EJS
                    bindWrapper(result);
                    bindTip(result);

                    //->LAZY IMG
                    lazyImg();

                    //->swipe
                    banner.addEventListener('touchstart', start, false);
                    banner.addEventListener('touchmove', move, false);
                    banner.addEventListener('touchend', end, false);
                }
            });
        }
    }
})();
bannerRender.init();