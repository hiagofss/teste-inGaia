const { Router } = require('express');

const routes = new Router();

const MusicController = require('./app/controllers/MusicController');

routes.get('/', (req, res) => {
  res.send('<h1>Digite uma cidade na URL</h1>');
});

routes.get('/:city', MusicController.index);

module.exports = routes;
