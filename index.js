const express = require('express');
const templating = require('consolidate');
const bodyParser = require('body-parser');
const tasks = require('./models/task');
const app = express();

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res, next){
    res.render('index', {
        title: 'Главная страница'
    });
});

app.get('/task', function(req, res, next){
    tasks.showAll('tasks', function(err, tasks){
        if(err){
            console.log(err);
        }else{
            res.render('task', {
                title: 'Все задачи',
                rows: tasks
            });
        }
    });
});

app.get('/edit/:id', function(req, res, next){
    if(typeof(parseInt(req.params.id)) != "number"){
        tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                res.render('task', {
                    title: 'Все задачи',
                    rows: tasks
                });
            }
        });
    }else{
        let filtr = {
            table: 'tasks',
            id: req.params.id
        };
        tasks.getByID(filtr, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.render('edit', {
                    title: 'Редактирование задачи',
                    rows: result
                });
            }
        });
    }
});

app.get('/add', function(req, res, next){
    res.render('add', {
        title: 'Создание задачи'
    })
});

app.get('/delete/:id', function(req, res, next){
    if(typeof(parseInt(req.params.id)) != "number"){
        tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                res.render('task', {
                    title: 'Все задачи',
                    rows: tasks
                });
            }
        });
    }else{
        let filtr = {
            table: 'tasks',
            whereColumn: 'id',
            whereValue: req.params.id
        };
        tasks.del(filtr, function(err, result){
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

app.post('/add', function(req, res, next){
    let text = req.body.text.replace(/<\/?[^>]+>/g,  '');
    let filtr = {
        table: 'tasks',
        setColumn: 'text',
        setValue: text
    };
    tasks.add(filtr, function(err, result){
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

app.post('/update', function(req, res, next){
    if(typeof(req.body.text) != "string" && (typeof(parseInt(req.body.id))) != "number"){
        tasks.showAll('tasks', function(err, tasks){
            if(err){
                console.log(err);
            }else{
                res.render('task', {
                    title: 'Все задачи',
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
        tasks.update(filtr, function(err, result){
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

app.listen(8888);