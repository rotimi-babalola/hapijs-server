import Knex from '../../src/knex';

module.exports = {
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
          error,
          message: 'An error occurred',
        })
        .code(500);
    }
  },
};
