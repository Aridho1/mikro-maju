const specialType = "array";
const validType = ["boolean", "function", "number", "object", "string", "symbol", "undefined", specialType];

/**
 *
 * @param {Object} o Object
 * @param {string} type typeof
 * @param {truthy?} throwError true|default for thowing error (when type is invalid); false for return false
 */
export default function isTypeOf(o, type, throwError = true) {
	if (!o || typeof o !== "object" || Array.isArray(o)) {
		const message = "Parameter 'o' harus berupa objek dengan satu properti, contoh: { namaVariabel }";
		// if (throwError) throw new Error(message);
		// else return false;
		throw new Error(message);
	}
	if (typeof type !== "string") throw new Error(`Parameter 'type' harus berupa string!`);

	if (!validType.includes(type)) throw new Error(`type has to be one of ${validType.join(", ")}`);

	const keys = Object.keys(o);
	const propName = keys[0];

	if (type === specialType) {
		if (Array.isArray(o[propName])) return true;

		if (throwError) throw new Error(`property ${propName} has to be an array!`);
		else return false;
	}

	if (type === "object") {
		if (o[propName] && typeof o[propName] === "object") return true;

		if (throwError) throw new Error(`property ${propName} has to be an object!`);
		else return false;
	}

	if (typeof o[propName] === type) return true;
	if (throwError) throw new Error(`property ${propName} has to be an ${type}!`);
	else return false;
}
