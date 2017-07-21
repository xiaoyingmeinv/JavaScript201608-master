var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->服务器端处理客户端静态资源文件的请求
    var reg = /\.(HTML|CSS|JS|ICO)/i;
    if (reg.test(pathname)) {
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
            response.writeHead(200, {
                'content-type': suffixMIME + ';charset=utf-8;',
                'zhufeng': 'zhufengpeixun'
            });
            response.end(conFile);
        } catch (e) {
            response.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            response.end('request file is not found~');
        }
    }
});
server1.listen(8080, function () {
    console.log('server is success,listing on 8080 port!');
});

