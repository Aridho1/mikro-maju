export const oneDayOfTimestamp = 1000 * 60 * 60 * 24;

export const timestampToDate = (timestamp) => new Date(timestamp).toISOString().split(/T/)[0].split(/\-/).reverse().join("-");

export const getDateByDatepickerEl = (el) => {
    const timestamp = el?.datepicker?.dates?.[0];

    return timestamp && timestampToDate(timestamp + oneDayOfTimestamp);
};
