module.exports= function (callback) {
    let cheerio = require('cheerio');
    let https = require('https');
    const __test__=false;

    if (!__test__) {
        let options = {
            host: "ksa.hs.kr",
            path: "/Home/CafeteriaMenu/72"
        };

        // get html data from school website
        let data = "";
        let request = https.request(options, function (res) {
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
            console.log("Network error");
        });

        request.end();
    }

    // pass meal as [breakfast, lunch, dinner] to callback func
    let parseMeal = function (html) {
        let meals = [];
        $ = cheerio.load(html, {decodeEntities: false}); // option to avoid unicode hangul issue
        $(".meal").find('ul').each((i, elem) => {
            let meal = "";
            $(elem).find('li').each((j, elem) => {
                    meal += $(elem).toString()
                        .replace("<li>", "")
                        .replace("</li>", "")
                        .replace(/ /g, "")
                        .replace(/amp;/g, "");
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
        let fs = require('fs');
        fs.readFile('/home/baymax/WebstormProjects/MealTweet/test.html', (err, data) => {
            if (err) throw err;
            parseMeal(data.toString());
        });
    }
};