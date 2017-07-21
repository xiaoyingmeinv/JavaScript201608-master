//->在SERVER模块中导入三个内置的模块,用每一个模块中提供的方法完成我们服务器端要处理的事情
var http = require('http'),
    url = require('url'),
    fs = require('fs');

//->创建一个服务并且监听了一个端口号
var server1 = http.createServer(function (request, response) {
    //->获取客户端请求的URL地址,经过URL模块中的PARSE进行解析,得到最后想要的:pathname(存储客户端请求的资源文件的路径名称)、query(客户端通过问号传递参数传递给服务器的数据内容都存在这里)
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->获取PATH NAME对应文件中的源代码,把原代码返回给客户端
    if (pathname === '/index.html') {
        var conFile = fs.readFileSync('./index.html', 'utf-8');

        response.write(conFile);
        response.end();
    }
});
server1.listen(8080, function () {
    console.log('server is success,listing on 8080 port!');
});

