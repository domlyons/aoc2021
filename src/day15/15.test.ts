import { q1, q2, parseInput } from "./";

const data = [
  "1163751742",
  "1381373672",
  "2136511328",
  "3694931569",
  "7463417111",
  "1319128137",
  "1359912421",
  "3125421639",
  "1293138521",
  "2311944581",
];
const parsed = parseInput(data);

describe.only("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(40);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    q2(parsed);
  });
});
