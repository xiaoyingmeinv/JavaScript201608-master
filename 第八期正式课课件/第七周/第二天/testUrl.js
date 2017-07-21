var url = require('url');
var a = url.parse('http://www.zhufengpeixun.cn:80/index.html?name=zxt&age=26');
console.log(a);
//Url {
//    protocol: 'http:', 协议
//    slashes: true, 是否存在斜线,此处为true代表存在
//    auth: null,
//    host: 'www.zhufengpeixun.cn:80', 域名+端口
//    port: '80', 端口
//    hostname: 'www.zhufengpeixun.cn', 域名
//    hash: null, 哈希值
//    search: '?name=zxt&age=26', 问号传递的参数值
//    query: 'name=zxt&age=26', 相对于search少了问号
//    pathname: '/index.html', 请求资源文件的路径和名称
//    path: '/index.html?name=zxt&age=26', pathname+search
//    href: 'http://www.zhufengpeixun.cn:80/index.html?name=zxt&age=26'
//}

a = url.parse('http://www.zhufengpeixun.cn:80/index.html?name=zxt&age=26', true);
console.log(a);
//Url {
//    query: {name:'zxt',age:26}
//}