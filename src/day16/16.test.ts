import { q1, q2, parseInput, hexToBinary } from "./";

describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(hexToBinary("8A004A801A8002F478"))).toBe(16);
    expect(q1(hexToBinary("620080001611562C8802118E34"))).toBe(12);
    // expect(q1(hexToBinary("C0015000016115A2E0802F182340"))).toBe(23);
    // expect(q1(hexToBinary("A0016C880162017C3686B18A3D4780"))).toBe(31);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    // expect(q2(parsed)).toBe();
  });
});
