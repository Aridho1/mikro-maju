const urlSearchParams = new URLSearchParams(location.search);
const url_param = {};
urlSearchParams.forEach((val, key) => ((url_param[key] = val), true));

console.warn(url_param);

export { url_param, urlSearchParams };
