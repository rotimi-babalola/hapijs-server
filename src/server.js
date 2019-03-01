import Hapi from 'hapi';
import jwt from 'jsonwebtoken';
import Knex from './knex';

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
  });

  // eslint-disable-next-line global-require
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
  });

  server.route({
    path: '/auth',
    method: 'POST',
    config: {
      auth: false,
    },
    handler: async (request, h) => {
      const { username, password } = request.payload;
      try {
        const user = await Knex('users')
          .where({
            username,
          })
          .select('guid', 'password')
          .first();

        if (!user) {
          return h
            .response({
              error: true,
              message: 'User not found',
            })
            .code(404);
        }

        // TODO: hash user's password and compare to payload
        if (user.password === password) {
          const token = jwt.sign(
            {
              username,
              scope: user.guid,
            },
            'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
            {
              algorithm: 'HS256',
              expiresIn: '1h',
            },
          );
          return h
            .response({
              token,
              scope: user.guid,
            })
            .code(200);
        }

        return h
          .response({
            message: 'Incorrect password',
          })
          .code(401);
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
  .then((server) => {
    // eslint-disable-next-line no-console
    console.log(`Server started on PORT ${server.info.uri}`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(`Error ${error}`);
  });
