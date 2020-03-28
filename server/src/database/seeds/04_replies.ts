import * as Knex from "knex";

export async function seed(knex: Knex) {
	// Deletes ALL existing entries
	return knex('replies').del()
		.then(() => {
			// Inserts seed entries
			return knex('replies').insert([
				{
					// id: 1,
					body: 'thanks',
					user_id: 1,
					comment_id: 1,
				},
			]);
		});
};
