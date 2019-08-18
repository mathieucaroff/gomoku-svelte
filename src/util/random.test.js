import { randchoice, randint } from "./random";

test("randint", () => {
  expect(randint(0, 10)).toBe(0);
  expect(randint(0.5, 10)).toBe(5);
});

test("randchoice", () => {
  expect(randchoice(0, [0, 1, 2])).toBe(0);
  expect(randchoice(0.5, [0, 10, 20, 30])).toBe(20);
  expect(randchoice(0.75, [0, 10, 20, 30])).toBe(30);
});
