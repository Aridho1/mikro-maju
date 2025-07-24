import { defaultErrorProps, defaultSuccessProps } from "../libs/swal2props.js";

export default function encodeFetchedJson(text_result, act_name, callback) {
    console.log("encode,,,");
    try {
        const json = JSON.parse(text_result);

        console.log(json);

        if (!json.status) throw new Error(json.msg);

        if (act_name && json.msg) Swal.fire({ ...defaultSuccessProps, text: json.msg });

        if (typeof callback == "function") callback(json, text_result);
    } catch (e) {
        console.error(e, "text:", text_result);
        console.log(text_result);
        if (act_name) Swal.fire({ ...defaultErrorProps, text: "Terjadi kesalahan saat " + act_name + " : " + e.message });

        return false;
    }

    return true;
}
