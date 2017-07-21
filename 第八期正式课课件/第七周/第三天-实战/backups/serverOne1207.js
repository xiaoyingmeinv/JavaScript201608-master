var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->处理静态资源文件的请求
    var reg = /\.([a-z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        var conFile = 'file is not found!',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf8');
            status = 200;
        } catch (e) {
            suffixMIME = 'text/plain';
        }
        response.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        response.end(conFile);
        return;
    }

    //->处理客户端使用AJAX进行的数据请求:严格按照API接口文档中的规范实现对应的功能即可
    var customData = fs.readFileSync('./json/custom.json', 'utf-8');//->通过fs.readFileSync获取的内容都是字符串
    customData = customData.length === 0 ? '[]' : null;//->避免JSON.parse('')会报错
    customData = JSON.parse(customData);//->JSON格式的对象

    var result = {code: 1, msg: 'error', data: null};
    if (pathname === '/getAllList') {
        if (customData.length > 0) {
            result = {
                code: 0,
                msg: 'success',
                data: customData
            };
        }
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
    }
});
server1.listen(80, function () {
    console.log('server is success,listing on 80 port!');
});