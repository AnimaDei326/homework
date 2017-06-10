const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
const templating = require('consolidate');

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);


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
});


app.listen(8888);