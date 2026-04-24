import { sendResponse, handleError } from "../utils/helper.js";
import { validateBoardData, validateBoardPatch } from "../utils/validate.js";
import {
    getAllBoards as getAllBoardsRepo,
    getBoardById as getBoardByIdRepo,
    createBoard as createBoardRepo,
    patchBoard,
} from "../repositories/board.repository.js";

async function getAllBoards(req, res) {
    try {
        const boards = await getAllBoardsRepo();
        return sendResponse(res, 200, "Boards retrieved successfully", boards);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getBoardById(req, res) {
    try {
        const board = await getBoardByIdRepo(req.params.id);
        if (!board) {
            return sendResponse(res, 404, "Board not found");
        }
        return sendResponse(res, 200, "Board retrieved successfully", board);
    } catch (error) {
        return handleError(res, error);
    }
}

async function createBoard(req, res) {
    const { name, description } = req.body;
    const validation = validateBoardData({ name });
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        const boardId = await createBoardRepo({ name, description, ownerId: req.user.id });
        return sendResponse(res, 201, "Board created successfully", { id: boardId });
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateBoard(req, res) {
    const boardId = req.params.id;
    const { name, description } = req.body;
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (description !== undefined) fields.description = description;

    const validation = validateBoardPatch(fields);
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        const success = await patchBoard(fields, boardId);
        if (!success) {
            return sendResponse(res, 404, "Board not found");
        }
        return sendResponse(res, 200, "Board updated successfully");
    } catch (error) {
        return handleError(res, error);
    }
}

export { getAllBoards, getBoardById, createBoard, updateBoard };
