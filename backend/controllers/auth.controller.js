import jwt from "jsonwebtoken";
import { sendResponse, handleError, validateFields, validateFormat, hashPassword, comparePassword } from "../utils/helper.js";
import { createUser, getUserByEmail } from "../repositories/user.repository.js";
import ENVIRONMENT from "../environment/environment.js";
import { NotFoundError } from "../utils/error.js";

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
	const validation = validateLogin({ email });
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
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

function validateUserData(data) {
	const validation = validateFields(["name", "email", "password"], data);
	if (!validation.valid) {
		return validation;
	}
	return validateFormat({
		name: { value: data.name, type: "letters" },
		email: { value: data.email, type: "email" },
		password: { value: data.password, type: "password" },
	});
}

function validateLogin(fields) {
	const validation = validateFields(["email"], fields);
	if (!validation.valid) {
		return validation;
	}
	return validateFormat({
		email: { value: fields.email, type: "email" },
	});
}

export { registerUser, loginUser };
