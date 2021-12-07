import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromComma = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split(",");

  return array.filter((a) => !!a);
};

type Crabs = number[];

const distance = (position: number, crabs: Crabs) => {
  return crabs.reduce((acc, curr) => acc + Math.abs(curr - position), 0);
};

export const q1 = (crabs: Crabs) => {
  const sortedArray = [...crabs].sort((a, b) => a - b);
  return distance(sortedArray[Math.floor(sortedArray.length / 2)], crabs);

  // I think you have to do this? Because if it is even length array then
  // there are two possible values
  // I think you may not have to do this as i can't find any counterpoints

  // if (sortedArray.length % 2 !== 0) {
  // return distance(sortedArray[Math.floor(sortedArray.length / 2)], crabs);
  // }
  // const n1 = sortedArray[Math.floor(sortedArray.length / 2)];
  // const n1Dist = distance(n1, crabs);

  // const n2 = sortedArray[Math.ceil(sortedArray.length / 2)];
  // const n2Dist = distance(n2, crabs);
  // console.log(n1Dist, n2Dist);

  // return n1Dist < n2Dist ? n1Dist : n2Dist;
};

const arithmaticSeries = (n: number) => {
  return (n * (n + 1)) / 2;
};

const distanceQ2 = (position: number, crabs: Crabs) => {
  return crabs.reduce(
    (acc, curr) => acc + arithmaticSeries(Math.abs(curr - position)),
    0
  );
};

export const q2 = (crabs: Crabs) => {
  const sortedArray = [...crabs].sort((a, b) => a - b);
  const min = sortedArray[0];
  const max = sortedArray[sortedArray.length - 1];

  let minFuel = Infinity;

  for (let i = min; i <= max; i++) {
    const dist = distanceQ2(i, sortedArray);
    if (dist < minFuel) {
      minFuel = dist;
    }
  }

  return minFuel;
};

type Position = number;

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
