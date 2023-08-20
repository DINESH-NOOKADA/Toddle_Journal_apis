exports.up = function(knex) {
    return knex.schema.createTable('tagged2', function(table) {
        table.integer('journalid').notNullable();
        table.integer('studentid').notNullable();
      });
    
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tagged2');
  };
  
