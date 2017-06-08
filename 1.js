//Задание 1
const Browser = require('zombie');
const browser = new Browser();

browser.visit('http://bashorg.org', function(){
    console.log(browser.text('title'));
    const justText = browser.text('.quote');
    console.log(justText); //у меня только текст получилось доставать, совсем без разбора =(
    //const nodes = browser.queryAll('.quote');
    //console.log(nodes);
    /*при какой-либо другой попытке либо ошибки, либо огромный объект,     
    с которым не получалось работать как с обычными объектами в js,
    туториалы не помогли, все на англ. и мало информации*/
});