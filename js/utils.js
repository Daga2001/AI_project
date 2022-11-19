//====================================================================================
// This module is useful to declare and export generic functions or classes
//====================================================================================

//------------------------------------------------------------------------------------
// Classes
//------------------------------------------------------------------------------------

/**
 * Class node
 * @param {matix} map
 * @param {Node} father
 * @param {string} operator
 * @param {int} pos_x_mario
 * @param {int} pos_y_mario
 */
 export class Node {

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

//------------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------------

/**
 * sleeps the program while is executing with a given delay in miliseconds.
 * @param {Number} delay 
 */

export function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

/**
 * Makes a deep copy of an object. 
 * A deep copy of an object is a copy whose properties do not share the same references.
 * @param {*} object 
 * @returns 
 */

export function deep_copy(object) {
    return JSON.parse(JSON.stringify(object));
}


/**
 * Calculates the manhattan distance between an object "a" regarding an object "b"
 * @param {Object} a {posx: ..., posy: ...} 
 * @param {Object} b {posx: ..., posy: ...}
 */

export function manhattanDist(a, b) {
    return Math.abs(a.posx-b.posx) + Math.abs(a.posy-b.posy);
}

/**
 * Converts the given solution in a list readable for mario to start moving.
 * @param {Object} sol 
 */
export function convertSolutionToList(sol) {
    let solution = [];
    let limit = sol.depth - 1
    for(let i = 0; i < limit; i++) {
        solution.push(sol.dir)
        sol = sol.parent;
    }
    return solution.reverse();
}

/**
 * Truncates a given number into a certain number of decimals, i.e. (1.4245, 2) -> 1.42
 * @param {*} n number 
 * @param {*} d number of decimals to truncate
 * @returns 
 */
export function truncateDecimals(n, d) {
    return Math.floor(n * Math.pow(10,d)) / Math.pow(10,d);
}