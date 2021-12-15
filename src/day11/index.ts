import { readFile } from "fs/promises";
import { resolve } from "path";
import chalk from "chalk";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Grid = number[][];

const printGrid = (grid: Grid) => {
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    console.log(
      ...row.map((curr) => (curr === 0 ? chalk.green(`0`) : `${curr}`))
    );
  }
  console.log();
};

const step = (grid: Grid): Grid => {
  const increased = grid.map((row) => row.map((cell) => cell + 1));

  let flashed: [number, number][] = [];
  let lastIterFlashed = 0;
  do {
    lastIterFlashed = flashed.length;
    for (let i = 0; i < increased.length; i++) {
      for (let j = 0; j < increased[0].length; j++) {
        if (
          increased[i][j] <= 9 ||
          !!flashed.find(([iF, jF]) => iF === i && jF === j)
        ) {
          continue;
        }

        const adjacent = [
          [i, j + 1],
          [i, j - 1],
          [i + 1, j],
          [i - 1, j],
          [i + 1, j + 1],
          [i + 1, j - 1],
          [i - 1, j + 1],
          [i - 1, j - 1],
        ].filter(([i, j]) => increased[i]?.[j] !== undefined);

        adjacent.forEach(([iF, jF]) => {
          increased[iF][jF] += 1;
        });
        flashed.push([i, j]);
      }
    }
  } while (lastIterFlashed !== flashed.length);

  return increased.map((row) => row.map((cell) => (cell > 9 ? 0 : cell)));
};

export const q1 = (grid: Grid) => {
  let flashes: number = 0;
  let newGrid = grid.map((row) => [...row]);
  for (let i = 0; i < 100; i++) {
    newGrid = step(newGrid);
    newGrid.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 0) {
          flashes += 1;
        }
      });
    });
  }

  return flashes;
};

export const q2 = (grid: Grid) => {
  let stepNumber = 0;
  let newGrid = grid.map((row) => [...row]);
  while (!newGrid.every((row) => row.every((cell) => cell === 0))) {
    stepNumber += 1;
    newGrid = step(newGrid);
  }

  return stepNumber;
};

export const parseInput = (data: string[]): Grid => {
  return data.map((row) => {
    const intArray = row.split("");
    return intArray.map((i) => parseInt(i, 10));
  });
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);

  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
