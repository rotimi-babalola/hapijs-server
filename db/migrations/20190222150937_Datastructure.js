exports.up = (knex) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  knex.schema
    .createTable('users', (userTable) => {
      // Primary key
      userTable.increments();

      // Data
      userTable.string('name', 50).notNullable();
      userTable
        .string('username', 50)
        .notNullable()
        .unique();
      userTable
        .string('email', 250)
        .notNullable()
        .unique();
      userTable.string('password', 128).notNullable();
      userTable
        .string('guid', 50)
        .notNullable()
        .unique();

      userTable
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('birds', (birdsTable) => {
      // primary key
      birdsTable.increments();
      birdsTable
        .string('owner')
        .references('guid')
        .inTable('users');

      // data
      birdsTable.string('name', 250).notNullable();
      birdsTable.string('species', 250).notNullable();
      birdsTable.string('picture_url', 250).notNullable();
      birdsTable
        .string('guid', 250)
        .notNullable()
        .unique();
      birdsTable
        .string('isPublic', 250)
        .notNullable()
        .defaultTo(true);

      birdsTable
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    });

exports.down = (knex) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  knex.schema.dropTableIfExists('birds').dropTableIfExists('users');
