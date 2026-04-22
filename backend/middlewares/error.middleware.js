import { sendResponse } from "../utils/helper.js";

/**
 * 404 handler — must be registered after all other routes.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function notFoundHandler(req, res, next) {
	sendResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
}

/**
 * Global error handler — must be registered last with 4 parameters so Express
 * recognises it as an error-handling middleware.
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorHandler(err, req, res, next) {
	if (err.type === "entity.parse.failed") {
		return sendResponse(res, 400, "Invalid JSON in request body");
	}
	sendResponse(res, 500, "Internal server error");
}

export { notFoundHandler, errorHandler };
