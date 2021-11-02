export const round = (temp) => Math.round(temp);

export const ternaire = (arg1, ar2, class1 = "hot", class2 = "cold") => {
  return arg1 > ar2 ? class1 : class2;
};
