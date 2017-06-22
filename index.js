const express = require('express');
const templating = require('consolidate');
const bodyParser = require('body-parser');
const util = require('util');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('cookie-session');
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  httpOnly: false
}));

const restify = require('restify');
const client = restify.createClient({
    url: 'http://localhost:8888/'
});


const Tasks = require('./models/task');

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: false }));


//Главная страница
app.get( '/', function(req, res, next) {
  res.render( 'index', {
        title: 'Главная страница',
        h1: 'Model CRUD (create-read-update-delete) powered by Node JS, Express and GeekBrains',
        partials: { 
            header: 'partials/header',
            footer: 'partials/footer'
        }
    });
});

//Список задач
app.get('/task', function(req, res, next){
    Tasks.showAll('tasks', function(err, tasks){
        if(err){
            console.log(err);
        }else{
            res.render('task', {
                title: 'Все задачи',
                h1: 'Список задач',
                rows: tasks,
                partials: { 
                    header: 'partials/header',
                    footer: 'partials/footer'
                }
            });
        }
    });
});


app.get('/rest', function(request, response, next){
    response.render('rest', {
        title: 'Все задачи',
        h1: 'Список задач',
        partials: { 
            header: 'partials/header',
            footer: 'partials/footer'
        }
    });
});

app.get('/show', function(req, res, next){
    Tasks.showAll('tasks', function(err, tasks){
        if(err){
            console.log(err);
        }else{
            res.json({
                rows: tasks
            });
        }
    });
});
//Создание задачи
app.get('/add', function(req, res, next){
    res.render('add', {
        title: 'Создание задачи',
        h1: 'Создание задачи',
        partials: { 
            header: 'partials/header',
            footer: 'partials/footer'
        }
    })
});

app.post('/add', function(req, res, next){
    let text = req.body.text.replace(/<\/?[^>]+>/g,  '');
    let filtr = {
        table: 'tasks',
        setColumn: 'text',
        setValue: text
    };
    Tasks.add(filtr, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.render('complete', {
                title: 'Уведомление',
                h1: 'Задача успешно создана',
                partials: { 
                    header: 'partials/header',
                    footer: 'partials/footer'
                }
            });
        }
    });
});

//Редактирование задачи
app.get('/edit/:id', function(req, res, next){
    if(isNaN(+req.params.id)){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                let loginReq = req.session.login || 'Гость';
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks,
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }else{
        let filtr = {
            table: 'tasks',
            id: req.params.id
        };
        Tasks.getByID(filtr, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.render('edit', {
                    title: 'Редактирование задачи',
                    h1: 'Редактирование задачи',
                    row: result,
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }
});

app.post('/edit', function(req, res, next){
    if(isNaN(+req.params.id)){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks,
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }else{
        let text = req.body.text.replace(/<\/?[^>]+>/g,  '');
        let flagDone = 0;
        if(req.body.done == 'on'){
            flagDone = 1;
        }
        let filtr = {
            table: 'tasks',
            set: {
                'text' : text,
                'done': flagDone
            },
            whereColumn: 'id',
            whereValue: req.body.id
        };
        Tasks.update(filtr, function(err, result){
            if(err){
                console.log(err);
            }else if(result){
                res.render('complete', {
                    title: 'Уведомление',
                    h1: 'Задача успешно обновлена',
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }
});

//Удаление задачи
app.get('/delete/:id', function(req, res, next){
    if(isNaN(+req.params.id)){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                let loginReq = req.session.login || 'Гость';
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks,
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }else{
        let filtr = {
            table: 'tasks',
            whereColumn: 'id',
            whereValue: req.params.id
        };
        Tasks.del(filtr, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.render('complete', {
                    title: 'Уведомление',
                    h1: 'Задача успешно удалена',
                    partials: { 
                        header: 'partials/header',
                        footer: 'partials/footer'
                    }
                });
            }
        });
    }
});

//Авторизация
app.get('/auth', function(req, res, next){
    res.render('auth', {
        title: 'Авторизация',
        h1: 'Авторизация',
        partials: { 
            header: 'partials/header',
            footer: 'partials/footer'
        }
    });
});

app.post('/auth', function(req, res, next){
    req.session.login = req.body.login;
    req.session.password = req.body.password;
    console.log(req.session);
    res.render('index', {
        title: 'Главная страница',
        h1: 'Model CRUD (create-read-update-delete) powered by Node JS, Express and GeekBrains',
        partials: { 
            header: 'partials/header',
            footer: 'partials/footer'
        }
    });
})
app.listen(8888);