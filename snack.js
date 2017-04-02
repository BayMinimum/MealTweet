module.exports=function (callback) {
    'use strict';
    let cheerio = require('cheerio');
    let http = require('http');

    let options = {
        host: "gaonnuri.ksain.net",
        path: "/xe/?mid=login"
    };

    // get html data from school website
    let data = "";
    let request = http.request(options, function (res) {
        res.setEncoding("utf8");
        res.on('data', function (chunk) {
            data += chunk;
            console.log("received chunk");
        });
        res.on('end', function () {
            parseSnack(data);
        });
    });

    let parseSnack =function (html) {
        $ = cheerio.load(html, {decodeEntities: false}); // option to avoid unicode hangul issue
        let snack=$(".snack").parent().find(".menu").text();
        try {
            snack = snack.substring(1, snack.length);
        }catch(exception){
            console.log(exception);
            console.log("Substring operation for snack failed!");
        }
        callback(snack);
    };

    request.on('error', function () {
        console.log("Network error");
    });

    request.end();

    // callback(snack)
};