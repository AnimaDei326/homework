const {connection, pool} = require('./config');

connection.connect(function(err) {
    if (err){
        console.error(err);
    }else{
        console.log('connect with db is ok');
    }
});

const Tasks = {
    showAll: function(table, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                connection.query("SELECT * FROM ??", table, function(err, result){
                    callback(null, result);
                });
            }
        });
    },
    getByID: function(filtr, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                connection.query("SELECT * FROM ?? WHERE id = ?", [filtr.table, filtr.id], function(err, result){
                    if(err){
                        console.log("Error", err);
                        callback(err);
                    }else if(result){
                        callback(null, result[0]);
                    }else{
                        callback(new Error ('Задача не найдена'));
                    }
                });
            }
        });
    },
    update: function(filtr, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                let {table, set, whereColumn, whereValue} = filtr;
                connection.query("UPDATE ?? SET ? WHERE ?? = ?", [table, set, whereColumn, whereValue], function(err, result){
                    if(err){
                        console.log("Error", err);
                        callback(err);
                    }else if(result.affectedRows > 0){
                        callback(null, true);
                    }else{
                        callback(new Error ('Задача не обновлена'));
                    }
                });
            }
        });
    },
    del: function(filtr, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                let {table, whereColumn, whereValue} = filtr;
                connection.query("DELETE FROM ?? WHERE ?? = ? LIMIT 1", [table, whereColumn, whereValue], function(err, result){
                    if(err){
                        console.log("Error", err);
                        callback(err);
                    }else{
                        callback(null, result);
                    }
                });
            }
        });
    },
    add: function(filtr, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                let {table, setColumn, setValue} = filtr;
                connection.query("INSERT INTO ?? SET ?? = ?", [table, setColumn, setValue], function(err, result){
                    if(err){
                        console.log("Error", err);
                        callback(err);
                    }else if(result.affectedRows > 0){
                        callback(null, result.insertId);
                    }else{
                        callback(new Error ('Задача не создана'));
                    }
                });
            }
        });
    }
};

module.exports = Tasks;