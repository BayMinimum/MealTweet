module.exports= function (callback) {
    var cheerio = require('cheerio');
    var https = require('https');
    const __test__=false;

    if (!__test__) {
        var options = {
            host: "ksa.hs.kr",
            path: "/Home/CafeteriaMenu/72"
        };

        // get html data from school website
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
    }

    // pass meal as [breakfast, lunch, dinner] to callback func
    var parseMeal = function (html) {
        meals = [];
        $ = cheerio.load(html, {decodeEntities: false}); // option to avoid unicode hangul issue
        $(".meal").find('ul').each((i, elem) => {
            var meal = "";
            $(elem).find('li').each((j, elem) => {
                    meal += $(elem).toString()
                        .replace("<li>", "")
                        .replace("</li>", "")
                        .replace(/ /g, "")
                        .replace(/amp\;/g, "");
                }
            );
            // remove \n in start or end
            if(meal.charAt(0)=='\n') meal.replace('\n', "");
            if(meal.charAt(meal.length)=='\n') meal=meal.substring(0, meal.length-1);
            meals.push(meal);
        });
        callback(meals);
    };

    // test using local copy
    if(__test__) {
        var fs = require('fs');
        fs.readFile('/home/baymax/WebstormProjects/MealTweet/test.html', (err, data) => {
            if (err) throw err;
            parseMeal(data.toString());
        });
    }
};