import jwt from "jsonwebtoken";
import ENVIRONMENT from "../environment/environment.js";
import { sendResponse } from "../utils/helper.js";

function authMiddleware(req, res, next) {
	const authHeader = req.headers["authorization"];

	if (!authHeader?.startsWith("Bearer ")) {
		return sendResponse(res, 401, "Authorization header missing");
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return sendResponse(res, 401, "Token missing");
	}

	try {
		const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return sendResponse(res, 401, "Token expired");
		}
		return sendResponse(res, 401, "Invalid token");
	}
}

export default authMiddleware;
