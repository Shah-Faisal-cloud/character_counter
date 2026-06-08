export interface DensityObj {
  character: string,
  occurence: number,
  percentage: number
}

interface Tally {
  [key: string]: number;
}

export function calcDensity(str: string, areSpacesExcluded: boolean): DensityObj[] {
  let text: string;
  if (areSpacesExcluded) {
    text = str.trim().replace(/\s+/g, "");
  } else {
    text = str;
  }
  text = text.toLowerCase();
  const totalChars: number = text.length;
  
  let tallySheet: Tally = {};
  for (let i = 0; i < totalChars; i++) {
    const char: string = text[i];
    if (tallySheet[char] !== undefined) {
      tallySheet[char]++;
    } else {
      tallySheet[char] = 1;
    }
  }

  let finalArray: DensityObj[] = [];
  for (const key in tallySheet) {
    const rawPercentage = (tallySheet[key] / totalChars) * 100;
    const obj: DensityObj = {
      character: key,
      occurence: tallySheet[key],
      percentage: Number(rawPercentage.toFixed(2))
    }
    finalArray.push(obj);
  }

  return finalArray;
  
}