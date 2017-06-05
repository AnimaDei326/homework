const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const result = 0;

function readFile(){
    const fs = require('fs');
    fs.readFile('history.txt', function(err, data){
        if(err){
            console.log('Извините, у нас ошибочка в чтении файла');
        }else{
            const strData = data.toString();
            var prev = 0;
            var wins = 0;
            var lose = 0;
            var maxwin = 0;
            var maxlose = 0;
            var arrmaxwin = [];
            var arrmaxlose = [];
            
            for(var i=0; i<=strData.length; i++){
                if(strData[i]==1){
                    wins++;
                    maxwin++;
                    if(maxlose>0){
                        arrmaxlose.push(maxlose);
                        maxlose = 0;
                    }
                }else{
                    lose++;
                    maxlose++;
                    if(maxwin>0){
                        arrmaxwin.push(maxwin);
                        maxwin = 0;
                    }
                }
            }
            lose = strData.length - wins;
            
            console.log('Общее количество сыгранных партий: ' + strData.length);
            console.log('Количество выигранных партий: ' + wins);
            console.log('Количество проигранных партий: ' + lose);
            console.log('Соотношение выигранных к проигранным партиям: ' + Math.round(wins/lose * 10)/10);
            console.log('Максимальное число побед подряд: ' +  Math.max.apply(null, arrmaxwin));
            console.log('Максимальное число проигрышей подряд: ' + Math.max.apply(null, arrmaxlose));
        }
    });
}

function writeFile(result){
    const fs = require('fs');
    fs.appendFile('history.txt', result, function (err, data){
        if(err){return console.log(err);}
    });
}

function game(result){
    rl.question('Орел или решка? 0/1 ', function(q){
        const a = Math.random();
        const b = Math.round(a);
        if(b==q){
            console.log('Вы угадали =)');
            result = 1;
        }else{
            console.log('Вы не угадали =(');
            result = 0;
        }
        if(b==0){
            console.log('Выпал орел!');
        }else{
            console.log('Выпала решка!');
        }
        writeFile(result);
        rl.question('Еще разок? да/нет ', function(more){
            if(more=='да'){
                console.log('===================================');
                game(result);
            }else{
                rl.question('Хочешь статистику поглядеть? да/нет ', function(answer){
                    if(answer=='да'){
                        console.log('===================================');
                        readFile();
                        rl.close();
                    }
                });
            }
        })
    })
}

rl.question('Будешь играть? да/нет ', function(answer){
    if(answer=='да'){
        console.log('Тогда поехали!');
        console.log('===================================');
        game(result);
    }else{
        console.log('Ну, пока!');
        rl.close();
    }
})