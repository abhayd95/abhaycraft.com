// // ====== Style Switcher Toggle ======
// const styleSwitcher = document.querySelector(".style-switcher");
// const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

// if (styleSwitcherToggler) {
//   styleSwitcherToggler.addEventListener("click", () => {
//     styleSwitcher.classList.toggle("open");
//   });
// }

// // Auto close on scroll
// window.addEventListener("scroll", () => {
//   if (styleSwitcher.classList.contains("open")) {
//     styleSwitcher.classList.remove("open");
//   }
// });

// // ====== Theme Color Change ======
// function setActiveStyle(colorName) {
//   document.documentElement.style.setProperty("--skin-color", getColorValue(colorName));
//   localStorage.setItem("skin-color", colorName);
// }

// // Color value mapping
// function getColorValue(colorName) {
//   switch (colorName) {
//     case 'color-1': return '#FF5733';
//     case 'color-2': return '#4CAF50';
//     case 'color-3': return '#03A9F4';
//     case 'color-4': return '#FFC107';
//     case 'color-5': return '#9C27B0';
//     default: return '#FF5733';
//   }
// }

// // Load saved color on page load
// const savedColor = localStorage.getItem("skin-color");
// if (savedColor) {
//   document.documentElement.style.setProperty("--skin-color", getColorValue(savedColor));
// }
