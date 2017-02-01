module.exports= function (callback) {
    var cheerio = require('cheerio');
    var https = require('https');

    var options = {
        host: "ksa.hs.kr",
        path: "/Home/CafeteriaMenu/72"
    };

    var data = "";
    var request = https.request(options, function (res) {
        res.setEncoding("utf8");
        res.on('data', function (chunk) {
            data += chunk;
            console.log("received chunk");
        });
        res.on('end', function () {
            parseMeal(data);
        });
    });

    request.on('error', function () {
        throw new Error("Network error");
    });

    request.end();


    var parseMeal = function (html) {
        meals = [];
        $ = cheerio.load(html, {decodeEntities: false});
        $(".meal").find('ul').each((i, elem) => {
            var meal = "";
            $(elem).find('li').each((j, elem) => {
                    meal += $(elem).toString('utf8')
                        .replace("<li>", "")
                        .replace("</li>", "")
                        .replace(/ /g, "");
                }
            );
            meals.push(meal);
        });
        callback(meals);
    };

    // test using local copy
    var fs = require('fs');
    fs.readFile('/home/baymax/WebstormProjects/MealTweet/test.html', (err, data) => {
        if (err) throw err;
        parseMeal(data.toString());
    });
};