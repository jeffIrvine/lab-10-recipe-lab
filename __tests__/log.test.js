const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2022-04-09',
        notes: 'funeral',
        rating: 100
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2022-04-09',
          notes: 'funeral',
          rating: 100
        });
      });
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const logs = await Promise.all([
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'jeff birthday',
        rating: 23
      },
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'chandler birthday',
        rating: 23
      },
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('gets a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert(
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'jeff birthday',
        rating: 60
      });
      
    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual(log);
      });
  });


  it('updates a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert(
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'jeff birthday',
        rating: 60
      });


    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'jeff birthday',
        rating: 60
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-12-29',
          notes: 'jeff birthday',
          rating: 60
        });
      });
  });


  it('deletes a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert(
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'jeff birthday',
        rating: 60
      });

    const res = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(res.body).toEqual(log);
  });
});
