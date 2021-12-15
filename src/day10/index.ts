import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type OpeningChar = "(" | "[" | "{" | "<";
type ClosingChar = ")" | "]" | "}" | ">";
type Char = OpeningChar | ClosingChar;

const allChars = ["(", "[", "{", "<", ")", "]", "}", ">"];

type Line = Char[];

function isOpeningChar(str: string): str is OpeningChar {
  return "(<{[".includes(str);
}
function isClosingChar(str: string): str is ClosingChar {
  return ")>}]".includes(str);
}
function isChar(str: string): str is Char {
  const char = isOpeningChar(str) || isClosingChar(str);

  if (!char) {
    throw new Error(`invalid char ${str}`);
  }
  return char;
}

const closeToOpen: Record<ClosingChar, OpeningChar> = {
  ")": "(",
  ">": "<",
  "}": "{",
  "]": "[",
};
const openToClose: Record<OpeningChar, ClosingChar> = {
  "(": ")",
  "<": ">",
  "{": "}",
  "[": "]",
};
const isCorrupedLine = (line: Line): ClosingChar | null => {
  const brakets: OpeningChar[] = [];

  for (let char of line) {
    if (isOpeningChar(char)) {
      brakets.push(char);
    } else {
      const correspondingOpening = closeToOpen[char];
      if (brakets[brakets.length - 1] !== correspondingOpening) {
        return char;
      } else {
        brakets.pop();
      }
    }
  }

  return null;
};

export const q1 = (lines: Line[]) => {
  const points: Record<ClosingChar, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  const corrupedChars = lines
    .map(isCorrupedLine)
    .filter((char): char is ClosingChar => char !== null)
    .map((char) => points[char]);

  return corrupedChars.reduce((acc, curr) => acc + curr, 0);
};

const getIncompleteBrakets = (line: Line): ClosingChar[] => {
  const brakets: OpeningChar[] = [];

  for (let char of line) {
    if (isOpeningChar(char)) {
      brakets.push(char);
    } else {
      const correspondingOpening = closeToOpen[char];
      if (brakets[brakets.length - 1] !== correspondingOpening) {
        throw new Error("error");
      } else {
        brakets.pop();
      }
    }
  }

  return brakets.map((b) => openToClose[b]).reverse();
};
export const q2 = (lines: Line[]) => {
  const incompleteLines = lines.filter((line) => !isCorrupedLine(line));
  const incompleteBrakets = incompleteLines.map(getIncompleteBrakets);
  const scoring: Record<ClosingChar, number> = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  const scores = incompleteBrakets.map((braketList) =>
    braketList.reduce((acc, curr) => acc * 5 + scoring[curr], 0)
  );

  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};

export const parseInput = (data: string[]): Line[] => {
  return data.map((row) => {
    const strArray = row.split("");
    const charArray = strArray.filter(isChar);

    return charArray;
  });
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
