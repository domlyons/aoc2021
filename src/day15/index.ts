import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};
type Data = number[][];

export const q1 = (data: Data) => {
  console.log(data);
};

export const q2 = (data: Data) => {};

export const parseInput = (data: string[]): Data => {
  return data.map((r) => r.split("").map((cell) => parseInt(cell, 10)));
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

// main();
