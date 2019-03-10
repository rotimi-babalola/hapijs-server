import Hapi from 'hapi';
import dotenv from 'dotenv';
import routes from '../api/routes';
import Knex from './knex';

dotenv.config();

const validate = async (decoded) => {
  // check if user exists in db
  const user = await Knex('users')
    .where({
      guid: decoded.guid,
    })
    .first();

  const credentials = decoded;
  credentials.scope = decoded.guid;
  if (user.name) {
    return {
      isValid: true,
      credentials,
    };
  }
  return {
    isValid: false,
  };
};

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
  });

  // eslint-disable-next-line global-require
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET_KEY,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');
  server.route(routes);

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
