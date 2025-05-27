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
let granularity = parseInt(
  document.querySelector("input[name='granularity']:checked").value
);

const colors = document.querySelector("#colors");
const contrastValue = document.querySelector("#contrastValue");
const results = document.querySelector("#results");
const granularRadio = document.querySelectorAll("input[name='granularity']");

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
  granularity = parseInt(
    document.querySelector("input[name='granularity']:checked").value
  );
  for (let b = 0; b < 256; b += granularity) {
    for (let g = 0; g < 256; g += granularity) {
      for (let r = 0; r < 256; r += granularity) {
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

  LOWER = 0.05 * (C - 1);
  UPPER = 1.05 / C - 0.05;

  colors.innerHTML = "";
  calculateColors();
  if (count === 0) {
    colors.innerHTML = "<li>No colors found</li>";
  }
  results.innerHTML = `Found ${count} colors.`;
};

for (const g of granularRadio) {
  g.addEventListener("change", calculateBounds);
}

const contrastRange = document.querySelector("#contrastChoice");

contrastRange.addEventListener("change", calculateBounds);

calculateBounds();
