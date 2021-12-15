import { q1, q2, parseInput } from "./";

const data = [
  "2199943210",
  "3987894921",
  "9856789892",
  "8767896789",
  "9899965678",
];
const parsed = parseInput(data);

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(15);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(parsed)).toBe(1134);
  });
});
