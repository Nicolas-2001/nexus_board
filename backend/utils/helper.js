import os from "node:os";
import ENVIRONMENT from "../environment/environment.js";

/**
 * Returns the first non-loopback IPv4 address of the machine.
 * Falls back to "127.0.0.1" if none is found.
 * @returns {string} Local IP address
 */
function getLocalIpAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1";
}

/**
 * Sends a standardised JSON response.
 * In DEBUG mode the error object is spread to expose all properties;
 * in production only `name` and `message` are included.
 *
 * @param {import("express").Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message    - Human-readable response message
 * @param {*} [data=null]     - Response payload
 * @param {Error|null} [error=null] - Error to include in the response
 */
function sendResponse(res, statusCode, message, data = null, error = null) {
	if (ENVIRONMENT.DEBUG == "true") {
		res.status(statusCode).json({
			status: statusCode,
			message: message,
			data: data,
			error: error ? { name: error.name, message: error.message, ...error } : null,
		});
	} else {
		res.status(statusCode).json({
			status: statusCode,
			message: message,
			data: data,
			error: error ? { name: error.name, message: error.message } : null,
		});
	}
}

export { getLocalIpAddress, sendResponse };
