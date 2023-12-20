const { Pool } = require('pg');
const DOTENV = require('dotenv');
DOTENV.config();

// Credentials for the database connection
const credentials = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: 'neondb',
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	ssl: {
		rejectUnauthorized: false,
	},
};

// Connect to PostgreSQL
const pool = new Pool(credentials);

exports.getQuizes = async () => {
	try {
		return await pool.query(`
        SELECT
            q.id AS question_id,
            q.question,
            json_agg(
                json_build_object(
                    'id', a.id,
                    'answer', a.answer,
                    'correct', a.correct
                )
            ) AS answers
        FROM
            questions q
        JOIN
            answers a ON q.id = a.question_id
        GROUP BY
            q.id, q.question
        ORDER BY
            q.id ASC;
        `);
	} catch (error) {
		console.log(error);
	}
};

exports.getQuiz = async (id) => {
    try {
        return await pool.query(`
        SELECT
            q.id AS question_id,
            q.question,
            json_agg(
                json_build_object(
                    'id', a.id,
                    'answer', a.answer,
                    'correct', a.correct
                )
            ) AS answers
        FROM
            questions q
        JOIN
            answers a ON q.id = a.question_id
        WHERE
            q.id = ${id}
        GROUP BY
            q.id, q.question
        ORDER BY
            q.id ASC;
        `);
    } catch (error) {
        console.log(error);
    }
};