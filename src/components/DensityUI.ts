import type { DensityObj } from "../core/density.ts";

interface DensityUIReturn {
  densitySection: HTMLElement,
  updateBars: (charsArray: DensityObj[]) => void
}

interface ElementCache {
  [key: string]: HTMLLIElement
}

const elementCache: ElementCache = {};

export function DensityUI(charsArray: DensityObj[] = []): DensityUIReturn {
  let isExpanded = false; 
  const densitySection = document.createElement('section');
  densitySection.classList = "mt-12 w-full text-black dark:text-white-dark flex flex-col gap-y-3 mb-16";
  densitySection.innerHTML = /* html */ `
        <h2 class="font-semibold text-2xl tracking-tight">Letter Density</h2>
        <p id="no-text-found">No characters found. Start typing to see density of each letter.</p>
        <ul class="flex-col gap-y-1 hidden [&>li:nth-child(n+6)]:hidden" id="chars-list">
            ${charsArray.map((char: DensityObj) => DensityBar(char)).join('')}
        </ul>
        <button id="toggle-btn" class="text-start hidden -mt-1 font-medium cursor-pointer hover:text-purple transition-colors 0.3s ease-linear">See More</button>
    `;

  const list = densitySection.querySelector('#chars-list') as HTMLElement;
  const noTextMsg = densitySection.querySelector('#no-text-found') as HTMLParagraphElement;
  const toggleBtn = densitySection.querySelector('#toggle-btn') as HTMLButtonElement;

  toggleBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      list.classList.remove('[&>li:nth-child(n+6)]:hidden');
      toggleBtn.textContent = 'See Less';
    } else {
      list.classList.add('[&>li:nth-child(n+6)]:hidden');
      toggleBtn.textContent = 'See More';
    }
  })
  
  function updateBars(charsArray: DensityObj[]): void {
    if (charsArray.length !== 0) {
      noTextMsg.classList.add('hidden');
      list.classList.remove('hidden');
    } else {
      noTextMsg.classList.remove('hidden');
      list.classList.add('hidden');
    }

    if (charsArray.length > 5) {
          toggleBtn.classList.remove('hidden');
        } else {
          toggleBtn.classList.add('hidden');
        }
    
    charsArray.forEach((char: DensityObj) => {
      const doesExist: boolean = char.character in elementCache;
      if (doesExist) {
          const listItem = elementCache[char.character]
          const bar = listItem.querySelector('.bar') as HTMLDivElement;
          const densityShower = listItem.querySelector('.count') as HTMLSpanElement;
          bar.style.width = String(char.percentage)+"%"; 
          densityShower.textContent = `${char.occurence} (${char.percentage}%)`
      } else {
          const newListItem: string = DensityBar(char);
          list.insertAdjacentHTML('beforeend', newListItem);
          const newlyAppendedElement = list.lastElementChild as HTMLLIElement;
          elementCache[char.character] = newlyAppendedElement;
      }
    });


    for (const key in elementCache) {
        const doesExist = charsArray.some((char) => {
          return char.character === key;
      });
      
      if (!doesExist) {
        const elementToRemove = elementCache[key] as HTMLLIElement;
        elementToRemove.remove();
        delete elementCache[key];
      } 
    }  
  }

  return { densitySection, updateBars };
}

function DensityBar(char: DensityObj): string {
  // const charToDisplay = char.character === " " ? "\\s" : char.character;
  return /* html */ `
    <li class='flex gap-x-4 items-center' data-char="${char.character}">
        <span class="font-semibold text-2xl min-w-6 text-center">${char.character === " " ? "\\s" : char.character.toUpperCase()}</span>
        <div class="w-full">
            <div class="h-3 bg-purple rounded-xl bar transition-[width] 0.7s ease-linear" style="width: ${char.percentage}%"></div>
        </div>
        <span class="text-lg font-medium shrink-0 count" > ${ char.occurence } (${ char.percentage }%)</span>
    </li>
    `
}
