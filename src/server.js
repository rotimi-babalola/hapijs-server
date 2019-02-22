import Hapi from 'hapi';
import Knex from './knex';

const server = new Hapi.Server();

server.connection({
  port: 8080,
});

server.register(require('hapi-auth-jwt'), err => {
  server.auth.strategy('token', 'jwt', {
    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
    verifyOptions: {
      algorithms: ['HS256'],
    },
  });
});

server.start(err, () => {
  if (err) {
    // Fancy error handling here
    console.error('Error was handled!');
    console.error(err);
  }
  console.log(`Server started on PORT ${server.info.uri}`);
});

server.route({
  path: '/birds',
  method: 'GET',
  handler: (request, reply) => {
    //
  },
});
