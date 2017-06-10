const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const templating = require('consolidate');

app.use(bodyParser.json());
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

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
});


app.listen(8888);