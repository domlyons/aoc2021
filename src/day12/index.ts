import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Graph = {
  [node: string]: string[];
};

const isLarge = (node: string) => node === node.toUpperCase();
const isSmall = (node: string) =>
  node !== "end" && node !== "start" && node.toLowerCase() === node;

type Path = string[];

const getPaths = (graph: Graph, currentPath: Path): Path[] => {
  const alreadyVisitedSmallCaves = currentPath.filter((node) => isSmall(node));

  const currentNode = currentPath[currentPath.length - 1];

  const newPaths = graph[currentNode]
    .filter((newNode) => !alreadyVisitedSmallCaves.includes(newNode))
    .map((newNode) => [...currentPath, newNode]);

  return newPaths;
};
const getPathsQ2 = (graph: Graph, currentPath: Path): Path[] => {
  const alreadyVisitedSmallCaves = currentPath.filter((node) => isSmall(node));

  const currentNode = currentPath[currentPath.length - 1];

  let smallCaveCount = currentPath.filter(isSmall).reduce((acc, curr) => {
    if (acc[curr] === undefined) {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {} as { [x: string]: number });

  const smallHasTwo = !!Object.values(smallCaveCount).find((v) => v === 2);

  const possibleNodes = graph[currentNode].filter((newNode) => {
    if (!isSmall(newNode)) {
      return true;
    }
    const number = alreadyVisitedSmallCaves.filter(
      (visited) => visited === newNode
    ).length;

    if (!smallHasTwo && number === 1) {
      return true;
    }
    return number === 0;
  });

  const newPaths = possibleNodes.map((newNode) => [...currentPath, newNode]);
  return newPaths;
};

const getAllPaths = (
  graph: Graph,
  currentPaths: Path[] = [["start"]],
  getNewPaths: (graph: Graph, currentPath: Path) => Path[] = getPaths
): Path[] => {
  const completedPaths = currentPaths.filter((p) => p[p.length - 1] === "end");
  const incompletePaths = currentPaths.filter((p) => p[p.length - 1] !== "end");

  if (incompletePaths.length === 0) {
    return completedPaths;
  }

  const advancePaths = incompletePaths.map((p) => getNewPaths(graph, p)).flat();
  return getAllPaths(graph, [...completedPaths, ...advancePaths], getNewPaths);
};

export const q1 = (graph: Graph): number => {
  const allPaths = getAllPaths(graph);

  return allPaths.length;
};

export const q2 = (graph: Graph): number => {
  const allPaths = getAllPaths(graph, [["start"]], getPathsQ2);

  return allPaths.length;
};

export const parseInput = (data: string[]) => {
  return data.reduce((acc, row) => {
    const [start, end] = row.split("-");
    if (!acc[start]) {
      acc[start] = [];
    }
    if (!acc[end]) {
      acc[end] = [];
    }

    if (end !== "start") {
      acc[start].push(end);
    }
    if (start !== "start") {
      acc[end].push(start);
    }
    return acc;
  }, {} as Graph);
};

const main = async () => {
  const data = await getArrayFromNewLine();
  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
