import Hapi from 'hapi';
import Knex from './knex';

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
  });

  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
    validate: () => {},
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  // Routes

  server.route({
    path: '/birds',
    method: 'GET',
    handler: (request, reply) => {
      const getOperation = Knex('birds')
        .where({
          isPublic: true,
        })
        .select('name', 'species', 'picture_url')
        .then(results => {
          if (!results || results.length === 0) {
            reply({
              error: true,
              message: 'No public bird found!',
            });
          }
          reply({
            count: results.length,
            data,
          });
        })
        .catch(error => {
          reply({
            error: true,
            error,
            message: 'An error occurred',
          });
        });
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
