import { defaultErrorProps, defaultSuccessProps } from "../libs/swal2props.js";

/**
 *
 * @param {string} text_result
 * @param {string | undefined} act_name
 * @param {Function} callback
 * @param {Object} param3
 * @returns {Boolean}
 *
 * @example
 * encodeFetchedJson(await (await fetch('./path/to/file.ext')).text(), '', (json, textResult) => {}, { swalSuccess: false, swalError: false, errorCallback: (e) => console.error(e) })
 */
export default function encodeFetchedJson(text_result, act_name, callback, { swalSuccess = true, swalError = true, errorCallback = null } = {}) {
	console.log("encode,,,");
	try {
		const json = JSON.parse(text_result);

		console.log(json);

		if (!json.status) throw new Error(json.msg);

		if (swalSuccess && act_name && json.msg) Swal.fire({ ...defaultSuccessProps, text: json.msg });

		if (typeof callback == "function") callback(json, text_result);
	} catch (e) {
		console.error(e, "text:", text_result);
		console.log(text_result);
		if (swalError && act_name) Swal.fire({ ...defaultErrorProps, text: "Terjadi kesalahan saat " + act_name + " : " + e.message });

		if (typeof errorCallback == "function") errorCallback(e);

		console.log(e.message);

		return false;
	}

	return true;
}
