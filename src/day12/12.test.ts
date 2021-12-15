import { q1, q2, parseInput } from "./";

const smallest = ["start-A", "start-b", "A-c", "A-b", "b-d", "A-end", "b-end"];
const smallestParsed = parseInput(smallest);

const larger = [
  "dc-end",
  "HN-start",
  "start-kj",
  "dc-start",
  "dc-HN",
  "LN-dc",
  "HN-end",
  "kj-sa",
  "kj-HN",
  "kj-dc",
];
const largerParsed = parseInput(larger);

const largest = [
  "fs-end",
  "he-DX",
  "fs-he",
  "start-DX",
  "pj-DX",
  "end-zg",
  "zg-sl",
  "zg-pj",
  "pj-he",
  "RW-he",
  "fs-DX",
  "pj-RW",
  "zg-RW",
  "start-pj",
  "he-WI",
  "zg-he",
  "pj-fs",
  "start-RW",
];
const largestParsed = parseInput(largest);

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(smallestParsed)).toBe(10);
    expect(q1(largerParsed)).toBe(19);
    expect(q1(largestParsed)).toBe(226);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(smallestParsed)).toBe(36);
    expect(q2(largerParsed)).toBe(103);
    expect(q2(largestParsed)).toBe(3509);
  });
});
