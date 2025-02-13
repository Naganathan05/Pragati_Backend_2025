export const convertDate = function (inputDate) {
    const dateMap = {
        "2025-03-01": "1",
        "2025-03-02": "2",
        "2025-03-03": "3",
        1: "2025-03-01",
        2: "2025-03-02",
        3: "2025-03-03",
    };

    return dateMap[inputDate];
};
