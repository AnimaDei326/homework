const express = require('express');
const templating = require('consolidate');
const bodyParser = require('body-parser');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('cookie-session');
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  httpOnly: false
}));

const Tasks = require('./models/task');

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: false }));


//Главная страница
app.get('/', function(req, res, next){
    res.render('index', {
        title: 'Главная страница',
        h1: 'Model CRUD (create-read-update-delete) powered by Node JS, Express and GeekBrains',
        login: req.session.login || false
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
                login: req.session.login || false
            });
        }
    });
});

//Создание задачи
app.get('/add', function(req, res, next){
    res.render('add', {
        title: 'Создание задачи',
        h1: 'Создание задачи',
        login: req.session.login || false
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
                h1: 'Задача успешно создана'
            });
        }
    });
});

//Редактирование задачи
app.get('/edit/:id', function(req, res, next){
    if(typeof(parseInt(req.params.id)) != "number"){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                let loginReq = req.session.login || 'Гость';
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks,
                    login: req.session.login || false
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
                    row: result
                });
            }
        });
    }
});

app.post('/edit', function(req, res, next){
    if(typeof(parseInt(req.body.id)) != "number"){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks
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
                    h1: 'Задача успешно обновлена'
                });
            }
        });
    }
});

//Удаление задачи
app.get('/delete/:id', function(req, res, next){
    if(typeof(parseInt(req.params.id)) != "number"){
        Tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                let loginReq = req.session.login || 'Гость';
                res.render('task', {
                    title: 'Все задачи',
                    h1: 'Список задач',
                    rows: tasks,
                    login: req.session.login || false
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
                    h1: 'Задача успешно удалена'
                });
            }
        });
    }
});

//Авторизация
app.get('/autoriz', function(req, res, next){
    res.render('autoriz', {
        title: 'Авторизация',
        h1: 'Авторизация',
        login: req.session.login || false
    });
});

app.post('/autoriz', function(req, res, next){
    req.session.login = req.body.login;
    req.session.password = req.body.password;
    console.log(req.session);
    res.render('autoriz', {
        title: 'Авторизация',
        h1: 'Авторизация'
    });
})
app.listen(8888);