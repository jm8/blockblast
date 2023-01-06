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

colors = {
  1: [255, 0, 0],
  2: [0, 0, 255],
};

const cellsForShapeId = [
  [[0, 0], [0, 1], [1, 0], [1, 1]],
]

const drawGridCell = (row, col, color, transparent = false) => {
  if (color == 0) { noFill(); } else {
    const [r, g, b] = colors[color];
    fill(r, g, b, transparent ? 200 : 255);
  }
  stroke(200);
  strokeWeight(gridWeight);
  rect(gridX + col * (cellSize), gridY + row * (cellSize), cellSize, cellSize);
}

const getPieceSize = (shapeId) => {
  let pieceWidth = 0, pieceHeight = 0;
  for (const [row, col] of cellsForShapeId[shapeId]) {
    pieceWidth = Math.max(pieceWidth, row + 1);
    pieceHeight = Math.max(pieceHeight, col + 1);
  }
  return [pieceWidth, pieceHeight];
}

const drawPiece = (shapeId, color) => {
  const [r, g, b] = colors[color];
  fill(r, g, b);
  stroke(200);
  strokeWeight(gridWeight);

  const [pieceWidth, pieceHeight] = getPieceSize(shapeId);
  let x = -(pieceWidth * cellSize) / 2;
  let y = -(pieceHeight * cellSize) / 2;

  for (const [row, col] of cellsForShapeId[shapeId]) {
    rect(x + col * (cellSize), y + row * (cellSize), cellSize, cellSize);
  }
}

const getHoveredCells = (shapeId, x, y) => {
  const [pieceWidth, pieceHeight] = getPieceSize(shapeId);
  const tlx = x - (pieceWidth * cellSize) / 2;
  const tly = y - (pieceHeight * cellSize) / 2;
  const row = Math.floor((tly - gridY + cellSize / 2) / cellSize);
  const col = Math.floor((tlx - gridX + cellSize / 2) / cellSize);

  return cellsForShapeId[shapeId].map((([drow, dcol]) => [row + drow, col + dcol]));
}

const isEmptyCell = (row, col) => {
  if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;
  return board[row][col] == 0;
}

const allEmptyCells = (list) => {
  for (const [row, col] of list) {
    if (!isEmptyCell(row, col)) return false;
  }
  return true;
}

let activeOption = null;
const optionDx = 100;
const optionXs = [windowWidth / 2 - optionDx, windowWidth / 2, windowWidth / 2 + optionDx];
const optionsY = windowHeight - 80;

const pieceOptions = [
  {
    shapeId: 0,
    color: 1,
    used: false,
  },
  {
    shapeId: 0,
    color: 2,
    used: false,
  },
  {
    shapeId: 0,
    color: 1,
    used: false,
  }
];

const update = () => {
  if (activeOption !== null && !mouseIsPressed) {
    const hoveredCells = getHoveredCells(0, mouseX, mouseY);
    if (allEmptyCells(hoveredCells)) {
      for (const [row, col] of hoveredCells) {
        board[row][col] = pieceOptions[activeOption].color;
      }
      pieceOptions[activeOption].used = true;
    }
    activeOption = null;
  } else if (activeOption === null && mouseIsPressed) {
    for (let i = 0; i < pieceOptions.length; i++) {
      if (Math.abs(mouseX - optionXs[i]) < optionDx / 2
        && Math.abs(mouseY - optionsY) < 50
        && !pieceOptions[i].used) {
        activeOption = i;
      }
    }
  }
}

draw = () => {
  update();
  background(15);

  // stroke(200);
  // strokeWeight(gridSep);
  // rect(gridX - gridSep, gridY - gridSep, (gridSize + gridSep) * 8 + gridSep, (gridSize + gridSep) * 8 + gridSep);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      drawGridCell(i, j, board[i][j]);
    }
  }

  if (activeOption !== null) {
    const hoveredCells = getHoveredCells(0, mouseX, mouseY);
    if (allEmptyCells(hoveredCells)) {
      for (const [row, col] of hoveredCells) {
        drawGridCell(row, col, pieceOptions[activeOption].color, true);
      }
    }
    push();
    translate(mouseX, mouseY);
    drawPiece(pieceOptions[activeOption].shapeId, pieceOptions[activeOption].color);
    pop();
  }

  for (let i = 0; i < pieceOptions.length; i++) {
    push();
    if (i !== activeOption && !pieceOptions[i].used) {
      translate(optionXs[i], optionsY);
      scale(0.5);
      drawPiece(pieceOptions[i].shapeId, pieceOptions[i].color);
    }
    pop();
  }
}
