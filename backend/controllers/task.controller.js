import { sendResponse, handleError } from "../utils/helper.js";
import { validateTaskData, validateTaskPatch } from "../utils/validate.js";
import {
	getAllTasks as getAllTasksRepo,
	getTaskById as getTaskByIdRepo,
	createTask as createTaskRepo,
	patchTask,
	deleteTask as deleteTaskRepo,
} from "../repositories/task.repository.js";

async function getAllTasks(req, res) {
	try {
		const boardId = req.query.board_id || null;
		const tasks = await getAllTasksRepo(boardId);
		return sendResponse(res, 200, "Tasks retrieved successfully", tasks);
	} catch (error) {
		return handleError(res, error);
	}
}

async function getTaskById(req, res) {
	try {
		const task = await getTaskByIdRepo(req.params.id);
		if (!task) {
			return sendResponse(res, 404, "Task not found");
		}
		return sendResponse(res, 200, "Task retrieved successfully", task);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createTask(req, res) {
	const { title, description, assigned_id, board_id, status_id } = req.body;
	const validation = validateTaskData({ title, board_id, status_id });
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const taskId = await createTaskRepo({
			title,
			description,
			reporterId: req.user.id,
			assignedId: assigned_id,
			boardId: board_id,
			statusId: status_id,
		});
		return sendResponse(res, 201, "Task created successfully", { id: taskId });
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateTask(req, res) {
	const taskId = req.params.id;
	const { title, description, assigned_id, status_id } = req.body;
	const fields = {};
	if (title !== undefined) fields.title = title;
	if (description !== undefined) fields.description = description;
	if (assigned_id !== undefined) fields.assigned_id = assigned_id;
	if (status_id !== undefined) fields.status_id = status_id;

	const validation = validateTaskPatch(fields);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const success = await patchTask(fields, taskId);
		if (!success) {
			return sendResponse(res, 404, "Task not found");
		}
		return sendResponse(res, 200, "Task updated successfully");
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteTask(req, res) {
	try {
		const success = await deleteTaskRepo(req.params.id);
		if (!success) {
			return sendResponse(res, 404, "Task not found");
		}
		return sendResponse(res, 200, "Task deleted successfully");
	} catch (error) {
		return handleError(res, error);
	}
}

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
