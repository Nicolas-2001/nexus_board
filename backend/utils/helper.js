import os from "node:os";
import ENVIRONMENT from "../environment/environment.js";
import { MYSQL_ERRORS, patterns, mysqlPatterns } from "../utils/constants.js";
import {
	DataOutOfRangeError,
	DatabaseError,
	DuplicateEntryError,
	ForeignKeyNotFoundError,
	InvalidValueError,
	NullFieldError,
	ReferencedRowError,
	DataTooLongError,
} from "../utils/error.js";
import bcrypt from "bcryptjs";

/**
 * Returns the first non-loopback IPv4 address of the machine.
 * Falls back to "127.0.0.1" if none is found.
 * @returns {string} Local IP address
 */
function getLocalIpAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		const networkInterface = interfaces[name] || [];
		for (const iface of networkInterface) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1";
}

function formatError(error) {
	if (!error) return null;

	if (ENVIRONMENT.DEBUG) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack,
			code: error.code,
			statusCode: error.statusCode,
		};
	}

	return {
		name: error.name,
		message: error.message,
	};
}

function sendResponse(res, statusCode, message, data = null, error = null) {
	return res.status(statusCode).json({
		status: statusCode,
		message,
		data,
		error: formatError(error),
	});
}

function handleError(res, error, defaultMessage = "Internal server error") {
	const statusCode = error?.statusCode ?? 500;
	const message = error?.statusCode ? error.message : defaultMessage;
	return sendResponse(res, statusCode, message, null, error);
}

function extractMatch(sqlMessage, pattern, index = 1) {
	return sqlMessage?.match(pattern)?.[index];
}

function handleMysqlError(error) {
	if (!error || typeof error !== "object") {
		throw error;
	}

	const { code, sqlMessage } = error;

	switch (code) {
		case MYSQL_ERRORS.DUP_ENTRY: {
			const field = extractMatch(sqlMessage, mysqlPatterns.duplicateEntryKey) ?? "field";
			throw new DuplicateEntryError(`The ${field} is already in use.`, error);
		}

		case MYSQL_ERRORS.BAD_NULL:
			throw new NullFieldError(extractMatch(sqlMessage, mysqlPatterns.cannotBeNull));

		case MYSQL_ERRORS.NO_DEFAULT_FOR_FIELD:
			throw new NullFieldError(extractMatch(sqlMessage, mysqlPatterns.columnName));

		case MYSQL_ERRORS.DATA_TOO_LONG:
			throw new DataTooLongError(extractMatch(sqlMessage, mysqlPatterns.dataTooLong));

		case MYSQL_ERRORS.TRUNCATED_WRONG_VALUE:
			throw new InvalidValueError(extractMatch(sqlMessage, mysqlPatterns.columnName));

		case MYSQL_ERRORS.WARN_DATA_OUT_OF_RANGE:
			throw new DataOutOfRangeError(extractMatch(sqlMessage, mysqlPatterns.columnName));

		case MYSQL_ERRORS.NO_REFERENCED_ROW:
			throw new ForeignKeyNotFoundError();

		case MYSQL_ERRORS.ROW_IS_REFERENCED:
			throw new ReferencedRowError();

		case MYSQL_ERRORS.LOCK_DEADLOCK:
		case MYSQL_ERRORS.LOCK_WAIT_TIMEOUT:
		case MYSQL_ERRORS.CONNECTION_LOST:
		case MYSQL_ERRORS.CONNECTION_REFUSED:
		case MYSQL_ERRORS.TIMEOUT:
		case MYSQL_ERRORS.TOO_MANY_CONNECTIONS:
		case MYSQL_ERRORS.ACCESS_DENIED:
			throw new DatabaseError();

		default:
			throw error;
	}
}

function validateFields(fields = [], data = {}) {
	const missingFields = fields.filter((field) => !data[field]?.toString().trim());
	if (missingFields.length > 0) {
		return {
			valid: false,
			message: `Missing required fields: ${missingFields.join(", ")}`,
		};
	}
	return { valid: true };
}

function validateFormat(fields = {}) {
	const invalidFields = [];
	for (const [fieldName, { value, type }] of Object.entries(fields)) {
		if (patterns[type] && !patterns[type].test(value)) {
			invalidFields.push(fieldName);
		}
	}
	if (invalidFields.length > 0) {
		return {
			valid: false,
			message: `Invalid format for fields: ${invalidFields.join(", ")}`,
		};
	}
	return { valid: true };
}

function hashPassword(password) {
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hash) {
	return bcrypt.compare(password, hash);
}

export { getLocalIpAddress, sendResponse, handleError, handleMysqlError, validateFields, validateFormat, hashPassword, comparePassword };
