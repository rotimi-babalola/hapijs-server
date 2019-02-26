import Hapi from 'hapi';
import Knex from './knex';

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
  });

  // await server.register(require('hapi-auth-jwt2'));

  // server.auth.strategy('jwt', 'jwt', {
  //   key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
  //   validate: () => {},
  //   verifyOptions: { algorithms: ['HS256'] },
  // });

  // server.auth.default('jwt');

  // Routes

  server.route({
    path: '/birds',
    method: 'GET',
    handler: async (request, h) => {
      // console.log(await Knex('birds'), '>>>');
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
            data,
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
  });

  await server.start();
  return server;
};

init()
  .then(server => {
    console.log(`Server started on PORT ${server.info.uri}`);
  })
  .catch(error => {
    console.log(`Error ${error}`);
  });
