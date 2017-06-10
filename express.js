const express = require('express');
<<<<<<< HEAD
const request = require('request');
const cheerio = require('cheerio');
=======
>>>>>>> 2a996d789f44eaebdb63a70d300278dfca6cded3
const bodyParser = require('body-parser');
const app = express();
const templating = require('consolidate');

<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: false }))
=======
app.use(bodyParser.json());
>>>>>>> 2a996d789f44eaebdb63a70d300278dfca6cded3
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

<<<<<<< HEAD

app.get('/', function(req, res, next){
    res.render('hello', {
        title: 'Главная страница',
    });
});



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
                res.render('site', {
                    title: 'Запрос',
                    site: req.body.site,
                    item: $('.quote').eq(0).text()
                });
            }
        })
=======
app.get('/', function(req, res, next){
    res.render('hello', {
        title: 'Главная страница',
    })
});

app.post('/', function(req, res, next){
    res.render('site', {
        title: 'Запрос',
        site: req.body.site
    })
>>>>>>> 2a996d789f44eaebdb63a70d300278dfca6cded3
});


app.listen(8888);