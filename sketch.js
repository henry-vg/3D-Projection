const points = [],
  rotSpeed = 1,
  pers = 2; //0 for ortho
let angle = 0,
  sideLength;

function setup() {
  createCanvas(windowWidth, windowHeight);

  noFill();

  sideLength = min(width, height) / 2;

  points[0] = createVector(-0.5, -0.5, -0.5);
  points[1] = createVector(0.5, -0.5, -0.5);
  points[2] = createVector(0.5, 0.5, -0.5);
  points[3] = createVector(-0.5, 0.5, -0.5);
  points[4] = createVector(-0.5, -0.5, 0.5);
  points[5] = createVector(0.5, -0.5, 0.5);
  points[6] = createVector(0.5, 0.5, 0.5);
  points[7] = createVector(-0.5, 0.5, 0.5);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);

  const rotationZ = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1]
  ],
    rotationX = [
      [1, 0, 0],
      [0, cos(angle), -sin(angle)],
      [0, sin(angle), cos(angle)]
    ],
    rotationY = [
      [cos(angle), 0, sin(angle)],
      [0, 1, 0],
      [-sin(angle), 0, cos(angle)]
    ];

  let projected = [];

  stroke(255);
  strokeWeight(10);

  for (let i = 0; i < points.length; i++) {
    let rotated = multMatrix(rotationY, [[points[i].x], [points[i].y], [points[i].z]]);
    rotated = multMatrix(rotationX, rotated);
    rotated = multMatrix(rotationZ, rotated);

    const z = (pers == 0) ? 1 : 1 / (pers - rotated[2][0]),
      projection = [
        [z, 0, 0],
        [0, z, 0]
      ];

    projected[i] = multMatrix(projection, rotated);

    point(projected[i][0][0] * sideLength, projected[i][1][0] * sideLength);
  }

  stroke(255);
  strokeWeight(2);

  for (let i = 0; i < 4; i++) {
    line(projected[i][0][0] * sideLength, projected[i][1][0] * sideLength, projected[(i + 1) % 4][0][0] * sideLength, projected[(i + 1) % 4][1][0] * sideLength);
    line(projected[i + 4][0][0] * sideLength, projected[i + 4][1][0] * sideLength, projected[((i + 1) % 4) + 4][0][0] * sideLength, projected[((i + 1) % 4) + 4][1][0] * sideLength);
    line(projected[i][0][0] * sideLength, projected[i][1][0] * sideLength, projected[i + 4][0][0] * sideLength, projected[i + 4][1][0] * sideLength);
  }

  angle += rotSpeed * (PI / 180);
}

function multMatrix(a, b) {
  const colsA = a[0].length,
    rowsA = a.length,
    colsB = b[0].length,
    rowsB = b.length;

  if (colsA !== rowsB) {
    throw { name: "Error", message: "Columns of A must match rows of B." };
  }

  result = [];
  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}