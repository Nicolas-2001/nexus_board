import dotenv from "dotenv";

dotenv.config();

const required = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME", "NODE_ENV"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
	throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

/**
 * Validated environment configuration loaded from .env.
 * Throws at import time if any required variable is missing.
 *
 * @property {string} DB_USER            - MySQL username
 * @property {string} DB_PASSWORD        - MySQL password
 * @property {string} DB_HOST            - MySQL host
 * @property {string} DB_PORT            - MySQL port
 * @property {string} DB_NAME            - Database name
 * @property {number} DB_CONNECTION_LIMIT - Max pool connections (default 10)
 * @property {boolean} DB_WAITING_FOR_CONNECTIONS - Always true; pool queues requests when full
 * @property {number} DB_QUEUE_LIMIT     - Max queued requests, 0 = unlimited (default 0)
 * @property {boolean} DEBUG             - Enables verbose logging and detailed error responses
 * @property {string} API_PORT           - HTTP server port
 * @property {string} NODE_ENV           - Runtime environment (development | production)
 */
const ENVIRONMENT = {
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.DB_NAME,
	DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT || 10,
	DB_WAITING_FOR_CONNECTIONS: true, // Always set to true to ensure the server waits for connections when the pool is full
	DB_QUEUE_LIMIT: process.env.DB_QUEUE_LIMIT || 0,
	DEBUG: process.env.DEBUG == "true",
	API_PORT: process.env.API_PORT,
	NODE_ENV: process.env.NODE_ENV,
};

export default ENVIRONMENT;
