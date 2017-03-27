const fs = require('fs');
const Twitter = require('twitter');
const twitterKeys = require('./keys').twitterKeys;
const spotify = require('spotify');
const request = require('request');
const execSync = require('child_process').execSync;
//string variables
const TWITTER_KEY_URL = 'https://goo.gl/3ouwNm';
const TWITTER_USER_ID = '846241880127942657';
const TWITTER_END_POINT = '/statuses/user_timeline';
const OMDB_URL = 'http://www.omdbapi.com/'

//command list
const MY_TWEETS = 'my-tweets';
const SPOTIFY_THIS_SONG = 'spotify-this-song';
const MOVIE_THIS = 'movie-this';
const DO_WHAT_IT_SAYS = 'do-what-it-says';

//user command
const command = process.argv[2];
const param = process.argv[3] || null;
//twitter object promise (to prevent twitter keys to be published to Github)
const twitterPromise = (() => {
  return new Promise((resolve, reject) => {
    request.get(TWITTER_KEY_URL, (err, data) => {
      if (err) reject(err);
      resolve(new Twitter(JSON.parse(data.body)));
    });
  });
})();

//Main function 
const doSomething = (cmd, arg) => {
  switch (cmd) {
    case MY_TWEETS:
      return tweetLatest(TWITTER_END_POINT, TWITTER_USER_ID);

    case SPOTIFY_THIS_SONG:
      return spotifySong(arg, 'track');

    case MOVIE_THIS:
      return getMovieInfo(OMDB_URL, arg);

    case DO_WHAT_IT_SAYS:
      return doWhatItSays();

    default:
      return console.log('Invalid Command. Try again.\n');
  }
};


// util func for printing results to 'log.txt' and screen
const print = (data) => {
  console.log(data);
  fs.appendFile('log.txt', data + '\n', err => {
    if (err) console.log('Error occurred: ' + err);
  });
};

// 1. function for `my-tweets` command
const tweetLatest = (endPoint, userId) => {
  // if keys in keys.js is not a fake one, use imported keys
  if(twitterKeys.consumer_key !== 'ThisIsAFakeComsumerKey') {
    requestTweets(new Twitter(twitterKeys));
  } 
  // otherwise, request keys.json file from remote server. (This is Default due to fake keys.js file)
  else twitterPromise.then(twitterObject => requestTweets(twitterObject));

  function requestTweets (twitterObject) {
    twitterObject.get(endPoint, { user_id: userId })
      .then(data => {
        if(data.length) {
          const dataToPrint = data.reduce((acc, cur) => acc + ' - ' + cur.text + '\n',  '# My latest tweets: \n');
          print(dataToPrint);
        } else print("No tweet yet.")
      },
      err => console.log('Error occurred: ' + err)
    );
  }
};

// 2. function for `spotify-this-song` command
const spotifySong = (songTitle='The Sign artist:Ace of Base', type) => {
  spotify.search({
    type: type,
    query: songTitle,
    limit: 1
  }, function (err, data) {
    if (err) return console.log('Error occurred: ' + err);
    
    const track = data.tracks.items[0];
    const dataToPrint = `# Song Infomation
 - Artist: ${track.artists[0].name}
 - Title: ${track.name}
 - Preview Link: ${track.preview_url}
 - Album: ${track.album.name}\n`
    print(dataToPrint);
  });
};

// 3. function for `movie-this` command
const getMovieInfo = (endPoint, title='Mr. Nobody') => {
  request.get(endPoint, {
    qs: {
      apikey: '992d369d',
      t: title,
      tomatoes: true
    }
  }, (err, data) => {
    if (err) console.log('Error occurred: ' + err);
    const movie = JSON.parse(data.body);
    const dataToPrint = `# Movie Information
 - Title: ${movie.Title}
 - Year: ${movie.Year}
 - IMDB Rating: ${movie.imdbRating}
 - Country: ${movie.Country}
 - Language: ${movie.Language}
 - Plot: ${movie.Plot}
 - Actors: ${movie.Actors}
 - Rotten Tomato Rating: ${movie.tomatoRating}
 - Rotten Tomatoes URL: ${movie.tomatoURL}\n`
    print(dataToPrint);
  });

};


// 4. 'do-what-it-says' command
const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    const commands = data.split('\n');
    commands.forEach(cmd => {
      cmd = cmd.split(',').map(str => str.trim())
      // redundant if statement for current code. Works without following if statement.
      if(cmd[1] && cmd[1].charAt(0) === '"' && cmd[1].charAt(cmd[1].length -1) === '"') {
        cmd[1] = cmd[1].substring(1, cmd[1].length - 1);
      }
      execSync(doSomething(cmd[0], cmd[1])); // to keep same ordered output as random.txt's command order
      // doSomething(cmd[0], cmd[1]) // asynchronous call for each command in random.txt
    });
  });
};

// run app
doSomething(command, param);