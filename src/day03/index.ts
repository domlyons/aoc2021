import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Bit = 1 | 0;
type Binary = Bit[];

const isBit = function (b: number): b is Bit {
  return b === 1 || b === 0;
};

const stringArrayToBinary = (splitStr: string[]): Binary => {
  if (splitStr.find((c) => c !== "0" && c !== "1")) {
    throw new Error("invalid string");
  }

  const binary = splitStr.map((s) => parseInt(s, 10));

  binary.forEach((b) => {
    if (!isBit(b)) {
      throw new Error(`${b} is not a bit`);
    }
  });

  return binary.filter(isBit);
};

const binaryToDecimal = (binary: Binary) => {
  return binary.reduceRight((acc, curr, i, self) => {
    const power = self.length - 1 - i;
    return acc + curr * 2 ** power;
  }, 0 as number);
};

export const getGamma = (data: string[]) => {
  const split = data.map((d) => d.split(""));
  const dataNumber = data[0].length;

  const mostCommonData: string[] = [];

  for (let i = 0; i < dataNumber; i++) {
    const frequency: { [x: string]: number } = {};
    split.forEach((s) => {
      if (frequency[s[i]]) {
        frequency[s[i]]++;
      } else {
        frequency[s[i]] = 1;
      }
    });
    let mostCommon: string = "0";
    let mostAmount = 0;
    Object.entries(frequency).forEach(([bit, amount]) => {
      if (amount > mostAmount) {
        mostAmount = amount;
        mostCommon = bit;
      }
    });
    mostCommonData.push(mostCommon);
  }

  return binaryToDecimal(stringArrayToBinary(mostCommonData));
};
export const getEpsilon = (data: string[]) => {
  const split = data.map((d) => d.split(""));
  const dataNumber = data[0].length;

  const leastCommonData: string[] = [];

  for (let i = 0; i < dataNumber; i++) {
    const frequency: { [x: string]: number } = {};
    split.forEach((s) => {
      if (frequency[s[i]]) {
        frequency[s[i]]++;
      } else {
        frequency[s[i]] = 1;
      }
    });
    let leastCommon: string = "0";
    let mostAmount = Infinity;
    Object.entries(frequency).forEach(([bit, amount]) => {
      if (amount < mostAmount) {
        mostAmount = amount;
        leastCommon = bit;
      }
    });
    leastCommonData.push(leastCommon);
  }

  return binaryToDecimal(stringArrayToBinary(leastCommonData));
};

export const getOxygen = (data: string[]) => {
  const split = data.map((d) => d.split(""));
  const dataNumber = data[0].length;

  let arraysToTry: string[][] = split;

  for (let i = 0; i < dataNumber; i++) {
    if (arraysToTry.length === 1) {
      break;
    }
    const frequency: { [x: string]: number } = {};
    arraysToTry.forEach((s) => {
      if (frequency[s[i]]) {
        frequency[s[i]]++;
      } else {
        frequency[s[i]] = 1;
      }
    });
    let mostCommon: string = frequency["1"] >= frequency["0"] ? "1" : "0";

    arraysToTry = arraysToTry.filter((a) => a[i] === mostCommon);
  }
  const value = arraysToTry[0];

  return binaryToDecimal(stringArrayToBinary(value));
};

export const getCO2 = (data: string[]) => {
  const split = data.map((d) => d.split(""));
  const dataNumber = data[0].length;

  let arraysToTry: string[][] = split;

  for (let i = 0; i < dataNumber; i++) {
    if (arraysToTry.length === 1) {
      break;
    }
    const frequency: { [x: string]: number } = {};
    arraysToTry.forEach((s) => {
      if (frequency[s[i]]) {
        frequency[s[i]]++;
      } else {
        frequency[s[i]] = 1;
      }
    });
    let leastCommon: string = frequency["0"] <= frequency["1"] ? "0" : "1";

    arraysToTry = arraysToTry.filter((a) => a[i] === leastCommon);
  }
  const value = arraysToTry[0];

  return binaryToDecimal(stringArrayToBinary(value));
};

export const q1 = (data: string[]) => {
  const gamma = getGamma(data);
  const epsilon = getEpsilon(data);

  return gamma * epsilon;
};

export const q2 = (data: string[]) => {
  const cO2 = getCO2(data);
  const oxygen = getOxygen(data);

  return cO2 * oxygen;
};

const main = async () => {
  const data = await getArrayFromNewLine();
  console.log(q1(data));
  console.log(q2(data));
};

main();
