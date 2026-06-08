import { calcReadTime, counter } from "../core/counter";

const cards = [
  {
    label: 'characters',
    color: '#D3A0FA'
  },
  {
    label: 'words',
    color: '#FF9F00'
  },
  {
    label: 'sentences',
    color: '#FE8159'
  }
]

export function CounterUI(): HTMLElement {
  const counterSection = document.createElement('section');
  counterSection.classList = 'flex flex-col items-center gap-y-12 mt-8 max-sm:mt-6'
  counterSection.innerHTML = /* html */ `
        <h1 class="text-6xl max-sm:text-4xl font-bold max-sm:max-w-96 max-w-lg tracking-tighter text-center text-black dark:text-white">Analyze your text in real-time.</h1>
        <div class="w-full flex flex-col gap-y-4 text-black dark:text-white-dark">
            <textarea
                aria-label="Enter your text to analyze"
                placeholder="Start typing here... (or paste your text)"
                class="w-full border-2 border-white-dark dark:border-voilet-light focus:outline-none px-6 py-4 min-h-48 rounded-lg bg-white hover:bg-white-dark dark:bg-voilet dark:hover:bg-voilet-light placeholder:text-lg placeholder:text-gray caret-black dark:caret-white resize-none focus-rainbow font-[inherit] text-lg font-medium"
            ></textarea>
            <p id="error-msg" class="text-red-500 text-start text-sm -mt-1 pl-1 hidden">Limit reached! Your text exceeds <span id="char-limit">10</span> characters.</p>
            <div class="flex justify-between w-full flex-wrap gap-y-4 max-md:gap-x-20 px-2 font-medium">
                <div class="flex gap-x-8 flex-wrap">
                    <div class="flex items-center gap-x-2">
                        <input type="checkbox" id="spaces-only"/>
                        <label for="spaces-only" class="cursor-pointer">Exclude Spaces</label>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <input type="checkbox" id="char-limit-checkbox"/>
                        <label for="char-limit-checkbox" class="cursor-pointer">Set Character Limit</label>
                        <input type="number" id="char-limit-input" class="hidden ml-2 border border-black dark:border-white-dark max-w-14 rounded text-center focus:outline-none">
                    </div>
                </div>
                    <p>Approx reading time:
                        <span id="read-time" class="font-semibold text-lg">0</span>
                        min
                        
                    </p>
            </div>
        </div>
        <dl class="flex gap-x-4 w-full max-md:flex-col max-md:gap-y-6">
            ${cards.map((card) => {
              return /* html */ `
                <div class="flex-1 p-5 rounded-xl bg-no-repeat bg-right bg-contain" style="background-color: ${card.color}; background-image: url(/pattern-${card.label}.svg)">
                    <dt class="text-6xl font-bold" data-metric="${card.label}">0</dt>
                    <dd class="text-xl font-medium metric-label">${card.label} count</dd>
                </div>
              `
            }).join("")}
        </dl>
    `

  const textarea = counterSection.querySelector('textarea') as HTMLTextAreaElement;
  const checkbox = counterSection.querySelector('#spaces-only') as HTMLInputElement;
  const charLimitChecbox = counterSection.querySelector('#char-limit-checkbox') as HTMLInputElement;
  const charLimitInput = counterSection.querySelector('#char-limit-input') as HTMLInputElement;
  const errorMsg = counterSection.querySelector('#error-msg') as HTMLParagraphElement;
  const charLimitDisplay = counterSection.querySelector('#char-limit');
    
  const charDisplay = counterSection.querySelector('[data-metric="characters"]') as HTMLElement;
  const wordDisplay = counterSection.querySelector('[data-metric="words"]') as HTMLElement;
  const sentenceDisplay = counterSection.querySelector('[data-metric="sentences"]') as HTMLElement;
  const readTimeDisplay = counterSection.querySelector('#read-time') as HTMLElement;


  function updateMetricsUI(): {totalChars: number, totalWords: number} {
    const text: string = textarea.value;
    const areSpacesExcluded: boolean = checkbox.checked;
    const { characterCount, wordCount, sentenceCount } = counter(text, areSpacesExcluded);
    
    charDisplay.textContent = String(characterCount);
    wordDisplay.textContent = String(wordCount);
    sentenceDisplay.textContent = String(sentenceCount);
    
    return {
      totalChars: characterCount,
      totalWords: wordCount
    };
  }

  function updateReadTimeUI(totalWords: number): void {
    const totalReadTime: string = calcReadTime(totalWords);
    readTimeDisplay.textContent = totalReadTime;
  }

  function showLimitOverflow(totalChars: number): void {
    const isChecked = charLimitChecbox.checked;
    if (!isChecked) return;
    const charLimit = charLimitInput.value;
    if (totalChars > Number(charLimit)) {
      errorMsg.classList.remove('hidden');
      charLimitDisplay!.textContent = charLimit;
      textarea.classList.remove('focus-rainbow');
      textarea.classList.add('focus-error');
    } else {
      errorMsg.classList.add('hidden');
      textarea.classList.add('focus-rainbow');
      textarea.classList.remove('focus-error');
    }
  }

  function toggleInput(): void {
    const isChecked = charLimitChecbox.checked;
    if (isChecked) {
      charLimitInput.classList.remove('hidden');
    } else {
      charLimitInput.classList.add('hidden');
    }
  }
  
  textarea.addEventListener('input', () => {
    const { totalChars, totalWords} = updateMetricsUI();
    updateReadTimeUI(totalWords);
    showLimitOverflow(totalChars);
  });

  checkbox.addEventListener('change', () => {
    const { totalChars } = updateMetricsUI();
    showLimitOverflow(totalChars);
    
  });
  
  charLimitChecbox.addEventListener('change', toggleInput);


  return counterSection;
}