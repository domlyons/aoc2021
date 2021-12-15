import { readFile } from "fs/promises";
import { resolve } from "path";

// this is really messy, lots of experimentation before finding the solution

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Data = {
  template: string[];
  rules: {
    [condition: string]: string;
  };
};

const insertInto = ({ template, rules }: Data): string[] => {
  const newArray = [...template];

  let i = 0;
  while (i < newArray.length - 1) {
    const first = newArray[i];
    const second = newArray[i + 1];
    const rule = rules[`${first}${second}`];
    if (!rule) {
      i++;
      continue;
    }
    newArray.splice(i + 1, 0, rule);
    i += 2;
  }

  return newArray;
};

const mostMinusLeast = (polymer: string[]) => {
  const elementFreq: { [x: string]: number } = {};

  polymer.forEach((p) => {
    if (!elementFreq[p]) {
      elementFreq[p] = 1;
    } else {
      elementFreq[p] += 1;
    }
  });
  console.log("correct", elementFreq);
  return answerFromFreqObj(elementFreq);
};

const applyRulesToPair = (
  pair: [string, string],
  rules: Data["rules"],
  maxIteration: number,
  iteration = 0
): string[] => {
  const newLetter = rules[`${pair[0]}${pair[1]}`];
  if (!newLetter || iteration === maxIteration) {
    return pair;
  }

  const start = applyRulesToPair(
    [pair[0], newLetter],
    rules,
    maxIteration,
    iteration + 1
  );
  const end = applyRulesToPair(
    [newLetter, pair[1]],
    rules,
    maxIteration,
    iteration + 1
  );

  start.pop();

  return [...start, ...end];
};

const applyRulesToPair2 = (
  pair: [string, string],
  acc: { [x: string]: number },
  rules: Data["rules"],
  maxIteration: number,
  iteration = 0
): { [x: string]: number } => {
  const newLetter = rules[`${pair[0]}${pair[1]}`];

  if (!newLetter || iteration === maxIteration) {
    return acc;
  }

  if (!acc[newLetter]) {
    acc[newLetter] = 1;
  } else {
    acc[newLetter]++;
  }
  const newAcc = applyRulesToPair2(
    [pair[0], newLetter],
    acc,
    rules,
    maxIteration,
    iteration + 1
  );

  return applyRulesToPair2(
    [newLetter, pair[1]],
    newAcc,
    rules,
    maxIteration,
    iteration + 1
  );
};

const answerFromFreqObj = (elementFreq: { [x: string]: number }): number => {
  let most = "";
  let least = "";
  let mostFreq = 0;
  let leastFreq = Infinity;

  Object.entries(elementFreq).forEach(([letter, freq]) => {
    if (freq > mostFreq) {
      most = letter;
      mostFreq = freq;
    }
    if (freq < leastFreq) {
      least = letter;
      leastFreq = freq;
    }
  });
  return mostFreq - leastFreq;
};

const getNewPolymer2 = (
  { template, rules }: Data,
  maxIteration: number
): number => {
  const elementFreq: { [x: string]: number } = {};

  for (let i = 0; i < template.length; i++) {
    const letter = template[i];
    if (!elementFreq[letter]) {
      elementFreq[letter] = 1;
    } else {
      elementFreq[letter]++;
    }
  }

  for (let i = 0; i < template.length - 1; i++) {
    console.log("ON VALUE", i);
    const first = template[i];
    const second = template[i + 1];

    const counts = applyRulesToPair2([first, second], {}, rules, maxIteration);

    Object.entries(counts).forEach(([key, value]) => {
      elementFreq[key] = (elementFreq[key] || 0) + value;
    });
  }

  return answerFromFreqObj(elementFreq);
};

const getNewPolymer = (
  { template, rules }: Data,
  maxIteration: number
): number => {
  const elementFreq: { [x: string]: number } = {};
  let newPolymer: string[][] = [];

  template.forEach((x, i, self) => {
    if (i === self.length - 1) {
      return;
    }
    const newPairs = applyRulesToPair([x, self[i + 1]], rules, maxIteration);

    if (i !== self.length - 2) {
      newPairs.pop();
    }
    newPairs.forEach((p) => {
      if (!elementFreq[p]) {
        elementFreq[p] = 1;
      } else {
        elementFreq[p] += 1;
      }
    });
  });

  return answerFromFreqObj(elementFreq);
};

const addToObj = (
  obj: { [x: string]: number },
  letter: string,
  count: number
) => {
  if (obj[letter]) {
    obj[letter] += count;
  } else {
    obj[letter] = 1;
  }
};

export const q1 = ({ template, rules }: Data) => {
  const answer = getNewPolymer2({ template, rules }, 10);

  return answer;
};

export const q2 = ({ template, rules }: Data) => {
  const cache: { [x: string]: { [x: string]: number } } = {};
  const overallCount: { [x: string]: number } = {};

  Object.keys(rules).forEach((r) => {
    cache[r] = applyRulesToPair2([r[0], r[1]], {}, rules, 20);
  });

  let newPolymer = [];
  for (let i = 0; i < template.length - 1; i++) {
    const first = template[i];
    const second = template[i + 1];

    const newPoly = applyRulesToPair([first, second], rules, 20);
    if (i !== template.length - 2) {
      newPoly.pop();
    }
    newPolymer.push(newPoly);
  }
  newPolymer = newPolymer.flat();
  for (let i = 0; i < newPolymer.length; i++) {
    addToObj(overallCount, newPolymer[i], 1);
  }

  for (let i = 0; i < newPolymer.length - 1; i++) {
    const first = newPolymer[i];
    const second = newPolymer[i + 1];
    const obj = cache[`${first}${second}`];

    Object.entries(obj).forEach(([key, value]) => {
      addToObj(overallCount, key, value);
    });
  }

  return answerFromFreqObj(overallCount);
};

export const parseInput = (data: string[]): Data => {
  const [template, ...rules] = data;
  const ruleArray = rules
    .filter((r) => !!r)
    .map((r) => r.split("->").map((r) => r.trim()));

  const ruleObj: Data["rules"] = {};
  ruleArray.forEach((r) => {
    ruleObj[r[0]] = r[1];
  });

  return {
    template: template.split(""),
    rules: ruleObj,
  };
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
