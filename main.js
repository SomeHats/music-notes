import "@babel/polyfill";
import * as Vex from "vexflow";
import * as mf from "music-fns";
import downloadAllSvgs from "./downloadAllSvgs";
import drawKeyboard from "./drawKeyboard";

const main = document.getElementById("main");
main.innerHTML = "";

const genId = () =>
  `id_${Math.random()
    .toString(36)
    .slice(2)}`;

const margin = 5;
const width = 100;
const height = 120;
const staveY = 0;

const getInterval = (a, b) => mf.getIntervals([a, b])[0];
const getNoteNumber = note => getInterval("C1", note);

const createCard = name => {
  const container = document.createElement("div");
  container.className = "card";
  main.appendChild(container);

  const svgWrapper = document.createElement("div");
  const svgWrapperId = genId();
  svgWrapper.id = svgWrapperId;
  svgWrapper.className = "svgWrapper";
  svgWrapper.setAttribute("data-dl-svg", name);
  container.appendChild(svgWrapper);

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = name;
  container.appendChild(label);

  return svgWrapper;
};

const generateNote = (clef, noteName) => {
  const freq = Math.round(mf.noteToFrequency(noteName))
    .toString()
    .padStart(4, "0");
  const svgWrapper = createCard(
    `note-${clef}-${getNoteNumber(noteName)}-${noteName}`
  );
  const svgWrapperId = genId();
  svgWrapper.id = svgWrapperId;

  var vf = new Vex.Flow.Factory({
    renderer: {
      elementId: svgWrapperId,
      width,
      height
    }
  });

  var score = vf.EasyScore({ clef });
  var system = vf.System({ y: staveY });

  system
    .addStave({
      voices: [score.voice(score.notes(`${noteName}/w`, { clef }))]
    })
    .addClef(clef);

  vf.draw();
};

const genNoteRange = (clef, base, range) => {
  for (let transposeAmt = 0; transposeAmt < range; transposeAmt++) {
    const note = mf.transpose(base, transposeAmt);
    generateNote(clef, note);

    const flat = mf.sharpToFlat(note);
    if (note !== flat) {
      generateNote(clef, flat);
    }
  }
};

const saveButton = document.createElement("button");
saveButton.className = "saveButton";
saveButton.textContent = "Save";
main.appendChild(saveButton);
saveButton.addEventListener("click", async () => {
  downloadAllSvgs();
});

drawKeyboard(createCard("keyboard"), "F1", 67);
for (let i = 0; i < 51; i++) {
  const note = mf.transpose("C2", i);
  drawKeyboard(
    createCard(`keyboard-${i.toString().padStart(2, "0")}-${note}`),
    "F1",
    67,
    note
  );
}
genNoteRange("treble", "A3", 30);
genNoteRange("bass", "C2", 30);
