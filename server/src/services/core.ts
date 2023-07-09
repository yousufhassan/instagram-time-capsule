export const getFormattedDate = (date: Date) => {
    return (
        date.getFullYear() +
        "-" +
        date.toLocaleDateString("default", { month: "2-digit" }) +
        "-" +
        date.toLocaleDateString("default", { day: "2-digit" })
    );
};
