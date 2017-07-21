var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];
    
    if(pathname==='/queryStudent'){
    	var fnName=query['cb'];
    	var conFile=fs.readFileSync('./student.json','utf-8');

    	response.writeHead(200,{'content-type':'text/javascript;charset=utf-8;'});
    	response.end(fnName+'('+conFile+')');
    }


});
server1.listen(86, function () {
    console.log('server is success,listing on 86 port!');
});