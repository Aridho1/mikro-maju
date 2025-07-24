const fill = (formData, formSearch, prop, listed_props = []) => {
    const ctx = formSearch[prop];
    listed_props.push(prop);
    const listed_prop = listed_props.join("_");

    const type = typeof ctx;
    // console.log({ prop, listed_prop, ctx, type });

    switch (type) {
        case "boolean": {
            formData.append(listed_prop, ctx ? "on" : "");
            break;
        }
        case "string":
        case "number": {
            formData.append(listed_prop, ctx);
            break;
        }
        case "object": {
            if (Array.isArray(ctx)) {
                // // array of object
                // if (ctx[0] && typeof ctx[0] == "object") {

                // }

                formData.append(listed_prop, ctx.join());
                break;
            }

            if (ctx) {
                // fill(formData, formSearch[prop], prop)
                Object.keys(ctx).forEach((_prop) => {
                    fill(formData, ctx, _prop, [...listed_props]);
                });
                break;
            }
            // else {
            //     console.warn("OBJECT TIDAK DIDUKUNG!\n got:", ctx, "prop:", prop, "type:", type);
            //     formData.append(prop, "");
            // }

            // break;
        }
        default: {
            formData.append(listed_prop, "");
            break;
        }
    }
};

export default function bindAndFillFormData(formData, formSearch, prefix = "") {
    const name = formData?.constructor?.name;
    if (name != "FormData") return console.error("formData must be instance of FormData");

    if (!formSearch || typeof formSearch != "object") return console.error("formSearch must be an object!");
    if (typeof prefix != "string") return console.error("prefix must be an string!");

    Object.keys(formSearch).forEach((prop) => {
        fill(formData, formSearch, prop, prefix ? [prefix] : []);
    });

    return formData;
}
