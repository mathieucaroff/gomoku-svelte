export const assert = (a, b) => {
  console.assert(JSON.stringify(a) === JSON.stringify(b), a, b);
};
