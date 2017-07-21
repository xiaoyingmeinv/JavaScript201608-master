var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->处理静态资源文件的请求
    var reg = /\.([a-z]+)/i; //->/\.(HTML|CSS|JS|ICO)/i
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

    //->处理客户端通过AJAX发送的请求:处理数据的请求
    if (pathname === '/getServerTime') {
        response.end(null);
    }
});
server1.listen(80, function () {
    console.log('server is success,listing on 80 port!');
});