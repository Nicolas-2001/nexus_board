import { connection } from "../database/databaseConnection.js";
import { handleMysqlError } from "../utils/helper.js";

async function getUserByEmail(email) {
	try {
		const [rows] = await connection.execute("SELECT id, name, email, password FROM users WHERE email = ?", [email]);
		return rows[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getUserById(userId) {
	try {
		const [rows] = await connection.execute("SELECT id, name, email FROM users WHERE id = ?", [userId]);
		return rows[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getAllUsers() {
	try {
		const [rows] = await connection.execute("SELECT id, name, email FROM users");
		return rows;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function createUser(name, email, password) {
	try {
		const [result] = await connection.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
		return result.insertId;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function patchUser(fields, userId) {
	try {
		const entries = Object.entries(fields);
		const setClauses = entries.map(([key]) => `${key} = ?`).join(", ");
		const values = [...entries.map(([, val]) => val), userId];
		const [result] = await connection.execute(`UPDATE users SET ${setClauses} WHERE id = ?`, values);
		return result.affectedRows > 0;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function setUserStatus(userId, isActive) {
	try {
		const [result] = await connection.execute("UPDATE users SET is_active = ? WHERE id = ?", [isActive ? 1 : 0, userId]);
		return result.affectedRows > 0;
	} catch (error) {
		handleMysqlError(error);
	}
}

export { getUserByEmail, getUserById, getAllUsers, createUser, patchUser, setUserStatus };
