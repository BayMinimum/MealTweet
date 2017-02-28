// tweet meal data from meal.js
// when meal time
// or snack time
var meal=require('./meal');
var snack=require('./snack');
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
    else if (19*60+30<=m_total && m_total<20*60+30) i=3; // snack

    if(i==-1) return false;
    else if(i!=3) try {
        return meal(function (meals) {
            const mealType = ["조식", "중식", "석식"];
            if(meals[i]==="") return false;
            const text = `${yyyy}/${mm}/${dd} ${mealType[i]}\n${meals[i]}`;
            var tweet= require('./tweet');
            return tweet(text, interval);
        })
    }catch (exception){
        return false;
    }
    else try{
        return snack(function(snack){
            if(snack==="") return false;
            const text = `${yyyy}/${mm}/${dd} 간식\n${snack}`;
            var tweet=require('./tweet');
            return tweet(text, interval);
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