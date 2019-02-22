exports.seed = (knex, Promise) => {
  const rows = [
    {
      name: 'Shreyansh Pandey',
      username: 'labsvisual',
      password: 'password',
      email: 'me@isomr.co',
      guid: 'f03ede7c-b121-4112-bcc7-130a3e87988c',
    },
    {
      name: 'Rotimi Babalola',
      username: 'senhor_rotimi',
      password: 'password',
      email: 'rotimi@rotimi.com',
      guid: 'd9514fb1-9148-4462-bbde-6adddba95a5e',
    },
  ];
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(rows);
    });
};
