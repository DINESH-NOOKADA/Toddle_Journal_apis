exports.up = function(knex) {
    return knex.schema.createTable('journaljwtUsers', function(table) {
      table.integer('id').notNullable();
      table.string('jwt').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('journaljwtUsers');
  };
