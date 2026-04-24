import { sendResponse, handleError, hashPassword } from "../utils/helper.js";
import { validateUserData, validateUserPatch, validateUserStatus } from "../utils/validate.js";
import {
    getAllUsers as getAllUsersRepo,
    getUserById as getUserByIdRepo,
    patchUser,
    setUserStatus as setUserStatusRepo
} from "../repositories/user.repository.js";

async function getAllUsers(req, res) {
    try {
        const users = await getAllUsersRepo();
        return sendResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const user = await getUserByIdRepo(userId);
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }
        return sendResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (email !== undefined) fields.email = email;
    if (password !== undefined) fields.password = password;

    const validation = validateUserPatch(fields);
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        if (fields.password) {
            fields.password = await hashPassword(fields.password);
        }
        const success = await patchUser(fields, userId);
        if (!success) {
            return sendResponse(res, 404, "User not found");
        }
        return sendResponse(res, 200, "User updated successfully");
    } catch (error) {
        return handleError(res, error);
    }
}

async function setUserStatus(req, res) {
    const userId = req.params.id;
    const { is_active } = req.body;
    const validation = validateUserStatus({ is_active });
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        const success = await setUserStatusRepo(userId, is_active);
        if (!success) {
            return sendResponse(res, 404, "User not found");
        }
        return sendResponse(res, 200, is_active ? "User activated successfully" : "User deactivated successfully");
    } catch (error) {
        return handleError(res, error);
    }
}

export { getAllUsers, getUserById, updateUser, setUserStatus };

