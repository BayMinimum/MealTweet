module.exports = function (text_tweet, interval) {
  'use strict';
  console.log("Trying to tweet...");
  console.log(text_tweet);
  let Twitter = require('twitter');
  let twitter_key = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  let client = new Twitter(twitter_key);
  client.post('statuses/update', {status: text_tweet}, function (err, tweet, res) {
    if (err) {
      console.log("Tweet failed!");
      console.log(err);
      return false;
    }
    else {
      console.log("Tweet success!");
      console.log(tweet);
      // clearInterval(interval);
      let msg = require('./messenger_bot.js');
      msg(text_tweet, interval);
      return true;
    }
  });
};
