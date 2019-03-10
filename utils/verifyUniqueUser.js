import Boom from 'boom';
import Knex from '../src/knex';

export const verifyUniqueUser = async (request, h) => {
  const { username, email, guid } = request.payload;
  // find entry that matches user details
  try {
    const user = await Knex('users')
      .where('username', username)
      .orWhere('email', email)
      .select('username', 'password')
      .first();

    if (user && user.username === username) {
      return Boom.badRequest('Username taken');
    }
    if (user && user.email === email) {
      return Boom.badRequest('Email taken');
    }
    if (user && user.guid === guid) {
      return Boom.badRequest('Guid taken');
    }
    // if a user is not found move on to route handler
    return h.response(request.payload);
  } catch (error) {
    return h
      .response({
        error: error.toString(),
        message: 'An error occurred',
      })
      .code(500);
  }
};
