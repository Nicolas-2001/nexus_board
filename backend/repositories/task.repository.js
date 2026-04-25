import { connection } from "../database/databaseConnection.js";
import { handleMysqlError } from "../utils/helper.js";

const TASK_FIELDS = "id, title, description, reporter_id, assigned_id, board_id, status_id, created_at";

async function getAllTasks(boardId = null) {
	try {
		const [rows] = boardId
			? await connection.execute(`SELECT ${TASK_FIELDS} FROM tasks WHERE board_id = ?`, [boardId])
			: await connection.execute(`SELECT ${TASK_FIELDS} FROM tasks`);
		return rows;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getTaskById(taskId) {
	try {
		const [rows] = await connection.execute(`SELECT ${TASK_FIELDS} FROM tasks WHERE id = ?`, [taskId]);
		return rows[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function createTask({ title, description, reporterId, assignedId, boardId, statusId }) {
	try {
		const [result] = await connection.execute(
			"INSERT INTO tasks (title, description, reporter_id, assigned_id, board_id, status_id) VALUES (?, ?, ?, ?, ?, ?)",
			[title, description ?? null, reporterId, assignedId ?? null, boardId, statusId]
		);
		return result.insertId;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function patchTask(fields, taskId) {
	try {
		const entries = Object.entries(fields);
		const setClauses = entries.map(([key]) => `${key} = ?`).join(", ");
		const values = [...entries.map(([, val]) => val), taskId];
		const [result] = await connection.execute(`UPDATE tasks SET ${setClauses} WHERE id = ?`, values);
		return result.affectedRows > 0;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function deleteTask(taskId) {
	try {
		const [result] = await connection.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
		return result.affectedRows > 0;
	} catch (error) {
		handleMysqlError(error);
	}
}

export { getAllTasks, getTaskById, createTask, patchTask, deleteTask };
