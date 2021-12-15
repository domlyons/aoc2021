import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Input = {
  positions: Position[];
  folds: Fold[];
};

type FoldDirection = "x" | "y";

type Position = [number, number];
type Fold = [FoldDirection, number];

const printGrid = (positions: Position[]) => {
  let maxX: number = 0;
  let maxY: number = 0;

  let string: string = "";

  positions.forEach(([x, y]) => {
    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
  });

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (positions.find((p) => p[0] === x && p[1] === y)) {
        string += "#";
      } else {
        // change this to space for better printing
        string += ".";
      }
    }
    string += "\n";
  }

  console.log(string);
  console.log();
};

const doFold = (positions: Position[], [direction, foldPos]: Fold) => {
  let newPositions: Position[] = [];
  let positionsToKeep: Position[] = [];

  if (direction === "y") {
    positionsToKeep = positions.filter((p) => p[1] < foldPos);
    const belowLine = positions.filter((p) => p[1] > foldPos);
    newPositions = belowLine.map((p) => [p[0], foldPos - (p[1] - foldPos)]);
  } else if (direction === "x") {
    positionsToKeep = positions.filter((p) => p[0] < foldPos);
    const rightOfLine = positions.filter((p) => p[0] > foldPos);
    newPositions = rightOfLine.map((p) => [foldPos - (p[0] - foldPos), p[1]]);
  }
  return [...positionsToKeep, ...newPositions].filter(
    (x, i, self) => self.findIndex((s) => s[0] === x[0] && s[1] === x[1]) === i
  );
};

export const q1 = ({ positions, folds }: Input) => {
  const firstFold = doFold(positions, folds[0]);

  return firstFold.length;
};

export const q2 = ({ positions, folds }: Input) => {
  const finalGrid = folds.reduce((acc, curr) => doFold(acc, curr), positions);
  printGrid(finalGrid);
};

export const parseInput = (data: string[]): Input => {
  const positions: Position[] = data
    .filter((r) => !!r && !r.includes("fold"))
    .map((r) => {
      const [x, y] = r.split(",");
      return [parseInt(x, 10), parseInt(y, 10)];
    });

  const folds: Fold[] = data
    .filter((r) => !!r && r.includes("fold"))
    .map((f) => {
      const [direction, num] = f.replaceAll("fold along", "").split("=");

      return [direction.trim() as FoldDirection, parseInt(num, 10)];
    });

  return {
    positions,
    folds,
  };
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
