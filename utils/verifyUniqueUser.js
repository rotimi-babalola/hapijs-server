import Boom from 'boom';
import Knex from '../src/knex';

export const verifyUniqueUser = async (request, h) => {
  const { username, email, guid } = request.payload;
  // find entry that matches user details
  const user = await Knex('users')
    .where({
      username,
    })
    .orWhere({
      email,
    })
    .orWhere({
      guid,
    });

  if (user.username === username) {
    return Boom.badRequest('Username taken');
  }
  if (user.email === email) {
    return Boom.badRequest('Email taken');
  }
  if (user.guid === guid) {
    return Boom.badRequest('Guid taken');
  }

  // if all is well go ahead to the route handler
  return h.response(request.payload);
};
