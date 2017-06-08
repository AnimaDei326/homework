//Задание 2
const readline = require('readline');
const request = require('request');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function fixedEncodeURIComponent (str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
}

rl.question('Введите слово, которое нужно перевести на английский:', function(text){
    const codingText = fixedEncodeURIComponent(text);
    const key = 'trnsl.1.1.20170608T062213Z.9c730839ad5dc73a.d80e9047672c3868dff629b47c3c32c6dd49ca93';
    const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + codingText + '&lang=ru-en';

    request({
        method: 'GET',
        uri: url
    },  
        function(err, res, body){
        if(res.statusCode == 200){
            console.log(body);
        }else{
            console.log(err);
        }
    })
    
    rl.close();
});