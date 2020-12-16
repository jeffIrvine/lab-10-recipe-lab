const pool = require('../utils/pool');

module.exports = class Log {
    id;
    recipeId;
    dateOfEvent;
    notes;
    rating;

    constructor(row) {
      this.id = row.id;
      this.recipeId = row.recipe_id;
      this.dateOfEvent = row.data_of_event;
      this.notes = row.notes;
      this.rating = row.rating;
    }

    static async insert({ recipeId, dateOfEvent, notes, rating }) {
      const { rows } = await pool.query(
        'INSERT INTO logs (recipe_id, date_of_event, motes, rating) VALUES ($1, $2, $3, $4) RETURNING *',
        [recipeId, dateOfEvent, notes, rating]
      );
      return new Log(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query('SELECT * FROM logs WHERE id=$1', [id]);

      if(!rows[0]) throw new Error(JSON.stringify({ status: 404, message: `Could not find log with ${id}.` }));
      else return new Log(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM logs');

      return rows.map((row) => new Log(row));
    }

    static async update(id, { dateOfEvent, notes, rating, recipeId }) {
      const { rows } = await pool.query(`
        UPDATE logs
        SET date_of_event=$1,
            notes=$2,
            rating=$3,
            recipe_id=$4
        WHERE id=$5
        RETURNING *`,
      [dateOfEvent, notes, rating, recipeId, id]
      );

      if(!rows[0]) throw new Error(JSON.stringify(`Could not find log with ${id}.`));
      else return new Log(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(`
        DELETE FROM logs WHERE id=$1 RETURNING *`, [id]);

      return new Log(rows[0]);
    }
};



