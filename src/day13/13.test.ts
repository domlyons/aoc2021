import { q1, q2, parseInput } from "./";

const data = [
  "6,10",
  "0,14",
  "9,10",
  "0,3",
  "10,4",
  "4,11",
  "6,0",
  "6,12",
  "4,1",
  "0,13",
  "10,12",
  "3,4",
  "3,0",
  "8,4",
  "1,10",
  "2,14",
  "8,10",
  "9,0",
  "",
  "fold along y=7",
  "fold along x=5",
];
const parsed = parseInput(data);

describe.only("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(17);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    q2(parsed);
  });
});
