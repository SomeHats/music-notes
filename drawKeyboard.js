import * as mf from "music-fns";

const whiteKeyWidth = 12;
const blackKeyWidth = 8;

const create = elementName =>
  document.createElementNS("http://www.w3.org/2000/svg", elementName);

const createRect = (x, y, width, height, fill) => {
  const rect = create("rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("style", `stroke: black; fill: ${fill};`);
  return rect;
};

const createText = (x, y, width, height, contents) => {
  const text = create("text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("width", width);
  text.setAttribute("height", height);
  text.textContent = contents;
  text.style.fontFamily = "sans-serif";
  text.style.fontSize = "12px";
  return text;
};

const createMarker = (x, y) => {
  const circle = create("circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 3);
  circle.style.fill = "red";
  return circle;
};

const drawKeyboard = (svgWrapper, base, notes, highlight) => {
  if (mf.hasAccidental(base)) {
    return drawKeyboard(svgWrapper, mf.transpose(base, -1), notes + 1);
  }

  const svg = create("svg");
  svgWrapper.appendChild(svg);

  let whiteNoteIdx = 0;
  const whites = [];
  const blacks = [];
  const labels = [];
  for (let i = 0; i < notes; i++) {
    const note = mf.transpose(base, i);
    const x = (whiteNoteIdx + 1) * whiteKeyWidth;

    if (mf.isSharp(note)) {
      blacks.push(
        createRect(x - blackKeyWidth / 2, 10, blackKeyWidth, 50, "black")
      );
      if (note === highlight) {
        labels.push(createMarker(x, 55));
      }
    } else {
      whiteNoteIdx++;

      whites.push(createRect(x, 10, whiteKeyWidth, 65, "white"));

      if (mf.getNote(note) === "C") {
        labels.push(createText(x, 90, whiteKeyWidth, 20, note));
      }
      if (note === highlight) {
        labels.push(createMarker(x + whiteKeyWidth / 2, 70));
      }
    }
  }

  [...whites, ...blacks, ...labels].forEach(el => svg.appendChild(el));

  svg.setAttribute("width", (whiteNoteIdx + 2) * whiteKeyWidth);
  svg.setAttribute("height", 100);
};

export default drawKeyboard;
