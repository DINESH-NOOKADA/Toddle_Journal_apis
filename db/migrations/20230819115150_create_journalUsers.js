exports.up = function(knex) {
    return knex.schema.createTable('journalUsers', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('journalUsers');
  };
