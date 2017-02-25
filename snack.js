module.exports=function (callback) {
    var cheerio = require('cheerio');
    var http = require('http');

    var options = {
        host: "gaonnuri.ksain.net",
        path: "/xe/?mid=login"
    };

    // get html data from school website
    var data = "";
    var request = http.request(options, function (res) {
        res.setEncoding("utf8");
        res.on('data', function (chunk) {
            data += chunk;
            console.log("received chunk");
        });
        res.on('end', function () {
            parseSnack(data);
        });
    });

    var parseSnack =function (html) {
        $ = cheerio.load(html, {decodeEntities: false}); // option to avoid unicode hangul issue
        var snack=$(".snack").parent().find(".menu").text();
        callback(snack);
    }

    request.on('error', function () {
        throw new Error("Network error");
    });

    request.end();

    // callback(snack)
};