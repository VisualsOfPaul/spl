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

exports.setPoints = async (team, points) => {

	try {
		await pool.query(`UPDATE points SET points = ${points} WHERE teamname = '${team}'`);
	} catch (error) {
		console.log(error);
	}
};

exports.getPoints = async (team) => {
	try {
		return await pool.query(`SELECT points FROM points WHERE teamname = '${team}'`);
	} catch (error) {
		console.log(error)
	}
};

exports.resetPoints = async () => {
	try {
		await pool.query(`UPDATE points SET points = 0`);
	} catch (error) {
		console.log(error);
	}
};