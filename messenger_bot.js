module.exports=function (text_msg, interval) {
    const https = require('http');
    let options = {
        host: "graph.facebook.com",
        path: `/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        }
    };

    let msg_db=require('./messenger_db');
    msg_db(function (rows) {
        for(let i=0;i<=rows.length;i+=1) {
            if(i===rows.length){
                clearInterval(interval);
                return;
            }
            let post_data = {
                "recipient": {
                    "id": rows[i].messenger_id
                },
                "message": {
                    "text": text_msg
                }
            };

            let post_req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('[MSG SEND] Res: ' + chunk);
                });
            });

            // post the data
            post_req.write(JSON.stringify(post_data));
            post_req.end();
        }
    });
};