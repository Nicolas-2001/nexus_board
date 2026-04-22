import mysql from "mysql2/promise";
import ENVIRONMENT from "../environment/environment.js";

/**
 * Shared MySQL connection pool.
 * Use `connection.getConnection()` for transactions or `connection.execute()` for queries.
 * @type {import("mysql2/promise").Pool}
 */
export const connection = mysql.createPool({
	host: ENVIRONMENT.DB_HOST,
	user: ENVIRONMENT.DB_USER,
	password: ENVIRONMENT.DB_PASSWORD,
	database: ENVIRONMENT.DB_NAME,
	port: ENVIRONMENT.DB_PORT,
	connectionLimit: ENVIRONMENT.DB_CONNECTION_LIMIT,
	queueLimit: ENVIRONMENT.DB_QUEUE_LIMIT,
});

/**
 * Verifies that the pool can reach the database.
 * Called once at startup; exits the process with code 1 on failure.
 * @returns {Promise<void>}
 */
export async function testConnection() {
	try {
		const conn = await connection.getConnection();
		console.log("Database connection successful");
		conn.release();
	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1);
	}
}
