export const getJson = async (path) => {
    const fetched = await fetch(path);
    return await fetched.json();
};

export const getConfigJson = async (path = "") => await getJson(path + "config.json");

const config = await getConfigJson();

export { config };
