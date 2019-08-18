import { assert } from "./assert";

export const transpose = array => {
  // Source:
  // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
  if (array.length === 0) {
    return [];
  }
  return array[0].map((col, i) => array.map(row => row[i]));
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

assert([[0], [1]], rot45([[0], [1]]));
assert([[0], [1], [2]], rot45([[0], [1], [2]]));
assert([[1], [0]], rot45([[0, 1]]));
assert([[2], [1], [0]], rot45([[0, 1, 2]]));
