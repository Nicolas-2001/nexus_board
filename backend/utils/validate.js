import { validateFields, validateFormat } from "./helper.js";

function validate(data, schema) {
	const fieldsResult = validateFields(Object.keys(schema), data);
	if (!fieldsResult.valid) return fieldsResult;

	const formatSchema = Object.fromEntries(
		Object.entries(schema)
			.filter(([, type]) => type !== null)
			.map(([key, type]) => [key, { value: data[key], type }])
	);
	return validateFormat(formatSchema);
}

function validateLoginData(data) {
	return validate(data, { email: "email", password: null });
}

function validateUserData(data) {
	return validate(data, { name: "letters", email: "email", password: "password" });
}

function validateUserStatus(data) {
	if (data.is_active === undefined) {
		return { valid: false, message: "Missing required fields: is_active" };
	}
	if (![0, 1, true, false].includes(data.is_active)) {
		return { valid: false, message: "is_active must be 0, 1, true, or false" };
	}
	return { valid: true };
}

function validateUserPatch(data) {
	const schema = { name: "letters", email: "email", password: "password" };
	const provided = Object.fromEntries(
		Object.entries(schema).filter(([key]) => data[key] !== undefined)
	);
	if (Object.keys(provided).length === 0) {
		return { valid: false, message: "At least one field must be provided: name, email, password" };
	}
	return validateFormat(
		Object.fromEntries(
			Object.entries(provided).map(([key, type]) => [key, { value: data[key], type }])
		)
	);
}

function validateBoardData(data) {
	return validate(data, { name: "alphanumeric" });
}

function validateBoardPatch(data) {
	if (data.name === undefined && data.description === undefined) {
		return { valid: false, message: "At least one field must be provided: name, description" };
	}
	if (data.name !== undefined) {
		return validateFormat({ name: { value: data.name, type: "alphanumeric" } });
	}
	return { valid: true };
}

export { validateLoginData, validateUserData, validateUserPatch, validateUserStatus, validateBoardData, validateBoardPatch };
