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

exports.getAllTeams = async function () {
	try {
		const query = 'SELECT * FROM teams';
		const values = [];
		return await pool.query(query, values);
	} catch (err) {
        console.log(err);
		return false;
	}
};

exports.getSelectedTeams = async function () {
	try {
		const query = 'SELECT * FROM teams WHERE selected = true;';
		const values = [];
		return await pool.query(query, values);
	} catch (err) {
        console.log(err);
		return false;
	}
};

exports.setTeams = async function (first, second) {
	console.log(first, second);
	try {
		const query = 'UPDATE teams SET selected = false WHERE selected = true;';
		const values = [];
		await pool.query(query, values);

		const query2 = 'UPDATE teams SET selected = true WHERE teamname = $1 OR teamname = $2;';
		const values2 = [first.name, second.name];
		return await pool.query(query2, values2);
	} catch (err) {
		console.log(err);
		return false;
	}
};