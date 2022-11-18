//====================================================================================
// This module is useful to declare and export generic functions
//====================================================================================

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
