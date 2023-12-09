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

exports.getEntries = async function () {
	try {
		const query = 'SELECT * FROM bandages';
		const values = [];
		return await pool.query(query, values);
	} catch (err) {
        console.log(err);
		return false;
	}
};

// exports.createEntry = async function() {
// 	try {
// 		const query = 'INSERT INTO bandages (DEFAULT, $1, $2, $3, $4, $5)'
// 		const value = [];
// 	} catch (err) {

// 	}
// }