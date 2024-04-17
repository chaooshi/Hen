import { parse } from "./parser.js";
import { evaluate } from "./evaluator.js";

const editor = document.getElementById("editor");
const output = document.getElementById("output");
const consoleEl = document.getElementById("console");
const runButton = document.getElementById("run-button");
runButton.addEventListener("click", run);
editor.focus();

function run() {
  consoleEl.textContent = ""; // Clear console
  consoleEl.classList.remove("error");
  try {
    const parsedData = parse(editor.value);
    const result = evaluate(parsedData);
    consoleEl.textContent = result; // Output result to console
    drawOutput(parsedData, output);
  } catch (error) {
    consoleEl.classList.add("error");
    consoleEl.textContent = error.message; // Output error to console
  }
}

function drawOutput(parsedData, output) {
  output.innerHTML = ""; // Clear previous drawings
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  output.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  drawStructure(parsedData, ctx, 350, 250, 200);
}

function drawStructure(node, ctx, x, y, size) {
  let img = new Image();
  img.onload = function () {
    // Draw the original image
    ctx.drawImage(img, x, y, size, size);

    if (node.clause) {
      // Calculate new size based on whether the shape is inner or outer
      let newSize = node.relative == "inner" ? size * 0.75 : size * 1.25;

      // Calculate the center of the original image
      let centerX = x + size / 2;
      let centerY = y + size / 2;

      // Calculate new x and y positions to keep the new image centered
      let newX = centerX - newSize / 2;
      let newY = centerY - newSize / 2;

      // Recursive call to draw the next structure
      drawStructure(node.clause, ctx, newX, newY, newSize);
    }
  };
  img.src = node.creature + ".png";
  img.onerror = function () {
    console.error("Failed to load image:", node.creature + ".png");
  };
}
