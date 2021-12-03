import { q1, getGamma, q2, getCO2, getEpsilon, getOxygen } from "./";

describe("q1", () => {
  const input = [
    "00100",
    "11110",
    "10110",
    "10111",
    "10101",
    "01111",
    "00111",
    "11100",
    "10000",
    "11001",
    "00010",
    "01010",
  ];
  it("will work out gamma", () => {
    expect(getGamma(input)).toBe(22);
  });
  it("will work out epsilon", () => {
    expect(getEpsilon(input)).toBe(9);
  });

  it("will work out q1", () => {
    expect(q1(input)).toBe(198);
  });
});

describe("q2", () => {
  const input = [
    "00100",
    "11110",
    "10110",
    "10111",
    "10101",
    "01111",
    "00111",
    "11100",
    "10000",
    "11001",
    "00010",
    "01010",
  ];

  it("getOxygen", () => {
    expect(getOxygen(input)).toBe(23);
  });
  it("getC02", () => {
    expect(getCO2(input)).toBe(10);
  });
  it("will work out q2", () => {
    expect(q2(input)).toBe(230);
  });
});
