import Knex from '../src/knex';

const verifyOwner = async (request, h) => {
  const { birdGuid } = request.params;
  const { scope } = request.auth.credentials;
  try {
    const bird = await Knex('birds')
      .where({
        guid: birdGuid,
      })
      .select('owner')
      .first();

    if (!bird) {
      return h
        .response({
          message: `Bird with guid ${birdGuid} not found`,
          error: true,
        })
        .takeover();
    }
    if (bird.owner !== scope) {
      return h
        .response({
          message: 'You are not permitted to access this bird',
          error: true,
        })
        .code(403)
        .takeover();
    }
    return h.continue;
  } catch (error) {
    return h.response({
      error: error.toString(),
      message: 'An error occurred',
    });
  }
};

export default verifyOwner;
