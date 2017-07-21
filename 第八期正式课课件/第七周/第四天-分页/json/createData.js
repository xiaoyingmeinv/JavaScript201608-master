function ran(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}
var str1 = '赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏桃江';//->0-31
var str2 = '一二三四五六七八九零';//->0-9

var ary = [];
for (var i = 1; i <= 98; i++) {
    var obj = {
        id: i,
        name: str1[ran(0, 31)] + str2[ran(0, 9)] + str2[ran(0, 9)],
        sex: ran(0, 1),
        score: ran(10, 99)
    };
    ary.push(obj);
}
var fs = require('fs');
fs.writeFileSync('./student.json', JSON.stringify(ary), 'utf-8');