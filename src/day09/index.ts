import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Position = [number, number];
type HeightMap = number[][];

const getLowPoints = (data: HeightMap): Position[] => {
  let lowPoints: Position[] = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      const point = data[i][j];
      const otherPoints = [
        data[i + 1]?.[j],
        data[i - 1]?.[j],
        data[i][j + 1],
        data[i][j - 1],
      ].filter((f) => f !== undefined);
      if (otherPoints.every((p) => p > point)) {
        lowPoints.push([i, j]);
      }
    }
  }
  return lowPoints;
};

export const q1 = (data: HeightMap) => {
  const lowPoints = getLowPoints(data);
  return lowPoints.reduce((acc, pos) => acc + data[pos[0]][pos[1]] + 1, 0);
};

const explore = (data: HeightMap, basinPoints: Position[]): Position[] => {
  const newBasinPoints: Position[] = basinPoints
    .map((p) => {
      const i = p[0];
      const j = p[1];
      const newPoints: Position[] = [
        [i + 1, j],
        [i - 1, j],
        [i, j + 1],
        [i, j - 1],
      ]
        .filter(
          (p) =>
            p[0] < data.length &&
            p[0] >= 0 &&
            p[1] < data[0].length &&
            p[1] >= 0
        )
        .filter(
          (newPoint) =>
            !basinPoints.find(
              (bP) => bP[0] === newPoint[0] && bP[1] === newPoint[1]
            )
        )
        .filter(
          (newPoint) =>
            data[newPoint[0]][newPoint[1]] > data[p[0]][p[1]] &&
            data[newPoint[0]][newPoint[1]] !== 9
        ) as Position[];

      return [p, ...newPoints];
    })
    .flat()
    .filter(
      (x, i, self) =>
        self.findIndex((s) => s[0] === x[0] && s[1] === x[1]) === i
    );

  if (newBasinPoints.length > basinPoints.length) {
    return explore(data, newBasinPoints);
  }

  return newBasinPoints;
};

export const q2 = (data: HeightMap) => {
  const lowPoints = getLowPoints(data);
  // const test = explore(data, [lowPoints[2]]);
  const basins = lowPoints.map((p) => explore(data, [p]));

  const sorted = [...basins].sort((a, b) => b.length - a.length);

  return sorted[0].length * sorted[1].length * sorted[2].length;
};

export const parseInput = (data: string[]): HeightMap => {
  return data.map((row) => row.split("").map((p) => parseInt(p, 10)));
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
