import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Direction = "forward" | "down" | "up";

const parseData = (
  d: string[]
): { direction: Direction; distance: number }[] => {
  return d.map((d) => {
    const splitArray = d.split(" ");
    return {
      direction: splitArray[0] as Direction,
      distance: parseInt(splitArray[1], 10),
    };
  });
};
type Position = { x: number; depth: number };

export const q1 = (data: string[]) => {
  const parsed = parseData(data);

  const position: Position = { x: 0, depth: 0 };

  const finalPos: Position = parsed.reduce((currentPos, diff) => {
    if (diff.direction === "forward") {
      return {
        ...currentPos,
        x: currentPos.x + diff.distance,
      };
    }
    if (diff.direction === "down") {
      return {
        ...currentPos,
        depth: currentPos.depth + diff.distance,
      };
    }
    if (diff.direction === "up") {
      return {
        ...currentPos,
        depth: currentPos.depth - diff.distance,
      };
    }
    throw new Error("invalid direction");
  }, position);

  console.log(finalPos);

  return finalPos.depth * finalPos.x;
};

type Sub = {
  aim: number;
};
export const q2 = (data: string[]) => {
  const parsed = parseData(data);

  const sub: Position & Sub = { x: 0, depth: 0, aim: 0 };

  const finalPos: Position & Sub = parsed.reduce((currentPos, diff) => {
    if (diff.direction === "forward") {
      return {
        ...currentPos,
        x: currentPos.x + diff.distance,
        depth: currentPos.depth + currentPos.aim * diff.distance,
      };
    }
    if (diff.direction === "down") {
      return {
        ...currentPos,
        aim: currentPos.aim + diff.distance,
      };
    }
    if (diff.direction === "up") {
      return {
        ...currentPos,
        aim: currentPos.aim - diff.distance,
      };
    }
    throw new Error("invalid direction");
  }, sub);

  console.log(finalPos);

  return finalPos.depth * finalPos.x;
};

const answers = async () => {
  const data = await getArrayFromNewLine();

  // console.log(q1(data));
  console.log(q2(data));
};

answers();
