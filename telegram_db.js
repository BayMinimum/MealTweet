module.exports=function msg_db(callback) {

    let pg = require('pg');

    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function (err, client) {
        if (err) {
            console.log('Error connecting to telegram id DB, retrying');
            console.log(err);
            return msg_db(callback);
        }
        console.log('Connected to postgres!');

        client
            .query('SELECT telegram_id FROM telegram_id_table;', function(err, res){
                callback(res.rows);
                client.end(function (err) {
                    if(err){
                        console.log("Error ending connection to DB!");
                        console.log(err);
                    }
                });
            });
    });

};