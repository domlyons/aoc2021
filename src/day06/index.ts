import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromComma = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split(",");

  return array.filter((a) => !!a);
};

type Fish = number;

const newFish: Fish = 8;

type Store = number[];
const initialStore: Store = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const iterateStore = (store: Store): Store => {
  const [newFishNum, ...rest] = store;

  let newStore = [...rest, newFishNum];
  newStore[6] += newFishNum;
  return newStore;
};

const iterateForDays = (store: Store, days: number): Store => {
  let day = 1;
  let newStore = store;
  do {
    newStore = iterateStore(newStore);
    day++;
  } while (day < days + 1);

  return newStore;
};

export const q1 = (data: number[]) => {
  const store = [...initialStore];
  data.forEach((x) => {
    store[x]++;
  });

  return iterateForDays(store, 80).reduce((acc, curr) => acc + curr, 0);
};

export const q2 = (data: number[]) => {
  const store = [...initialStore];
  data.forEach((x) => {
    store[x]++;
  });

  return iterateForDays(store, 256).reduce((acc, curr) => acc + curr, 0);
};

export const parseInput = (data: string[]): number[] => {
  return data.map((d) => parseInt(d, 10));
};

const main = async () => {
  const data = await getArrayFromComma();
  const parsed = parseInput(data);

  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
