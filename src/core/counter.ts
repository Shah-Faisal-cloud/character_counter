interface counterObj {
  characterCount: number,
  wordCount: number,
  sentenceCount: number
}

export function counter(text: string, areSpacesExcluded: boolean): counterObj {
  
  let charCounter: number;
  if (areSpacesExcluded) {
    charCounter = text.trim().replace(/\s+/g, "").length;
  } else {
    charCounter = text.length;
  }

  const wordCounter: number = (text.trim().match(/\S+/g) || [])?.length;

  const sentenceCounter: number = (text.match(/[.!?]/g) || []).length;

  return {
    characterCount: charCounter,
    wordCount: wordCounter,
    sentenceCount: sentenceCounter
  }
}

export function calcReadTime(totalWords: number): string {
  const WPM = 200;
  const rawReadTime = totalWords / WPM;
  let totalReadTime: string;
  if (rawReadTime < 0.75) {
    totalReadTime = "< 1";
    return totalReadTime;
  }
  totalReadTime = String(Math.round(rawReadTime));
  return totalReadTime;
}