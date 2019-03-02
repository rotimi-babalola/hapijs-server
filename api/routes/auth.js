import jwt from 'jsonwebtoken';
// import Boom from 'boom';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v1';
import { verifyUniqueUser } from '../../utils/verifyUniqueUser';
import { createToken } from '../../utils/createToken';
import createUserSchema from '../schemas/createUserSchema';
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
      pre: [{ method: verifyUniqueUser }],
      validate: {
        payload: createUserSchema,
      },
    },
    handler: async (request, h) => {
      // eslint-disable-next-line object-curly-newline
      const { name, username, email, password } = request.payload;
      const guid = uuid();
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      try {
        const createdUser = await Knex('users')
          .returning(['name', 'username', 'email', 'guid'])
          .insert({
            name,
            username,
            email,
            password: hashedPassword,
            guid,
          });

        return h
          .response({
            token: createToken(createdUser[0]),
          })
          .code(201);
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
];
