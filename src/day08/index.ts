import { readFile } from "fs/promises";
import { resolve } from "path";

export const getArrayFromNewLine = async (): Promise<string[]> => {
  const file: string = await readFile(resolve(__dirname, "./input"), "utf8");
  const array = file.split("\n");

  return array.filter((a) => !!a);
};

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

type Number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// bad data structure for this lol
type Digit = Record<Segment, boolean>;

type Row = {
  randomDigits: Digit[];
  output: Digit[];
};

function stringIsSegment(str: string): str is Segment {
  return "abcdefg".includes(str);
}

function numberIsUnit(num: number): num is Number {
  return Number.isInteger(num) && num < 10 && num >= 0;
}

const numberOfOnSegments = (digit: Digit): Number => {
  const num = Object.values(digit).filter((r) => !!r).length;
  if (!numberIsUnit(num)) {
    throw new Error("invalid");
  }
  return num;
};

const numToSegments: Record<Number, Segment[]> = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const segmentsToNumber = (segments: Segment[]): Number => {
  const entry = Object.entries(numToSegments).find(([_, segmentsForNumber]) => {
    if (segmentsForNumber.length !== segments.length) {
      return false;
    }
    return segmentsForNumber.every((s) => segments.includes(s));
  });
  if (!entry) {
    throw new Error("Segment does not create valid number");
  }

  // console.log(entry);
  const number = parseInt(entry[0], 10);
  if (!numberIsUnit(number)) {
    throw new Error("invalid number");
  }

  return number;
};

// this could be typed better
const uniqueSegmentNoToNum: { [x: number]: 1 | 4 | 7 | 8 } = {
  2: 1,
  4: 4,
  3: 7,
  7: 8,
};

const digitToSegmentArray = (digit: Digit): Segment[] => {
  return Object.entries(digit)
    .filter(([_, value]) => value)
    .map(([segment]) => segment)
    .filter(stringIsSegment);
};

const emptyDigit: Digit = {
  a: false,
  b: false,
  c: false,
  d: false,
  e: false,
  f: false,
  g: false,
};

export const q1 = (data: Row[]): number => {
  return data.reduce((acc, curr) => {
    return (
      acc +
      curr.output.filter(
        (digit) => uniqueSegmentNoToNum[numberOfOnSegments(digit)]
      ).length
    );
  }, 0);
};

type Mapping = Record<Segment, Segment>;

function objIsMapping(obj: Partial<Mapping>): obj is Mapping {
  return (
    Object.keys(obj).sort().join().replaceAll(",", "") === "abcdefg" &&
    Object.values(obj).sort().join().replaceAll(",", "") === "abcdefg"
  );
}

const allSegments: Segment[] = ["a", "b", "c", "d", "e", "f", "g"];

// the mapping goes from this to what is actually occuring
/*
original
                  aaa
                b    c 
                b    c 
   actual ->     dddd     
                e    f 
                e    f 
                gggg 
*/
// FROM SEGMENTS to SIGNAL
// Brute forcing is probably easier than this
const getMapping = (digits: Digit[]): Mapping => {
  const obj: Partial<Mapping> = {};

  // SIGNAL to SEGMENTS
  let posibilities: Record<Segment, Segment[]> = {
    a: allSegments,
    b: allSegments,
    c: allSegments,
    d: allSegments,
    e: allSegments,
    f: allSegments,
    g: allSegments,
  };

  digits
    .filter((digit) => {
      const segmentNumber = numberOfOnSegments(digit);
      return !!uniqueSegmentNoToNum[segmentNumber];
    })
    .forEach((digit) => {
      const outputSegment = digitToSegmentArray(digit);
      const segmentNumber = numberOfOnSegments(digit);

      const outputNumber = uniqueSegmentNoToNum[segmentNumber];
      const signalSegments = numToSegments[outputNumber];

      allSegments.forEach((seg) => {
        posibilities[seg] = posibilities[seg].filter((segment) => {
          if (signalSegments.includes(seg)) {
            return outputSegment.includes(segment);
          }
          return !outputSegment.includes(segment);
        });
      });
    });

  // 2, 3 or 5
  const fiveLights = digits
    .filter((digit) => {
      const segmentNumber = numberOfOnSegments(digit);
      return segmentNumber === 5;
    })
    .map(digitToSegmentArray);

  // must have a, d, f ON
  // so find common
  const obj2: any = {};

  fiveLights.forEach((segments) => {
    segments.forEach((segment) => {
      if (!!obj2[segment]) {
        obj2[segment] += 1;
      } else {
        obj2[segment] = 1;
      }
    });
  });
  const commonSegments: Segment[] = Object.entries(obj2)
    .filter(([key, value]) => value === 3)
    .map(([key]) => key) as Segment[];

  const onForFive: Segment[] = ["a", "d", "g"];

  allSegments.forEach((seg) => {
    posibilities[seg] = posibilities[seg].filter((segment) => {
      if (onForFive.includes(seg)) {
        return commonSegments.includes(segment);
      }
      return !commonSegments.includes(segment);
    });
  });

  //  0, 6, 9
  const sixLights = digits
    .filter((digit) => {
      const segmentNumber = numberOfOnSegments(digit);
      return segmentNumber === 6;
    })
    .map(digitToSegmentArray);

  const obj3: any = {};

  sixLights.forEach((segments) => {
    segments.forEach((segment) => {
      if (!!obj3[segment]) {
        obj3[segment] += 1;
      } else {
        obj3[segment] = 1;
      }
    });
  });

  const onForSix: Segment[] = ["a", "b", "f", "g"];

  const commonSegmentsSix: Segment[] = Object.entries(obj3)
    .filter(([key, value]) => value === 3)
    .map(([key]) => key) as Segment[];

  allSegments.forEach((seg) => {
    posibilities[seg] = posibilities[seg].filter((segment) => {
      if (onForSix.includes(seg)) {
        return commonSegmentsSix.includes(segment);
      }
      return !commonSegmentsSix.includes(segment);
    });
  });

  const completeMapping: Mapping = Object.entries(posibilities).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value[0],
    }),
    {} as Mapping
  );

  const isMapping = objIsMapping(completeMapping);
  if (!isMapping) {
    throw new Error("mapping error");
  }

  const invertedMapping = Object.entries(completeMapping).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [value]: key,
      };
    },
    {} as Mapping
  );
  return invertedMapping;
};

const getSegmentsFromDigit = (digit: Digit): Segment[] =>
  Object.entries(digit)
    .filter(([segment, isOn]) => isOn)
    .map(([segment]) => segment as Segment);

const digitsAndMappingToNumbers = (
  digits: Digit[],
  mapping: Mapping
): number[] => {
  const segmentArray = digits.map(getSegmentsFromDigit);

  const mapped = segmentArray.map((array) =>
    array.map((segment) => mapping[segment])
  );

  return mapped.map((array) => segmentsToNumber(array));
};

const arrayToNumber = (numbers: number[]): number =>
  numbers.reduce(
    (acc, curr, i, self) => acc + curr * 10 ** (self.length - i - 1),
    0
  );

export const q2 = (data: Row[]) => {
  const mappings = data.map((row) => ({
    mapping: getMapping(row.randomDigits),
    ...row,
  }));

  const numberArrays = mappings.map((m) =>
    digitsAndMappingToNumbers(m.output, m.mapping)
  );
  const numbers = numberArrays.map(arrayToNumber);

  return numbers.reduce((acc, curr) => acc + curr, 0);
};

export const parseInput = (data: string[]): Row[] => {
  return data.map((row) => {
    const splitRow = row.split("|").map((r) => r.trim());
    const [randomDigits, output] = splitRow.map((r) =>
      r.split(" ").map((segmentStr) => {
        const obj: Digit = { ...emptyDigit };
        segmentStr.split("").forEach((letter) => {
          if (stringIsSegment(letter)) {
            obj[letter] = true;
          } else {
            throw new Error("bad data");
          }
        });
        return obj;
      })
    );

    return { randomDigits, output };
  });
};

const main = async () => {
  const data = await getArrayFromNewLine();

  const parsed = parseInput(data);
  console.log(q1(parsed));
  console.log(q2(parsed));
};

main();
