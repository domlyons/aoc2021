import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<number[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.map((a) => parseInt(a, 10));
};

export const q1 = (data: number[]) => {
  let increases = 0;

  data.forEach((current, i, self) => {
    if (i === 0) {
      return;
    }
    const previous = self[i - 1];

    if (previous < current) {
      increases++;
    }
  });

  return increases;
};

export const q2 = (data: number[]) => {
  let increases = 0;

  data.forEach((current, i, self) => {
    if (i < 2) {
      return;
    }
    const previous = self[i - 1];
    const previous2 = self[i - 2];
    const previous3 = self[i - 3];

    const firstGroup = previous3 + previous2 + previous;
    const secondGroup = previous2 + previous + current;
    if (firstGroup < secondGroup) {
      increases++;
    }
  });

  return increases;
};

const answers = async () => {
  const data = await getArrayFromNewLine();

  console.log(q1(data));
  console.log(q2(data));
};

answers();
