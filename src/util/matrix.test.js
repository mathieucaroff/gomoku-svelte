import { around8, transpose, rot45, surrounding8 } from "./matrix";

test("transpose", () => {
  expect(transpose([[0, 1]])).toEqual([[0], [1]]);
  expect(transpose([[0], [1]])).toEqual([[0, 1]]);
});

test("rot45", () => {
  expect(rot45([[0], [1]])).toEqual([[0], [1]]);
  expect(rot45([[0, 1]])).toEqual([[1], [0]]);
  expect(rot45([[0], [1], [2]])).toEqual([[0], [1], [2]]);
  expect(rot45([[0, 1, 2]])).toEqual([[2], [1], [0]]);
});

test("around8", () => {
  expect(around8[0]).toEqual([-1, -1]);
  expect(around8[7]).toEqual([1, 1]);
});

test("surrounding8", () => {
  expect(surrounding8([0, 0])[0]).toEqual([-1, -1]);
  expect(surrounding8([2, 3])[7]).toEqual([3, 4]);
});
