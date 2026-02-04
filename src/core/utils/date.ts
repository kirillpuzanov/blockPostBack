export const addDay = (date: string, addDays = 1): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + addDays);
  return result.toISOString();
};
