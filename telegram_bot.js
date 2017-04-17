module.exports=function (text_msg, interval) {
    const https = require('https');
    let options = {
        host: "api.telegram.org",
        path: `/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        }
    };

    let msg_db=require('./telegram_db');
    msg_db(function (rows) {
        for(let i=0;i<=rows.length;i+=1) {
            if(i===rows.length){
                clearInterval(interval);
                return;
            }

            let post_data = {
                "chat_id": rows[i].telegram_id,
                "text": text_msg
            };

            let post_req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('[TELEGRAM SEND] Res: ' + chunk);
                });
            });

            // post the data
            post_req.write(JSON.stringify(post_data));
            post_req.end();
        }
    });
};