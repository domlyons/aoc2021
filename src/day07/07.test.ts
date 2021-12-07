import { q1, q2 } from "./";

const data = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];
describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(data)).toBe(37);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(data)).toBe(168);
  });
});
