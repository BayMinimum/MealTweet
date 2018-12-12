// tweet meal data from meal.js
// when meal time
// or snack time
'use strict';
let time = require("time");
const https = require("https");

function getFromCore(type, callback) {
  let data = "";
  let req = https.request({
    host: "us-central1-meal-bot-core.cloudfunctions.net",
    path: "/meal-bot-core",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    agent: false
  }, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      data += chunk;
      console.log("received chunk")
    });
    res.on("end", function () {
      callback(data)
    })
  });
  req.write(
    `{"type":"${type}"}`
  );
  req.on("error", (err) => {
    console.log(err)
  });
  req.end()
}

let interval = undefined;

function repeat() {
  // check time
  let now = new time.Date();
  now.setTimezone("Asia/Seoul");
  const yyyy = now.getFullYear();
  const mm = now.getMonth() + 1;
  const dd = now.getDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const d = now.getDay();
  let m_total = 60 * h + m;

  console.log(`Now is ${yyyy}/${mm}/${dd} ${h}:${m}`);

  let i = -1;
  if (5 <= m_total && m_total < 35) i = 0; // morning
  else if (19 * 60 + 30 <= m_total && m_total < 20 * 60 && process.env.SNACK === "ON") i = 3; // snack
  else if (d === 0 || d === 6) { // weekends
    if (11 * 60 + 35 <= m_total && m_total < 12 * 60 + 5) i = 1; // lunch
    else if (16 * 60 + 35 <= m_total && m_total < 17 * 60 + 5) i = 2; // dinner
  }
  else if (11 * 60 + 20 <= m_total && m_total < 12 * 60 - 10) i = 1; // lunch
  else if (16 * 60 + 25 <= m_total && m_total < 17 * 60 - 5) i = 2; // dinner

  if (i === -1) return false;
  else if (i !== 3) try {
    return getFromCore("meal", function (meals) {
      const mealType = ["조식", "중식", "석식"];
      meals = JSON.parse(meals);
      if (meals[0][i] === "") return false;
      const text = `${yyyy}/${mm}/${dd} ${mealType[i]}\n${meals[0][i]}`;
      let tweet = require('./tweet');
      return tweet(text, interval);
    })
  } catch (exception) {
    return false;
  }
  else try {
      return getFromCore("snack", function (snack) {
        if (snack === "") return false;
        const text = `${yyyy}/${mm}/${dd} 간식\n${snack}`;
        let tweet = require('./tweet');
        return tweet(text, interval);
      })
    } catch (exception) {
      return false;
    }
}

function main(){
  if(interval) clearInterval(interval)
  if(!repeat()) interval = setInterval(repeat, 2 * 60 * 1000);
}

setInterval(main, 30 * 60 * 1000)

// http server to keep bot alive
let http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.write('<html><head><title>MealTweet Bot</title></head><body>This bot is running:)');
  res.end('</body></html>');
}).listen(process.env.PORT || 8080);

console.log("HTTP server listening");