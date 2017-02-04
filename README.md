# MealTweet
Automaticaly tweet meal data from https://ksa.hs.kr/Home/CafeteriaMenu/72

# Deploying
Clone this repository, and push to heroku using Heroku CLI.

# Testing

## Offline test
To test without network, optain a copy of https://ksa.hs.kr/Home/CafeteriaMenu/72 using your preffered tool, and save as test.html to the project root. Then modify
```
const __test__ = true;
```
in meal.js

## Test without environment variables
To test without setting your twitter credentials as environment vars, add twitter_key.js to your project root. In this file, 
```
module.exports={
   consumer_key: 'YOUR_CONSUMER_KEY',
   consumer_secret: 'YOUR_CONSUMER_SECRET',
   access_token_key: 'YOUR_ACCESS_TOKEN_KEY',
   access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET'
};
```
Then modify
```
const __test__ = true;
```
in app.js
