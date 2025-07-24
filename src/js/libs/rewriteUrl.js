/**
 * reFill url_param by formData
 * @param {FormData} formData - Constructor FormData
 * @param {Object} url_param - Object url_param | value and keys of UrlSearchParam of location.search
 * @returns {Boolean} Boolean - is new url not equal to current url
 */

export default function rewriteUrl(formData, url_param) {
    if (formData?.constructor?.name != "FormData") return console.error("formData must be instance of FormData!");

    const filterDuplicate = {};
    formData.forEach((val, key) => !filterDuplicate[key] && ((filterDuplicate[key] = true), (url_param[key] = val)));

    formData.forEach((val, key) => console.log({ [key]: val }));
    const newUrl = "?" + new URLSearchParams(url_param);
    console.log(location.search);
    console.log(newUrl);

    return location.search != newUrl && (history.pushState([], "", newUrl), true);
}
