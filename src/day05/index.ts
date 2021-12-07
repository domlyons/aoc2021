import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Coord = [number, number];
type Line = [Coord, Coord];

const isStraightLine = (line: Line): boolean => {
  const [p1, p2] = line;
  return p1[0] === p2[0] || p1[1] === p2[1];
};

const coordsFromLine = (line: Line): Coord[] => {
  const [p1, p2] = line;
  let coords: Coord[] = [];

  // vertical line
  if (p1[0] === p2[0]) {
    let largest = p1[1] < p2[1] ? p2[1] : p1[1];
    let smallest = p1[1] > p2[1] ? p2[1] : p1[1];

    for (let i = smallest; i <= largest; i++) {
      coords.push([p1[0], i]);
    }
    return coords;
  }

  // horizontal line
  if (p1[1] === p2[1]) {
    let largest = p1[0] < p2[0] ? p2[0] : p1[0];
    let smallest = p1[0] > p2[0] ? p2[0] : p1[0];

    for (let i = smallest; i <= largest; i++) {
      coords.push([i, p1[1]]);
    }
    return coords;
  }

  // diagonal line
  let [smallestX, largestX] = p1[0] < p2[0] ? [p1[0], p2[0]] : [p2[0], p1[0]];
  let [smallestY, largestY] = p1[1] < p2[1] ? [p1[1], p2[1]] : [p2[1], p1[1]];
  const isXIncreasing = p1[0] < p2[0];
  const isYIncreasing = p1[1] < p2[1];

  let x = p1[0];
  let y = p1[1];

  do {
    coords.push([x, y]);

    isXIncreasing ? x++ : x--;
    isYIncreasing ? y++ : y--;
  } while (x !== p2[0] && y !== p2[1]);

  coords.push(p2);

  return coords;
};

export const q1 = (lines: Line[]) => {
  const straightLines = lines.filter(isStraightLine);
  const coords = straightLines.map(coordsFromLine).flat();

  const obj: { [x: string]: number } = {};
  coords.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (obj[key]) {
      obj[key] += 1;
    } else {
      obj[key] = 1;
    }
  });

  return Object.values(obj).filter((o) => o > 1).length;
};

export const q2 = (lines: Line[]) => {
  const coords = lines.map(coordsFromLine).flat();

  const obj: { [x: string]: number } = {};
  coords.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (obj[key]) {
      obj[key] += 1;
    } else {
      obj[key] = 1;
    }
  });

  return Object.values(obj).filter((o) => o > 1).length;
};

export const parseInput = (data: string[]): Line[] => {
  return data.map((d) => {
    const coordStr = d.split("->").map((str) => str.trim());

    const parsedCoords: Line = coordStr.map((c) =>
      c.split(",").map((str) => parseInt(str, 10))
    ) as Line;

    return parsedCoords;
  });
};

const main = async () => {
  const data = await getArrayFromNewLine();
  const parsedData = parseInput(data);
  console.log(q1(parsedData));
  console.log(q2(parsedData));
};

main();
