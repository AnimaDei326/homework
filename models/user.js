const {connection, pool} = require('./config');

const Users = {
    getBySomething: function(filtr, callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error", err);
                callback(err);
            }else{
                connection.query("SELECT * FROM ?? WHERE ?? = ?", [filtr.table, filtr.something, filtr.value], function(err, result){
                    if(err){
                        console.log("Error", err);
                        callback(err);
                    }else if(result){
                        callback(null, result[0]);
                    }else{
                        callback(new Error ('Пользователь не найден'));
                    }
                });
            }
            connection.release();
        });
    }
};

module.exports = Users;