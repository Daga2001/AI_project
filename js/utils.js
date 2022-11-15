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
