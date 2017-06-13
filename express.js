const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
const templating = require('consolidate');
const cookie = require('cookie');
const cookieParser = require('cookie-parser'); //не понимаю принципиальные различия между 7 и 8 строчками, что из них что может


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);


app.get('/', function(req, res, next){
    if(req.cookies.count && req.cookies.site){
        var {count} = req.cookies.count;
        var {site} = req.cookies.site;
    }else{
        var count = 0;
        var site = 0;
    }
    res.render('hello', {
        title: 'Главная страница',
        countRes: count,
        siteRes: site
    });
});

/*app.get('/:id', function(req, res, next){
    console.log(`id:  ${req.params.id}`); //в консоле вместо аргумента id выходит 'favicon.ico', а иногда 'style.css', и при раскомментировании с 33 по 35 строки сервер не загружает данные
});*/

app.post('/',  function(req, res, next){
    request({
        method: 'GET',
        uri: req.body.site,
        },
        function (error, response, html){
            if (error) {
            console.error(error);
            } else {
                const $ = cheerio.load(html);
                let arrContent = [];
                let className = "";
                const textH1 =  "Шпион докладывает последние новости с сайта " + req.body.site;
                switch(req.body.site){
                    case "http://ifindir.ru/blog/": className = ".entry-content"; break;
                    case "https://news.yandex.ru/auto.html": className = ".story__text"; break;
                }
                for(var i = 0; req.body.count > arrContent.length; i++){
                    arrContent.push( $(className).eq(i).text() );
                }
                res.cookie('site',  {site:req.body.site},
                                    { maxAge: 60*60*24,
                                      httpOnly:false});
                res.cookie('count',  {count:req.body.count},
                                    { maxAge: 60*60*24,
                                      httpOnly:false});
                res.render("site", {
                    title: "Новости",
                    item: arrContent,
                    h1 : textH1
                });
            }
        }
    )
});


app.listen(8888);