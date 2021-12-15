import { q1, q2, parseInput } from "./";

const data = [
  "5483143223",
  "2745854711",
  "5264556173",
  "6141336146",
  "6357385478",
  "4167524645",
  "2176841721",
  "6882881134",
  "4846848554",
  "5283751526",
];
const parsed = parseInput(data);

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(1656);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(parsed)).toBe(195);
  });
});
