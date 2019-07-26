const request = require('request');

const spotifyConfig = require('../../config/spotify');
const whatherConfig = require('../../config/weather');
const genresConfig = require('../../config/genres');

// const spotifyApi = new SpotifyWebApi({
//   clientId: spotifyConfig.clientID,c
//   clientSecret: spotifyConfig.clientSecret
// });

var urlOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization:
      'Basic ' +
      new Buffer.from(
        spotifyConfig.clientID + ':' + spotifyConfig.clientSecret
      ).toString('base64')
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

class MusicController {
  async index(req, res) {
    const city = await req.params.city;

    const urlWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${
      whatherConfig.apiKey
    }`;

    request.get(urlWeather, async (err, response, body) => {
      if (!err && response.statusCode === 200) {
        const weather = await JSON.parse(body);
        const temperature = weather.main.temp;
        const city = weather.name;
        var tracks = [];

        if (!err) {
          var genre;

          if (temperature >= 25) {
            genre = genresConfig.above25;
          } else if (temperature >= 10 && temperature < 25) {
            genre = genresConfig.between10_25;
          } else if (temperature < 10) {
            genre = genresConfig.below10;
          }

          request.post(urlOptions, function(err, response, body) {
            if (!err && response.statusCode === 200) {
              var token = body.access_token;
              var options = {
                url: `https://api.spotify.com/v1/search?q=genre:${genre}&type=track`,
                headers: {
                  Authorization: 'Bearer ' + token
                },
                json: true
              };
              request.get(options, function(err, response, body) {
                if (body.tracks.items) {
                  body.tracks.items.map(item => {
                    tracks.push({
                      track: item.name,
                      artist: item.artists.map(artist => artist.name),
                      album: item.album.name
                    });
                  });
                }
                return res.json({ message: genre, temperature, city, tracks });
              });
            } else {
              return res.json({ error });
            }
          });
        } else {
          res.json({ err });
        }
      } else {
        return res.json({ error: JSON.parse(body) });
      }
    });
  }
}

module.exports = new MusicController();
