import app from "./app.js";
import ENVIRONMENT from "./environment/environment.js";
import { testConnection } from "./database/databaseConnection.js";
import { getLocalIpAddress } from "./utils/helper.js";

const PORT = ENVIRONMENT.API_PORT || 3000;

/**
 * Initializes the database connection and starts the HTTP server.
 * Exits the process if the database connection fails.
 * @returns {Promise<void>}
 */
async function startServer() {
	await testConnection();

	app.listen(PORT, () => {
		if (ENVIRONMENT.DEBUG) {
			console.log(`Server running at http://${getLocalIpAddress()}:${PORT}/ in ${ENVIRONMENT.NODE_ENV} mode`);
			console.log(`Server is running in ${ENVIRONMENT.NODE_ENV} mode`);
			console.log(`Date started: ${new Date().toLocaleString()}`);
			console.log("Press CTRL-C to stop");
		}
	});
}

await startServer();
