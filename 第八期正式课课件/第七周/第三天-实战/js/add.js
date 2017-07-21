~function (pro) {
    //->http://old.zhufengpeixun.cn/qianduanjishuziliao/javaScriptzhuanti/2016-07-02/482.html
    function queryURLParameter() {
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj['HASH'] = reg.exec(this)[1];
        }
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

//->CONTROL RENDER
var controlRender = (function () {
    var cusId = null,
        isFlag = false;//->FALSE代表增加,TRUE代表修改
    var userName = document.getElementById('userName'),
        userAge = document.getElementById('userAge'),
        userPhone = document.getElementById('userPhone'),
        userAddress = document.getElementById('userAddress'),
        submit = document.getElementById('submit');

    //->SUBMIT
    function bindEvent() {
        submit.onclick = function () {
            //->获取四个文本框中的内容,把它们放在一个JSON对象中:如果当前是修改操作还需要多存储一个ID
            var obj = {
                "name": userName.value,
                "age": userAge.value,
                "phone": userPhone.value,
                "address": userAddress.value
            };
            //->修改
            if (isFlag) {
                obj["id"] = cusId;
                ajax({
                    url: '/updateInfo',
                    type: 'POST',
                    data: JSON.stringify(obj),
                    success: function (result) {
                        if (result && result.code == 0) {
                            //->修改成功
                            window.location.href = 'index.html';
                        }
                    }
                });
                return;
            }
            //->增加
            ajax({
                url: '/addInfo',
                type: 'POST',
                data: JSON.stringify(obj),
                success: function (result) {
                    if (result && result.code == 0) {
                        //->增加成功
                        window.location.href = 'index.html';//->跳转到具体的某一个页面
                    }
                }
            });
        }
    }

    return {
        init: function () {
            //->GET URL CHECK ADD OR UPDATE
            var nowURL = window.location.href;//->获取当前页面的URL
            cusId = nowURL.queryURLParameter()['id'];
            typeof cusId !== 'undefined' ? isFlag = true : null;

            //->BIND EVENT
            bindEvent();

            //->IF IS UPDATE , MUST GET CUSTOM INFO
            if (isFlag) {
                ajax({
                    url: '/getInfo?id=' + cusId,
                    cache: false,
                    success: function (result) {
                        if (result && result.code == 0) {
                            var data = result.data;
                            userName.value = data.name;
                            userAge.value = data.age;
                            userPhone.value = data.phone;
                            userAddress.value = data.address;
                        }
                    }
                });
            }
        }
    }
})();
controlRender.init();


