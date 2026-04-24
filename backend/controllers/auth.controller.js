import jwt from "jsonwebtoken";
import { sendResponse, handleError, hashPassword, comparePassword } from "../utils/helper.js";
import { createUser, getUserByEmail } from "../repositories/user.repository.js";
import ENVIRONMENT from "../environment/environment.js";
import { validateUserData, validateLoginData } from "../utils/validate.js";

async function registerUser(req, res) {
	const { name, email, password } = req.body;
	const validation = validateUserData({ name, email, password });
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return sendResponse(res, 409, "Email already in use");
		}
		const hashedPassword = await hashPassword(password);
		const userId = await createUser(name, email, hashedPassword);
		return sendResponse(res, 201, "User registered successfully", { id: userId });
	} catch (error) {
		return handleError(res, error);
	}
}

async function loginUser(req, res) {
	const { email, password } = req.body;
	const validation = validateLoginData({ email, password });
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const user = await getUserByEmail(email);
		if (!user || !(await comparePassword(password, user.password))) {
			return sendResponse(res, 401, "Invalid credentials");
		}
		const token = jwt.sign({ id: user.id, email: user.email }, ENVIRONMENT.JWT_SECRET, {
			algorithm: "HS256",
			expiresIn: ENVIRONMENT.JWT_EXPIRES_IN,
		});
		return sendResponse(res, 200, "Login successful", { token, user: { id: user.id, name: user.name, email: user.email } });
	} catch (error) {
		return handleError(res, error);
	}
}

export { registerUser, loginUser };
