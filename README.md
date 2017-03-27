# liri-node-app
# LIRI Node App
LIRI is a command line node app that takes in parameters and gives you back data.

## Quick Start
```bash
#clone the repo
git clone https://github.com/monad98/liri-node-app.git

#change directory to repo
cd liri-node-app

# install dependencies
npm install

# add your own twitter keys in keys.js. Currently keys.js is
exports.twitterKeys = {
  consumer_key: 'ThisIsAFakeComsumerKey',
  consumer_secret: 'ThisIsAFakeComsumerSecret',
  access_token_key: 'ThisIsAFakeAccessTokenKey',
  access_token_secret: 'ThisIsAFakeAccessTokenSecret'
};
```

## Use
> This will show your last 20 tweets and when they were created at in your terminal/bash window.

```bash
node liri.js my-tweets
```

> This will show the following information about the song in your terminal/bash window
```bash
node liri.js spotify-this-song '<song name here>'
```
> This will output the following information to your terminal/bash window:
```bash
node liri.js movie-this '<movie name here>'
```
> This will run the text in random.txt. Each command should be should be separated by new line. 
```bash
node liri.js do-what-it-says 
```
```
//random.txt example
my-tweets
movie-this,   "Beauty and the Beast"
spotify-this-song,"I Want it That Way"
