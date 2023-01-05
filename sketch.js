let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let canvas;

setup = () => {
  canvas = createCanvas(windowWidth, windowHeight);
}

const cellSize = 40;
const gridSize = cellSize * 8;
const gridWeight = 2;
const gridX = (windowWidth - gridSize) / 2;
const gridY = 20;

const board = [];
for (let i = 0; i < 8; i++) {
  board.push([]);
  for (let j = 0; j < 8; j++) {
    board[i].push(0);
  }
}
board[0][0] = 2;

colors = {
  1: [255, 0, 0],
  2: [0, 0, 255],
};

const pieces = [
  [[0, 0], [0, 1], [1, 0], [1, 1]],
]



const drawGridCell = (row, col, spot) => {
  if (spot == 0) { noFill(); } else {
    const [r, g, b] = colors[spot];
    fill(r, g, b);
  }
  stroke(200);
  strokeWeight(gridWeight);
  rect(gridX + col * (cellSize), gridY + row * (cellSize), cellSize, cellSize);
}

const drawPiece = (piece, color) => {
  const [r, g, b] = colors[color];
  fill(r, g, b);
  stroke(200);
  strokeWeight(gridWeight);

  let pieceWidth = 0, pieceHeight = 0;
  for (const [row, col] of pieces[piece]) {
    pieceWidth = Math.max(pieceWidth, row + 1);
    pieceHeight = Math.max(pieceHeight, col + 1);
  }
  let x = -(pieceWidth * cellSize) / 2;
  let y = -(pieceHeight * cellSize) / 2;
  for (const [row, col] of pieces[piece]) {
    rect(x + col * (cellSize), y + row * (cellSize), cellSize, cellSize);
  }
}

let isActive = false;
const inactivePieceX = windowWidth / 2;
const inactivePieceY = windowHeight - 80;

update = () => {
  if (isActive && !mouseIsPressed) {
    isActive = false;
  } else if (!isActive && mouseIsPressed) {
    isActive = true;
  }
}

draw = () => {
  background(15);

  // stroke(200);
  // strokeWeight(gridSep);
  // rect(gridX - gridSep, gridY - gridSep, (gridSize + gridSep) * 8 + gridSep, (gridSize + gridSep) * 8 + gridSep);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      drawGridCell(i, j, board[i][j]);
    }
  }

  push();
  if (mouseIsPressed) {
    translate(mouseX, mouseY);
    drawPiece(0, 1);
  } else {
    translate(inactivePieceX, inactivePieceY);
    scale(0.5);
    drawPiece(0, 1);
  }
  pop();
}
