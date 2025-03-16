export const AcceptOnlyNumbers = (value: string) => {
  return !isNaN(Number(value)) || value === "";
};
