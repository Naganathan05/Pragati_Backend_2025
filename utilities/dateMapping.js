export const convertDate = function (inputDate) {
    const dateMap = {
        "2025-02-01": '1',
        "2025-02-02": '2',
        "2025-02-03": '3',
        '1': "2025-02-01",
        '2': "2025-02-02",
        '3': "2025-02-03"
    };

    return dateMap[inputDate];
}