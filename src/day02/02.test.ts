import { q1, q2 } from "./index";

describe("q1", () => {
  it("will work", () => {
    const data = [
      "forward 5",
      "down 5",
      "forward 8",
      "up 3",
      "down 8",
      "forward 2",
    ];
    expect(q1(data)).toBe(150);
  });
});

describe.only("q2", () => {
  it("will work", () => {
    const data = [
      "forward 5",
      "down 5",
      "forward 8",
      "up 3",
      "down 8",
      "forward 2",
    ];
    expect(q2(data)).toBe(900);
  });
});
