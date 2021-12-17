import { q1, q2, parseInput, insert, Heap, extractMin } from "./";

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

const mapToHeap = (a: number[]) =>
  a.map((priority) => ({
    priority,
  }));
describe("heap", () => {
  it("will work", () => {
    const firstHeap: Heap<{}> = mapToHeap([
      5, 14, 23, 32, 41, 87, 90, 50, 64, 53,
    ]);
    const second = insert(firstHeap, { priority: 43 });
    expect(second).toEqual(
      mapToHeap([5, 14, 23, 32, 41, 87, 90, 50, 64, 53, 43])
    );
    const third = insert(second, { priority: 18 });
    expect(third).toEqual(
      mapToHeap([5, 14, 18, 32, 41, 23, 90, 50, 64, 53, 43, 87])
    );
    const fourth = insert(third, { priority: 2 });
    expect(fourth).toEqual(
      mapToHeap([2, 14, 5, 32, 41, 18, 90, 50, 64, 53, 43, 87, 23])
    );

    const heap: Heap<{ priority: number }> = mapToHeap([
      10, 15, 30, 40, 50, 100, 40,
    ]);
    const [extract, newHeap] = extractMin(heap);
    expect(extract.priority).toEqual(10);
    expect(newHeap.map((p) => p.priority)).toEqual([15, 40, 30, 40, 50, 100]);
  });
});
describe("q1", () => {
  it("will work out q1", () => {
    expect(q1(parsed)).toBe(40);
  });
});

describe("q2", () => {
  it("will work out q2", () => {
    expect(q2(parsed)).toBe(315);
  });
});
