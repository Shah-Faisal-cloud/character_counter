import { Header } from "./components/Header.ts";
import { CounterUI } from "./components/CounterUI.ts";
import { initTheme } from "./core/theme.ts";
import { DensityUI } from "./components/DensityUI.ts";
import { calcDensity } from "./core/density.ts";

const app = document.querySelector("#app") as HTMLElement;
const main = document.createElement('main');

app.appendChild(Header());
app.appendChild(main)

const { densitySection, updateBars } = DensityUI();
main.appendChild(CounterUI());
main.appendChild(densitySection);

const textarea = main.querySelector('textarea') as HTMLTextAreaElement;
const checkbox = main.querySelector('#spaces-only') as HTMLInputElement;

function updateDensityUI(): void {
  const text: string = textarea.value;
  const areSpacesExcluded: boolean = checkbox.checked;

  const densityData = calcDensity(text, areSpacesExcluded);
  updateBars(densityData);
  
}

textarea.addEventListener('input', updateDensityUI);
checkbox.addEventListener('change', updateDensityUI);

initTheme();


