const _type = {
    string(propName, value, formSearch) {
        formSearch[propName] = value;
        // let _ctx = formSearch;
        // let _propName = propName;

        // const splited = propName.split(/\./).filter((val) => val);

        // if (splited.length > 1) {
        //     splited.forEach((_key, i) => {
        //         if (i + 1 == splited.length) {
        //             _propName = _key;
        //             return;
        //         }
        //         _ctx = _ctx[_key];
        //     });
        // }

        // _ctx[_propName] = value;

        // if (!/\./.test(propName)) formSearch[propName] = value;
        // else {
        //     _ctx = { ...formSearch };

        //     const splited = propName.split(".");

        //     splited.forEach((_key, i) => {
        //         if (i + 1 == splited.length) return;
        //         _ctx = _ctx[_key];
        //     });

        //     _ctx;
        // }
    },
    int(propName, value, formSearch) {
        if (isNaN(value)) return;
        formSearch[propName] = value - 0;
    },
    boolean(propName, value, formSearch) {
        formSearch[propName] = value && true;
    },
    array(propName, value, formSearch) {
        formSearch[propName] = value.split(/\,/).filter((val) => val);
    },
};

const _types = Object.keys(_type);

export default function fillFormsByUrlParam(props, formSearch, url_param) {
    if (!props || typeof props != "object") return console.error("props must be an object!", typeof props, { props });
    if (!formSearch || typeof formSearch != "object") return console.error("formSearch must be an object!", { formSearch });
    if (!url_param || typeof url_param != "object") return console.error("url_param must be an object!", { url_param });

    console.warn("EXEC");
    Object.keys(props).forEach((type, i) => {
        const propNames = [].concat(props[type]).filter((val) => val && typeof val == "string");

        type = type.toLowerCase();
        if (!_types.includes(type)) return console.warn("type must be an string: ", _types.join(), "\ngot:", type);

        propNames.forEach((propName) => {
            let value = url_param[propName];

            // handle obj :V
            let _ctx = formSearch;
            let _propName = propName;

            const splited = propName.split(/\./).filter((val) => val);

            if (splited.length > 1) {
                splited.forEach((_key, i) => {
                    if (i + 1 == splited.length) {
                        _propName = _key;
                        return;
                    }

                    // handle undefined prop
                    if (typeof _ctx[_key] == "undefined") {
                        _ctx[_key] = {};
                        console.log({ [_key]: "undefined jir" });
                    }

                    // console.log("KEY", _key);
                    _ctx = _ctx[_key];

                    // console.log("'_ctx':", _ctx);
                    // console.log("'formSearch':", formSearch);
                });

                value = url_param[splited.join("_")];
                // console.log("value", value);
                // console.log("_ctx", _ctx);
                // console.log("_propName", _propName);
                // console.log({ value, _ctx, _propName, splited });
            }

            if (typeof value != "string") return;
            console.log({ _propName, value, _ctx });

            // exec
            _type[type](_propName, value, _ctx);
        });

        //

        // switch (type.toLowerCase()) {
        //     case "string": {
        //         propNames.forEach((prop) => {
        //             if (url_param[prop]) formSearch[prop] = url_param[prop];
        //         });

        //         break;
        //     }
        //     case "array": {
        //         // console.log("ARRRRRRRR");
        //         propNames.forEach((prop) => {
        //             const ctx = url_param[prop];

        //             if (typeof ctx != "string") return;

        //             // console.log(ctx);

        //             formSearch[prop] = ctx.split(/\,/).filter((val) => val);
        //             // console.warn(formSearch[propNames]);
        //             // console.warn(ctx);
        //         });

        //         break;
        //     }
        //     case "boolean": {
        //         propNames.forEach((prop) => {
        //             const ctx = url_param[prop];

        //             if (typeof ctx != "string") return;

        //             formSearch[prop] = ctx && true;
        //         });

        //         break;
        //     }
        //     case "int": {
        //         propNames.forEach((prop) => {
        //             const ctx = url_param[prop];

        //             if (isNaN(ctx)) return;

        //             formSearch[prop] = ctx - 0;
        //         });

        //         break;
        //     }
        //     default: {
        //         console.warn("type must be an string: string,array,boolean,int!, got:", type);
        //     }
        // }
    });
}

// example
// fillFormsByUrlParam(
//     {
//         string: ["date_start", "date_end", "keyword"],
//         int: "page",
//         array: "filters",
//         boolean: "sort_desc",
//         // [typeof]: propNames(Array|String)
//     },
//     {} // formSearch
// );
