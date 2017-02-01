// tweet meal data from meal.js
// when meal time
var meal=require('./meal');
var time=require("time");
const __test__=false;

function repeat() {
    // check time
    var now=new time.Date();
    now.setTimezone("Asia/Seoul");
    const yyyy=now.getFullYear();
    const mm=now.getMonth()+1;
    const dd=now.getDate();
    const h=now.getHours();
    const m=now.getMinutes();
    var m_total=60*h+m;

    i=-1;
    if(m_total<60) i=0; // morning
    else if (11*60+40<=m_total && m_total<12*60+40) i=1; // lunch
    else if (17*60+30<=m_total && m_total<18*60+30) i=2; // dinner

    if(i==-1) return false;
    else try {
        return meal(function (meals) {
            const mealType = ["조식", "중식", "석식"];
            const text = `${yyyy}/${mm}/${dd} ${mealType[i]}\n${meals[i]}`;
            console.log("Trying to tweet...");
            console.log(text);
            var Twitter = require('twitter');
            var twitter_key = {
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            };
            if (__test__) twitter_key = require('./twitter_key');
            var client = new Twitter(twitter_key);
            client.post('statuses/update', {status: text}, function (err, tweet, res) {
                if (err) {
                    console.log("Tweet failed!");
                    console.log(err);
                    return false;
                }
                else {
                    console.log("Tweet success!");
                    clearInterval(interval);
                    return true;
                }
            });
        })
    }catch (exception){
        return false;
    }
}

if(!repeat()) var interval=setInterval(repeat, 10*60*1000);

// http server to keep bot alive
var http=require('http');
http.createServer((req, res)=>{
    res.writeHead(200);
    res.write('<html><head><title>MealTweet Bot</title></head><body>This bot is running:)');
    res.end('</body></html>');
}).listen(process.env.PORT || 8080);

console.log("HTTP server listening");