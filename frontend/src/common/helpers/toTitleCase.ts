export const toTitleCase = (str: string): string => {
  return str.replace(
    /\b[A-Z]+\b/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
};
