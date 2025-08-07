export const truncateText = (text: string, maxLength: number = 300): string => {
  if (typeof text !== "string") return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
