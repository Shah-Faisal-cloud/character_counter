import { getUserPreference, handleThemeSelection } from "../core/theme.ts";
import { icons } from "../utils/icons.ts";

type PossibleThemes = "light" | "dark" | "system";

const themes: PossibleThemes[] = ["light", "dark", "system"];

export function Header(): HTMLElement {
  const header: HTMLElement = document.createElement("header");
  header.className = "flex items-center py-8 justify-between";
  header.innerHTML = /* html */ `
    <a href="#">
        <img src="/logo-light-theme.svg" class="block dark:hidden max-sm:h-8" alt="brand logo">
        <img src="/logo-dark-theme.svg" class="hidden dark:block max-sm:h-8" alt="brand logo">
    </a>
    <div class="relative">
        <button class="p-2.5 bg-white dark:bg-voilet text-black dark:text-white hover:bg-white-dark dark:hover:bg-voilet-light cursor-pointer rounded-md theme-btn">
            ${icons.dark}
        </button>
        <div class="dropdown hidden bg-white dark:bg-voilet text-black dark:text-white px-4 py-2 absolute -bottom-2.5 right-0 translate-y-full rounded-lg">
        <div class="flex flex-col gap-y-2">
        ${themes
          .map((theme) => {
            return `
              <button type="button" data-theme-option="${theme}" class="dropdown-btn flex gap-x-2 hover:bg-white-dark dark:hover:bg-voilet-light px-2 py-1 cursor-pointer rounded-sm">
                  <span>${icons[theme]}</span>
                  <span>${theme}</span>
              </button>
          `;
          })
          .join("")}
        </div>
        </div>
    </div>`;

  const themeBtn = header.querySelector(".theme-btn") as HTMLButtonElement;
  const dropdown = header.querySelector(".dropdown") as HTMLDivElement;
  const dropdownBtns = header.querySelectorAll(".dropdown-btn") as NodeListOf<HTMLButtonElement>;

  function syncThemeUI(): void {
    const preference = getUserPreference();
    themeBtn.innerHTML = icons[preference];
    dropdownBtns.forEach((btn) => {
      if (btn.getAttribute("data-theme-option") === preference) {
        btn.classList.add("bg-white-dark", "dark:bg-voilet-light");
      } else {
        btn.classList.remove("bg-white-dark", "dark:bg-voilet-light");
      }
    });
  }

  syncThemeUI();

  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  window.addEventListener("click", (e) => {
    const clickedElement = e.target as HTMLElement;
    const isClickedInsideDropdown = clickedElement.closest(".dropdown");
    const isClickedButton = clickedElement.closest(".dropdown-btn");
    if (isClickedButton || !isClickedInsideDropdown) {
      if (!dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden");
      }
    }
  });

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const clickBtn = e.currentTarget as HTMLButtonElement;
      const selectedTheme = clickBtn.getAttribute(
        "data-theme-option",
      ) as string;
      handleThemeSelection(selectedTheme);
      syncThemeUI();
    });
  });

  return header;
}
