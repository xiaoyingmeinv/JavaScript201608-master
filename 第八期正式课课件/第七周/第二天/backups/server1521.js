var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->服务器端处理客户端静态资源文件的请求
    //->静态资源文件:HTML/CSS/JS/PNG/GIF...
    //->前提:SERVER.JS在当前项目的根目录下
    var reg = /\.(HTML|CSS|JS|ICO)/i;
    if (reg.test(pathname)) {
        //->通过请求资源文件的后缀名获取对应的MIME类型
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = 'text/plain';
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

        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf-8');
            //->在返回给客户端内容的时候,还需要告诉客户端文件的MIME类型
            response.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            response.end(conFile);
        } catch (e) {
            //->当前客户端请求的资源文件不存在
            response.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            response.end('request file is not found~');
        }
    }
});
server1.listen(8080, function () {
    console.log('server is success,listing on 8080 port!');
});

