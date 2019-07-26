const { Router } = require('express');

const routes = new Router();

const MusicController = require('./app/controllers/MusicController');

routes.get('/', (req, res) => {
  res.send('Digite uma cidade na URL');
});

routes.get('/:city', MusicController.index);

module.exports = routes;
