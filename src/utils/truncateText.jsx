export const truncateText = (text, number) => {
    return text.length > number ? text.slice(0, number) + "..." : text;
}