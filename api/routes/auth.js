import jwt from 'jsonwebtoken';
import Knex from '../../src/knex';

module.exports = [
  {
    method: 'POST',
    path: '/auth/signin',
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
            process.env.SECRET_KEY,
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
  },
  {
    method: 'POST',
    path: '/auth/signup',
    config: {
      auth: false,
    },
    handler: async (request, h) => {
      //
    },
  },
];
