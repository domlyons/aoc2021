import { q1, q2 } from "./";

const data = [3, 4, 3, 1, 2];

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(data)).toBe(5934);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(data)).toBe(26984457539);
  });
});
