export default require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',

    user: 'rotimi',
    password: '',

    database: 'birdbase',
    charset: 'utf8',
  },
});
