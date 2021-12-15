import { q1, q2, parseInput } from "./";

const data = [
  "NNCB",
  "",
  "CH -> B",
  "HH -> N",
  "CB -> H",
  "NH -> C",
  "HB -> C",
  "HC -> B",
  "HN -> C",
  "NN -> C",
  "BH -> H",
  "NC -> B",
  "NB -> B",
  "BN -> B",
  "BB -> N",
  "BC -> B",
  "CC -> N",
  "CN -> C",
];
const parsed = parseInput(data);

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(1588);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(parsed)).toBe(2188189693529);
  });
});
