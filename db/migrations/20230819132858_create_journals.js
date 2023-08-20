exports.up = function(knex) {

    return knex.schema.dropTable('journals');
  };
  
  exports.down = function(knex) {
    return knex.schema.createTable('journals', function(table) {
      table.increments('journalid').primary();
      table.integer('teacherid').notNullable();
      table.string('description').notNullable();
      table.string('url');
      table.string('publishedDate');
    });
  };
  
