function getWeekDates(): string[] {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    let diff = currentDay - 1; // 1 represents Monday
    if (diff < 0) diff += 7; // if it's Sunday, diff will be -1, so add 7 to make it 6

    const monday = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - diff
    );

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + i
        );
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
        const day = ("0" + date.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        weekDates.push(formattedDate);
    }

    return weekDates;
}

export { getWeekDates };