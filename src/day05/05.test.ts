import { q1, parseInput, q2 } from "./";

const input: string[] = [
  "0,9 -> 5,9",
  "8,0 -> 0,8",
  "9,4 -> 3,4",
  "2,2 -> 2,1",
  "7,0 -> 7,4",
  "6,4 -> 2,0",
  "0,9 -> 2,9",
  "3,4 -> 1,4",
  "0,0 -> 8,8",
  "5,5 -> 8,2",
];
const parsedInput = parseInput(input);
describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsedInput)).toBe(5);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(parsedInput)).toBe(12);
  });
});
