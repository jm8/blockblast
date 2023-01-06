let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let canvas;

const cellSize = 40;
const gridSize = cellSize * 8;
const gridWeight = 2;
const gridX = (windowWidth - gridSize) / 2;
const gridY = 20;

const board = [];
for (let i = 0; i < 8; i++) {
  board.push([]);
  for (let j = 0; j < 8; j++) {
    board[i].push(null);
  }
}

// Catppuccin

const bgColor = "#24273a";
const gridColor = "#cad3f5";

colors = [
  "#dc8a78",
  "#dd7878",
  "#ea76cb",
  "#8839ef",
  "#d20f39",
  "#e64553",
  "#fe640b",
  "#df8e1d",
  "#40a02b",
  "#179299",
  "#04a5e5",
  "#209fb5",
  "#1e66f5",
  "#7287fd",
];

const cellsForShapeId = [
  // SQUARES
  [[0, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  // 2x3
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
  // 3x2
  [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]],
  // Horizontal lines
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  // Vertical lines
  [[0, 0], [1, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  // Ts
  [[0, 0], [1, 0], [1, 1], [2, 0]],
  [[0, 1], [1, 1], [1, 0], [2, 1]],
  [[1, 0], [1, 1], [0, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [0, 2]],
  // Ls with 3 blocks
  [[1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [0, 1]],
  // Ls with 4 blocks
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[1, 0], [1, 1], [1, 2], [0, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0]],
  [[1, 0], [1, 1], [1, 2], [0, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 1], [2, 1], [2, 0]],
  [[0, 0], [1, 0], [2, 0], [0, 1]],
  [[0, 1], [1, 1], [2, 1], [0, 0]],
  // Ls with 5 blocks
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]],
  [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],

];

const pieceTypes = [
  // SQUARES
  [0, 1, 2],
  // RECTANGLES
  [3, 4],
  // Horizontal lines
  [5, 6, 7, 8],
  // Vertical linse
  [9, 10, 11, 12],
  // Ts
  [13, 14, 15, 16],
  // Ls with 3 blocks
  [17, 18, 19, 20],
  // Ls with 4 blocks
  [21, 22, 23, 24, 25, 26, 27, 28],
  // Ls with 5 blocks
  [29, 30, 31, 32]
];

const drawGridCell = (row, col, colorr, transparent = false) => {
  if (colorr === null) { noFill(); } else {
    let c = color(colorr);
    if (transparent) {
      c.setAlpha(200);
    }
    fill(c);
  }
  stroke(gridColor);
  strokeWeight(gridWeight);
  rect(gridX + col * (cellSize), gridY + row * (cellSize), cellSize, cellSize);
}

const getPieceSize = (shapeId) => {
  let pieceWidth = 0, pieceHeight = 0;
  for (const [row, col] of cellsForShapeId[shapeId]) {
    pieceWidth = Math.max(pieceWidth, col + 1);
    pieceHeight = Math.max(pieceHeight, row + 1);
  }
  return [pieceWidth, pieceHeight];
}

const drawPiece = (shapeId, color) => {
  fill(color);
  stroke(gridColor);
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
  return board[row][col] === null;
}

const allEmptyCells = (list) => {
  for (const [row, col] of list) {
    if (!isEmptyCell(row, col)) return false;
  }
  return true;
}

let activeOption = null;
const optionDx = 120;
const optionXs = [windowWidth / 2 - optionDx, windowWidth / 2, windowWidth / 2 + optionDx];
const optionsY = windowHeight - 80;

let colorIndex;
const randomPieceOption = () => {
  colorIndex += floor(random(4, 8));
  colorIndex %= colors.length;
  return {
    shapeId: random(random(pieceTypes)),
    color: colors[colorIndex],
    used: false,
  };
}

let pieceOptions;

setup = () => {
  canvas = createCanvas(windowWidth, windowHeight);
  colorIndex = floor(random(0, cellsForShapeId.length))
  pieceOptions = [
    randomPieceOption(),
    randomPieceOption(),
    randomPieceOption(),
  ];
}

const update = () => {
  if (activeOption !== null && !mouseIsPressed) {
    const hoveredCells = getHoveredCells(pieceOptions[activeOption].shapeId, mouseX, mouseY);
    if (allEmptyCells(hoveredCells)) {
      for (const [row, col] of hoveredCells) {
        board[row][col] = pieceOptions[activeOption].color
      }
      pieceOptions[activeOption].used = true;
    }
    activeOption = null;
    let allUsed = true;
    for (const pieceOption of pieceOptions) {
      if (!pieceOption.used) allUsed = false;
    }
    if (allUsed) {
      pieceOptions = [
        randomPieceOption(),
        randomPieceOption(),
        randomPieceOption(),
      ];
    }
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
  background(bgColor);

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      drawGridCell(i, j, board[i][j]);
    }
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

  if (activeOption !== null) {
    const hoveredCells = getHoveredCells(pieceOptions[activeOption].shapeId, mouseX, mouseY);
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

  stroke(gridColor);
}
