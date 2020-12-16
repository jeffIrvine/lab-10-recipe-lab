const { Router } = require('express');
const Recipe = require('../models/recipe');

module.exports = Router()
  .post('/', (req, res, next) => {
    Recipe.insert(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Recipe.find(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Recipe.findById(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    Recipe.update(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Recipe.delete(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  });
