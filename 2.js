//Задание 2
const https = require('https');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введите слово, которое нужно перевести на английский:', function(text){
    const key = 'trnsl.1.1.20170608T062213Z.9c730839ad5dc73a.d80e9047672c3868dff629b47c3c32c6dd49ca93';
    const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + text + '&lang=en-ru';
    console.log(url);
    https.get(url, function(res){
        console.log(res); //распарсить не знаю как
    });
    rl.close();
});