import { connection } from "../database/databaseConnection.js";
import { handleMysqlError } from "../utils/helper.js";

async function getAllBoards() {
	try {
		const [rows] = await connection.execute("SELECT id, name, description, owner_id, created_at FROM boards");
		return rows;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function createBoard(params) {
	try {
        const { name, description, ownerId } = params;
		const [result] = await connection.execute("INSERT INTO boards (name, description, owner_id) VALUES (?, ?, ?)", [name, description, ownerId]);
		return result.insertId;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getBoardById(boardId) {
	try {
		const [rows] = await connection.execute("SELECT id, name, description, owner_id, created_at FROM boards WHERE id = ?", [boardId]);
		return rows[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function patchBoard(fields, boardId) {
	try {
		const entries = Object.entries(fields);
		const setClauses = entries.map(([key]) => `${key} = ?`).join(", ");
		const values = [...entries.map(([, val]) => val), boardId];
		const [result] = await connection.execute(`UPDATE boards SET ${setClauses} WHERE id = ?`, values);
		return result.affectedRows > 0;
	} catch (error) {
		handleMysqlError(error);
	}
}

export { getAllBoards, createBoard, getBoardById, patchBoard };
