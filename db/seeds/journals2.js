
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('journals2').del()
  await knex('journals2').insert([]);
};
