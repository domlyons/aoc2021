import { readFile } from "fs/promises";
import { resolve } from "path";
import chalk from "chalk";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};
type Grid = number[][];
type Position = [number, number];

type G<T> = {
  priority: number;
} & T;

export type Heap<T> = G<T>[];

const getParentIndex = (i: number): number => Math.floor((i - 1) / 2);
const getLeftIndex = (i: number): number => 2 * i + 1;
const getRightIndex = (i: number): number => 2 * i + 2;

export const getLeft = <T>(heap: Heap<T>, i: number): G<T> =>
  heap[getLeftIndex(i)];
export const getRight = <T>(heap: Heap<T>, i: number): G<T> =>
  heap[getRightIndex(i)];
export const getParent = <T>(heap: Heap<T>, i: number): G<T> =>
  heap[getParentIndex(i)];

export const extractMin = <G>(heap: Heap<G>): [G, Heap<G>] => {
  const newHeap = [...heap];

  if (heap.length === 0) {
    throw new Error("cannot extract empty heap");
  }

  if (newHeap.length === 1) {
    return [newHeap[0], []];
  }

  const value = newHeap.shift()!;
  newHeap.unshift(newHeap.pop()!);

  return [value, maxHeapify(newHeap, 0)];
};

const maxHeapify = <T>(heap: Heap<T>, index: number): Heap<T> => {
  const left = getLeftIndex(index);
  const right = getRightIndex(index);
  let smallest = index;
  if (left < heap.length && heap[left].priority < heap[index].priority) {
    smallest = left;
  }
  if (right < heap.length && heap[right].priority < heap[smallest].priority) {
    smallest = right;
  }
  if (smallest !== index) {
    let temp = heap[index];
    heap[index] = heap[smallest];
    heap[smallest] = temp;

    return maxHeapify(heap, smallest);
  }

  return heap;
};

export const insert = <T>(heap: Heap<T>, insert: G<T>): Heap<T> => {
  const newHeap: Heap<T> = [...heap, insert];

  let index = newHeap.length - 1;
  while (
    index !== 0 &&
    newHeap[index].priority < getParent(newHeap, index).priority
  ) {
    const parentIndex = getParentIndex(index);
    let temp = newHeap[index];
    newHeap[index] = getParent(newHeap, index);
    newHeap[parentIndex] = temp;
    index = parentIndex;
  }

  return newHeap;
};

const printGrid = (grid: Grid, path: Position[]) => {
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    console.log(
      ...row.map((curr, j) => {
        if (i === 0 && j === 0) {
          return chalk.blue(curr);
        }
        if (i === maxY && j === maxX) {
          return chalk.red(curr);
        }
        if (!!path.find(([y, x]) => y === i && j === x)) {
          return chalk.green(curr);
        }
        return `${curr}`;
      })
    );
  }
  console.log();
};

const getNeighbours = (position: Position, grid: Grid): Position[] => {
  const maxY = grid.length;
  const maxX = grid[0].length;

  const [y, x] = position;

  return [
    [y + 1, x] as Position,
    [y - 1, x] as Position,
    [y, x + 1] as Position,
    [y, x - 1] as Position,
  ].filter(([y, x]) => y < maxY && x < maxX && y >= 0 && x >= 0);
};

const getPath = (grid: Grid): Position[] => {
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  const goal: Position = [grid.length - 1, grid[0].length - 1];
  let heap: Heap<{ position: Position }> = [];

  const cameFrom: { [y: number]: { [x: number]: Position } } = {};
  const costSoFar: { [y: number]: { [x: number]: number } } = {};

  grid.forEach((_, i) => {
    cameFrom[i] = {};
  });

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!costSoFar[i]) {
        costSoFar[i] = {};
      }
      if (i === 0 && j === 0) {
        costSoFar[i][j] = 0;
      } else {
        costSoFar[i][j] = Infinity;
      }
    }
  }
  heap = insert(heap, { priority: 0, position: [0, 0] });

  while (heap.length > 0) {
    const [current, newHeap] = extractMin(heap);
    heap = newHeap;
    const [currentY, currentX] = current.position;

    if (currentY === goal[0] && currentX === goal[1]) {
      continue;
    }

    const neighbours = getNeighbours(current.position, grid);

    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const [y, x] = neighbour;

      const newCost = costSoFar[currentY][currentX] + grid[y][x];

      if (newCost < costSoFar[y][x]) {
        costSoFar[y][x] = newCost;
        cameFrom[y][x] = [currentY, currentX];

        // const heuristic = Math.abs(x - maxX) + Math.abs(y - maxY);

        heap = insert(heap, {
          position: [y, x],
          priority: newCost,
        });
      }
    }
  }

  const path: Position[] = [];

  let current: Position = [maxY, maxX];
  while (!(current[0] === 0 && current[1] === 0)) {
    path.push(current);
    current = cameFrom[current[0]][current[1]];
  }

  path.push([0, 0]);

  path.reverse();
  return path;
};

export const q1 = (grid: Grid) => {
  const path = getPath(grid);
  // printGrid(grid, path);
  return (
    path.reduce((acc, curr) => acc + grid[curr[0]][curr[1]], 0) - grid[0][0]
  );
};

export const q2 = (grid: Grid) => {
  const expandedGrid: Grid = [];

  for (let j = 0; j < 5; j++) {
    for (let y = 0; y < grid.length; y++) {
      const row = [];
      for (let i = 0; i < 5; i++) {
        for (let x = 0; x < grid.length; x++) {
          const newValue = (grid[y][x] + i + j) % 9;
          row.push(newValue === 0 ? 9 : newValue);
        }
      }
      expandedGrid.push(row);
    }
  }

  const path = getPath(expandedGrid);
  // printGrid(expandedGrid, path);

  return (
    path.reduce((acc, curr) => acc + expandedGrid[curr[0]][curr[1]], 0) -
    expandedGrid[0][0]
  );
};

export const parseInput = (data: string[]): Grid => {
  return data.map((r) => r.split("").map((cell) => parseInt(cell, 10)));
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
