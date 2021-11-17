const sswEstablishedYear = 1995;

const getYearsSinceSSWEstablished = (): number[] => {
  const currentYear = new Date().getFullYear();
  return new Array(currentYear - sswEstablishedYear + 1)
    .fill(null)
    .map((_, i) => currentYear - i);
};

export { getYearsSinceSSWEstablished };
