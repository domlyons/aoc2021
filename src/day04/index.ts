import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

export type Answers = number[];
export type Board = number[][];

export const isInAnswers = (cell: number, answers: Answers): boolean => {
  return answers.includes(cell);
};

export const hasBoardWon = (board: Board, answers: Answers): boolean => {
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    if (row.every((b) => isInAnswers(b, answers))) {
      return true;
    }

    let hits = 0;

    for (let j = 0; j < board.length; j++) {
      if (isInAnswers(board[j][i], answers)) {
        hits = hits + 1;
      }
    }

    if (hits === board.length) {
      return true;
    }
  }
  return false;
};

const scoreBoard = (board: Board, answers: Answers): number => {
  let score = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (!isInAnswers(board[i][j], answers)) {
        score += board[i][j];
      }
    }
  }

  return score * answers[answers.length - 1];
};
export const q1 = (answers: Answers, boards: Board[]) => {
  for (let i = 1; i <= answers.length; i++) {
    const answersInPlay = answers.slice(0, i);

    const winningBoard = boards.find((b) => hasBoardWon(b, answersInPlay));

    if (winningBoard) {
      return scoreBoard(winningBoard, answersInPlay);
    }
  }

  throw new Error("No boards won");
};

export const q2 = (answers: Answers, boards: Board[]) => {
  for (let i = answers.length; i > 0; i--) {
    const answersInPlay = answers.slice(0, i);

    const losingBoard = boards.find((b) => !hasBoardWon(b, answersInPlay));

    if (losingBoard) {
      return scoreBoard(losingBoard, answers.slice(0, i + 1));
    }
  }

  throw new Error("No boards didn't win");
};

const boardSize = 5;

const parseData = (
  data: string[]
): {
  boards: Board[];
  answers: Answers;
} => {
  const [answerString, ...rest] = data;
  const answers = answerString.split(",").map((i) => parseInt(i, 10));

  let boardCounter = 0;
  let board: Board = [];

  const boards: Board[] = [];

  for (let i = 0; i < rest.length; i++) {
    const row = rest[i]
      .trim()
      .replaceAll("  ", " ")
      .split(" ")
      .map((r) => parseInt(r, 10));

    board.push(row);
    boardCounter += 1;
    if (boardCounter === boardSize) {
      boardCounter = 0;
      boards.push(board);
      board = [];
    }
  }

  return {
    answers,
    boards,
  };
};

const main = async () => {
  const data = await getArrayFromNewLine();
  const { answers, boards } = parseData(data);
  console.log(q1(answers, boards));
  console.log(q2(answers, boards));
};

main();
