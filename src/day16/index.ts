import { readFile } from "fs/promises";
import { resolve } from "path";
import chalk from "chalk";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Input = string;

const binToInt = (bin: string): number => {
  return parseInt(bin, 2);
};

export const hexToBinary = (hex: string): string => {
  const array = hex.split("");

  return array
    .map((h) => parseInt(h, 16).toString(2).padStart(4, "0"))
    .join()
    .replaceAll(",", "");
};

const parseLiteral = (
  binaryString: string
): { value: number; remainingString: string } => {
  let bit;

  let str = "";
  let index = 6;

  while (bit !== "0") {
    const group = binaryString.slice(index, index + 5);
    bit = group.slice(0, 1);
    str += group.slice(1);
    index += 5;
  }

  return { value: binToInt(str), remainingString: binaryString.slice(index) };
};

type ParseBinaryType = {
  value?: number;
  typeId: number;
  version: number;
};

export const parseBinary = (binaryString: string): ParseBinaryType[] => {
  const version = binToInt(binaryString.slice(0, 3));
  const typeId = binToInt(binaryString.slice(3, 6));

  if (typeId === 4) {
    const { remainingString, value } = parseLiteral(binaryString);
    if (!remainingString) {
      return [{ value, typeId, version }];
    }

    return [{ value, typeId, version }, ...parseBinary(remainingString)];
  }

  const lengthBit = binaryString[6];

  const startOfLength = 7;
  if (lengthBit === "0") {
    const endOfLength = startOfLength + 15;
    const subPacketLength = binToInt(
      binaryString.slice(startOfLength, endOfLength)
    );
    const subPacket = binaryString.slice(
      endOfLength,
      endOfLength + subPacketLength
    );
    return [{ typeId, version }, ...parseBinary(subPacket)];
  }

  if (lengthBit === "1") {
    const endOfLength = startOfLength + 11;
    const subPacketNumber = binToInt(
      binaryString.slice(startOfLength, endOfLength)
    );

    let subPacketString = binaryString.slice(endOfLength);

    while (subPacketString.endsWith("0")) {
      subPacketString = subPacketString.slice(0, -1);
    }

    const stringLength = subPacketString.length / subPacketNumber;
    let strings: string[] = [];
    for (let i = 0; i < subPacketNumber; i++) {
      strings.push(
        subPacketString.slice(i * stringLength, (i + 1) * stringLength)
      );
    }

    return [{ typeId, version }, ...strings.map((s) => parseBinary(s)).flat()];
    //
    // subPacketString.slice();
    // const test = subPacketString.length % subPacketNumber;
  }

  throw new Error("unknown length bit");
};

export const q1 = (data: Input) => {
  const binary = parseBinary(data);

  return binary.reduce((acc, curr) => acc + curr.version, 0);
};

export const q2 = (data: Input) => {};

export const parseInput = (data: string[]) => {
  return hexToBinary(data[0]);
};

const main = async () => {
  // const data = await getArrayFromNewLine();
  // const data = ["D2FE28"];
  // const data = ["8A004A801A8002F478"];
  const data = ["620080001611562C8802118E34"];

  const parsed = parseInput(data);
  console.log(q1(parsed));
  // console.log(q2(parsed));
};

main();
