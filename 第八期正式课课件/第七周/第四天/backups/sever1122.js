var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];
    if (pathname === '/index.html') {
        var conFile = fs.readFileSync('./index.html', 'utf8');
        response.writeHead(200, {'content-type': 'text/html;charset=utf-8;'});
        response.end(conFile);
    }
});
server1.listen(80, function () {
    console.log('server is success,listing on 80 port!');
});