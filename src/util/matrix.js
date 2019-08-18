export const transpose = array => {
  return (array[0] || []).map((col, i) => array.map(row => row[i]));
};

export const rot45 = array => {
  let h = array.length;
  if (h === 0) {
    return [];
  }
  let w = array[0].length;
  let m = Math.min(h, w);
  return Array(w + h - 1)
    .fill(0)
    .map((_, k) => {
      let n = k - w + 1;
      let a = Math.max(0, -n);
      let b = Math.min(w, h - n);
      let length = b - a;
      return Array(length)
        .fill(0)
        .map((_, p) => {
          let i = a + p;
          return array[n + i][i];
        });
    });
};

let a01235678 = Array(9)
  .fill(0)
  .map((_, k) => k)
  .filter(k => k !== 4);

export const around8 = a01235678.map(k => [Math.floor(k / 3) - 1, (k % 3) - 1]);

export const surrounding8 = ([a, b]) => around8.map(([x, y]) => [a + x, b + y]);
