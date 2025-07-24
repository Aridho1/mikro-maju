export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export const timestampToDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) return console.warn("timestamp must be an int | Date.now()");

    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    };
};

export const calculateTimeDifference = (timestamp1, timestamp2) => {
    if (!timestamp1 || isNaN(timestamp1) || !timestamp2 || isNaN(timestamp2)) return console.warn("timestamp1 and timestamp2 must be an int | Date.now()");

    const diff = Math.abs(timestamp1 - timestamp2);

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const miliseconds = diff % 1000;

    return { years, months, days, hours, minutes, seconds, miliseconds };
};
