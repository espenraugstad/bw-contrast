const getChannel = (channel) => {
  const normalized = channel / 255;
  if (normalized <= 0.03928) {
    return normalized / 12.92;
  } else {
    return ((normalized + 0.055) / 1.055) ** 2.4;
  }
};

const getLuminance = (r, g, b) => {
  const R = getChannel(r);
  const G = getChannel(g);
  const B = getChannel(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

let UPPER = 0;
let LOWER = 0;
 let count = 0;
/* const UPPER = 0.18333333;
const LOWER = 0.175; */

const colors = document.querySelector("#colors");
const contrastValue = document.querySelector("#contrastValue");
const results = document.querySelector("#results");

const addColor = (r, g, b) => {
  const li = document.createElement("li");
  li.innerHTML = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}<br/>
rgb(${r}, ${g}, ${b})`;
  li.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  colors.appendChild(li);
};

const calculateColors = () => {
  count = 0;
  for (let b = 0; b < 256; b += 5) {
    for (let g = 0; g < 256; g += 5) {
      for (let r = 0; r < 256; r += 5) {
        const luminance = getLuminance(r, g, b);
        if (LOWER <= luminance && luminance <= UPPER) {
          count++;
          addColor(r, g, b);
        }
      }
    }
  }
};

const calculateBounds = () => {
  let C = contrastRange.value;
  contrastValue.innerText = C;

  LOWER = 0.05*(C - 1);
  UPPER = (1.05/C)-0.05;

  colors.innerHTML = "";
  calculateColors();
  if(count === 0){
    colors.innerHTML = "<li>No colors found</li>";
  } else {
    results.innerHTML = `Found ${count} colors.`;
  }

  console.log(contrastRange.value);
  console.log(UPPER);
  console.log(LOWER);
};

const contrastRange = document.querySelector("#contrastChoice");

contrastRange.addEventListener("change", calculateBounds);

calculateBounds();
