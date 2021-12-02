import { q2 } from "./index";

describe("q2", () => {
  it("will work", () => {
    const data = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];
    expect(q2(data)).toBe(5);
  });
});
