import uuid from 'uuid/v1';
import Knex from '../../src/knex';

module.exports = [
  {
    path: '/birds',
    method: 'GET',
    handler: async (request, h) => {
      try {
        const results = await Knex('birds')
          .where({
            isPublic: true,
          })
          .select('name', 'species', 'picture_url');
        if (!results || results.length === 0) {
          return h
            .response({
              error: true,
              message: 'No public bird found',
            })
            .code(404);
        }
        return h
          .response({
            count: results.length,
            results,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            error: error.toString(),
            message: 'An error occurred',
          })
          .code(500);
      }
    },
  },
  {
    path: '/birds',
    method: 'POST',
    config: {
      auth: {
        strategy: 'jwt',
      },
    },
    handler: async (request, h) => {
      // eslint-disable-next-line camelcase
      const { name, species, picture_url } = request.payload;
      try {
        const newBird = await Knex('birds')
          .returning(['name', 'species', 'picture_url'])
          .insert({
            owner: request.auth.credentials.scope,
            name,
            species,
            picture_url,
            guid: uuid(),
          });
        return h
          .response({
            data: newBird,
            message: 'Bird successfully created',
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            error: error.toString(),
            message: 'An error occurred',
          })
          .code(500);
      }
    },
  },
];
