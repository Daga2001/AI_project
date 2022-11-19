// Amplitude

//====================================================================================
// DECLARATION OF VARIABLES
/**
 * 0 <- empty field
 * 1 <- wall
 * 2 <- mario's starting point 
 * 3 <- star
 * 4 <- flame flower
 * 5 <- koopa (bowser)
 * 6 <- princess
 */
//====================================================================================

let world = window.localStorage["world"];
let initWorld = window.localStorage["world"];
world = world.split(",")
initWorld = initWorld.split(",")
let worldTmp = [];
let row = [];
let c = 0

for (let y = 0; y < 10; y++) {
    row = [];
    for ( let x = 0; x < 10; x++) {
        row[x] = world[c]
        c++;
    }
    worldTmp[y] = row
}

world = deep_copy(worldTmp);
initWorld = deep_copy(worldTmp);

let makeshiftWorld = [];

let sol = [];

let pos_x_mario;
let pos_y_mario;

let pos_x_princ;
let pos_y_princ;

let worlds = [];
let operator = [];
let depth = 0;
let expandedNodes = -1;
let queue = [];
let win = false;

//----------------------------------------------------------------

/**
 * Class node
 * @param {matix} map
 * @param {Node} father
 * @param {string} operator
 * @param {int} pos_x_mario
 * @param {int} pos_y_mario
 */
class Node {

  constructor(map, father, operator, costo, pos_x_mario, pos_y_mario) {
    this.map = map;
    this.father = father;
    this.operator = operator;
    this.costo = costo;
    this.pos_x_mario = pos_x_mario;
    this.pos_y_mario = pos_y_mario;
  }

  // Methods
  showMap() {
    // console.log(this.map);
    return this.map;
  }

  showFather() {
    // console.log(this.father);
    return this.father;
  }

  showOperator() {
    // console.log(this.operator);
    return this.operator;
  }

  showCosto() {
    // console.log(this.costo);
    return this.costo;
  }

  showPosXMario() {
    // console.log(this.pos_x_mario);
    return this.pos_x_mario;
  }

  showPosYMario() {
    // console.log(this.pos_y_mario);
    return this.pos_y_mario;
  }

}

//----------------------------------------------------------------

/**
 * Makes a deep copy of an object. 
 * A deep copy of an object is a copy whose properties do not share the same references.
 * @param {*} object 
 * @returns 
 */

function deep_copy(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Find the position of Mario and the princess in an array
 */
function findPositionMario(map) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map.length; col++) {
      if (map[row][col] == 2) {
        pos_x_mario = row;
        pos_y_mario = col;
      }
    }
  }
}

function findPositionPrincess() {
  for (let row = 0; row < world.length; row++) {
    for (let col = 0; col < world.length; col++) {
      if (world[row][col] == 6) {
        pos_x_princ = row;
        pos_y_princ = col;
      }
    }
  }
}

function findMarioPossibleMoves(map) {
  let moves = [];
  if ((pos_x_mario - 1) >= 0 && map[pos_x_mario - 1][pos_y_mario] != 1) {
    moves.push("up");
  }
  if ((pos_x_mario + 1) < map.length && map[pos_x_mario + 1][pos_y_mario] != 1) {
    moves.push("down");
  }
  if ((pos_y_mario - 1) >= 0 && map[pos_x_mario][pos_y_mario - 1] != 1) {
    moves.push("left");
  }
  if ((pos_y_mario + 1) < map.length && map[pos_x_mario][pos_y_mario + 1] != 1) {
    moves.push("right");
  }

  return moves;

}

function isGoal() {
  if (pos_x_mario == pos_x_princ && pos_y_mario == pos_y_princ) {
    return true;
  } else {
    return false;
  }
}

function moveMario(direction, map) {
  if (direction == "up") {
    map[pos_x_mario][pos_y_mario] = 0;
    pos_x_mario--;
    map[pos_x_mario][pos_y_mario] = 2;
  } else if (direction == "down") {
    map[pos_x_mario][pos_y_mario] = 0;
    pos_x_mario++;
    map[pos_x_mario][pos_y_mario] = 2;
  } else if (direction == "left") {
    map[pos_x_mario][pos_y_mario] = 0;
    pos_y_mario--;
    map[pos_x_mario][pos_y_mario] = 2;
  } else if (direction == "right") {
    map[pos_x_mario][pos_y_mario] = 0;
    pos_y_mario++;
    map[pos_x_mario][pos_y_mario] = 2;
  }
  return map;
}

function contrary(direction) {
  let string;
  if (direction == "up") {
    string = "down";
  } else if (direction == "down") {
    string = "up";
  } else if (direction == "right") {
    string = "left";
  } else { // (direction == "left")
    string = "right";
  }
  return string;
}

function amplitude() {
  findPositionMario(world);
  findPositionPrincess();
  let principal = new Node(deep_copy(world), null, "start", null, pos_x_mario, pos_y_mario);
  queue.push(principal);
  while (queue.length > 0) {
    expandedNodes++;
    findPositionMario(queue[0].showMap());
    let moves = findMarioPossibleMoves(queue[0].showMap());
    if (queue[0].showFather() != null) {
      moves = moves.filter((item) => item !== contrary(queue[0].showOperator()));
    }
    if (isGoal()) {
      win = true;
      break;
    } else {
      depth++;
      for (let i = 0; i < moves.length; i++) {
        findPositionMario(queue[0].showMap());
        makeshiftWorld = deep_copy(queue[0].showMap());
        let map = moveMario(moves[i], makeshiftWorld);
        let newNode = new Node(deep_copy(map), queue[0], moves[i], null, pos_x_mario, pos_y_mario);
        queue.push(newNode);
        findPositionMario(makeshiftWorld);
      }
      queue.shift();
    }
  }

  let dad = queue[0];
  let word = null;

  while (true) {
    if (word == "start") {
      break;
    }
    sol.unshift(dad.showOperator());
    dad = dad.showFather();
    word = dad.showOperator();
  }

}

amplitude();
console.log(sol);