//====================================================================================
// LIBRARIES OR OTHER FUNCTIONS
//====================================================================================
import * as util from './utils.js'

//====================================================================================
// DECLARATION OF VARIABLES
//====================================================================================

//canvas -> game
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = 500
canvas.height = 500

//Restart button
const restartButton = document.getElementById('restart-game-btn');

//Dimensions
const squareSize = 50

//Sounds
let audioBackground = new Audio(`../sound/main-theme.mp3`)
let hereWeGo = new Audio(`../sound/here-we-go.mp3`)
let fire_ball = new Audio(`../sound/fire_ball_effect.mp3`)
let shell_stomp = new Audio(`../sound/shell_stomp_effect.mp3`)

//world
/**
 * 0 <- empty field
 * 1 <- wall
 * 2 <- mario's starting point 
 * 3 <- star
 * 4 <- flame flower
 * 5 <- koopa (bowser)
 * 6 <- princess
 */

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

world = util.deep_copy(worldTmp);
initWorld = util.deep_copy(worldTmp);

// Mario's stats
let mario = {
    posx: 1,
    posy: 1,
    items: [],
    starTime: 0, // attribute used for measuring star's time
    // useful to identify when an item must be drawn after Mario gets into a cell.
    rejectedItem: []
}

let initMario = {
    posx: 1,
    posy: 1 ,
    items: [],
    starTime: 0, // attribute used for measuring star's time
    // useful to identify when an item must be drawn after Mario gets into a cell.
    rejectedItem: []
}

// Princess's stats
let princess = {
    posx: 0,
    posy: 0
}

// Statistics
let tree = { 
    queue: [{ parent: null, posx: mario.posx, posy: mario.posy, dir: null, val: null, g: 0, depth: 1, items: [], starTime: 0, rejectedItem: []}],
    expanded: [],
    depth: 1
};
let computingTime = 0;

// performance
let startTime = 0;
let endTime = 0;

// solution
let optSol = [];

// Tests
let sol = ["up","right","right","right","right","down","right","right","right","right","right","right",
           "down","down","down","down","left","left"]

//====================================================================================
// DECLARATION OF FUNCTIONS OR METHODS
//====================================================================================

/**
 * Abstracts all imposible movements from mario's position.
 * @param {Object} mario 
 * @param {Object} world
 * @returns List
 */

function impossibleMovements(mario, world) {
    let movements = [];
    if(mario.posx == 0) {
        movements.push("left");
    }
    if(mario.posx == world.length - 1) {
        movements.push("right");
    }
    if(mario.posy == 0) {
        movements.push("up");
    }
    if(mario.posy == world.length - 1) {
        movements.push("down");
    }
    if (!(mario.posx == 0)) {
        if(world[mario.posy][mario.posx-1] == 1) {
            movements.push("left");
        }
    }
    if(!(mario.posx == world.length - 1)) {
        if(world[mario.posy][mario.posx+1] == 1) {
            movements.push("right");
        }
    }
    if(!(mario.posy == 0)) {
        if(world[mario.posy-1][mario.posx] == 1) {
            movements.push("up");
        }
    }
    if(!(mario.posy == world.length - 1)) {
        if(world[mario.posy+1][mario.posx] == 1) {
            movements.push("down");
        }
    }
    return movements;
}

/**
 * Displays a square with a defined color.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {String} color 
 */

function paintSquare(x,y,width,height,color) {
    ctx.fillStyle = color           //color of fill
    ctx.strokeStyle = "black"            //border's color
    ctx.lineWidth = "2"                //border's width
    ctx.fillRect(x,y,width,height)      //create rectangle
    ctx.strokeRect(x,y,width,height)    //create rectangle's borders
}

/**
 * Draws an image in canvas with a given source, which means the pic's name.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} source 
 */

function showImage(x,y,width,height,source) {
    let img = new Image()
    img.src = `../images/${source}.png`
    img.onload = function() {
        ctx.drawImage(img,x,y,width,height)
    }
}

/**
 * Draws and paints all the magnificence of the mario's world.
 * @param {Object} world 
 * @returns
 */

function paintWorld(world) {
    for (let y = 0; y < world.length; y++){
        for (let x = 0; x < world[y].length; x++){
            if (world[y][x] == 0){
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"white")     
            }
            else if (world[y][x] == 1){
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"brown")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"wall")
            }
            else if (world[y][x] == 2){
                mario.posx = x
                mario.posy = y
                paintMario(mario)
            }
            else if (world[y][x] == 3){
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"yellow")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"star")
            }
            else if (world[y][x] == 4){  
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"orange")     
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"fire-flower")
            }
            else if (world[y][x] == 5){
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"green")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"bowser")
            }
            else if (world[y][x] == 6){
                princess.posx = x;
                princess.posy = y;
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"pink")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"peach")
            }
            else {
                throw `There's an invalid item in world's array: ${world[y][x]} at (${x+1},${y+1})`
            }
        }
    }
}

/**
 * Draws Mr. Mario with its current position.
 * @param {Object} mario 
 * @param {Object} status - if mario is in ssj mode, type "ssj" otherwise just write "normal" 
 */

function paintMario(mario, status) {
    if(status == "ssj") {
        paintSquare(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"#FFD208")
        showImage(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"Super_Star_Mario")
    }
    else if(status == "fire-mario") {
        paintSquare(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"#fa4b2a")
        showImage(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"Fire_Mario")
    }
    else {
        paintSquare(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"#fa4b2a")
        showImage(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"mario")
    }
}

/**
 * Paints an item like a flower or a star
 * @param {String} name
 * @param {String} color
 */
function paintItem(x, y, name, color) {
    paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,color)
    showImage(x*squareSize,y*squareSize,squareSize,squareSize,name)
}

/**
 * Manages items in world according to the parameter marioVal.
 * @param {Object} mario it can be an object too.
 * @param {Number} marioVal means the value of cell in the direction to move, i.e. mario[y][x+1] can be a marioVal pointing to right hand.
 * @param {Boolean} soundActivated this variable is to say if you want to hear sound or not.
 */
function manageItems(mario, node, dir, soundActivated) {
    /**
     * Deletes a star or flower
     */
    let removeItem = function() {
        if(dir == "up") {
            node[mario.posy-1][mario.posx] = "0";
        }
        else if(dir == "down") {
            node[mario.posy+1][mario.posx] = "0";
        }
        else if(dir == "left") {
            node[mario.posy][mario.posx-1] = "0";
        }
        else if(dir == "right") {
            node[mario.posy][mario.posx+1] = "0";
        }
    }
    let marioVal = 0;
    if(dir == "up") {
        marioVal = node[mario.posy-1][mario.posx]
    }
    else if(dir == "down") {
        marioVal = node[mario.posy+1][mario.posx]
    }
    else if(dir == "left") {
        marioVal = node[mario.posy][mario.posx-1]
    }
    else if(dir == "right") {
        marioVal = node[mario.posy][mario.posx+1]
    }
    // decreases star time
    if(mario.starTime > 0)  {
        mario.starTime -= 1;
        if(mario.starTime == 0) {
            if(soundActivated && !audioBackground.src == `../sound/main-theme.mp3`) {
                audioBackground.pause()
                audioBackground.src = `../sound/main-theme.mp3`
                audioBackground.currentTime = 0
                audioBackground.loop = true
                audioBackground.play()
            }
        }
    }
    // when mario spends an item
    // star
    if(mario.items.includes("star") && mario.starTime % 6 == 0){ 
        mario.items.pop()
    }
    // flower
    if(marioVal == 5 && mario.items.includes("flower")) {
        fire_ball.currentTime = 0
        fire_ball.play()
        mario.items.pop()
    }
    // when mario picks an item
    // star
    if(marioVal == 3) {
        if(mario.items.includes("star") || mario.items.length == 0) {
            if(soundActivated && !audioBackground.src.includes(`Super_Mario.mp3`)) {
                audioBackground.pause()
                audioBackground.src = `../sound/Super_Mario.mp3`
                audioBackground.currentTime = 0
                audioBackground.loop = true
                audioBackground.play()
            }
            removeItem();
            mario.items.push("star");
            mario.starTime += 6;
        }
        else {
            mario.rejectedItem.push(3);
        }
    }
    // flower
    if(marioVal == 4) {
        if(mario.items.includes("flower") || mario.items.length == 0) {
            removeItem();
            mario.items.push("flower");
        }
        else {
            mario.rejectedItem.push(4);
        }
    }
}

/**
 * Turns mario in a given direction and paints him.
 * @param {String} dir: "up", "down", "left", "right"
 */

function moveMario(dir) {
    /**
     * Detects when mario meets a koopa and plays sounds effects
     * @param {Number} marioVal means the value of cell in the direction to move, i.e. mario[y][x+1] can be a marioVal pointing to right hand
     */
    let manageKoopas = function(marioVal) {
        if(marioVal == 5) {
            if(mario.items.includes("star")) {
                shell_stomp.currentTime = 0
                shell_stomp.play()
            }
        }
    }
    /**
     * Mario can't hold a flower and a star at the same time. Therefore, we must to take
     * into account if the previous cell after mario gets into the next cell, will be either empty or with an item.
     */
    let movePreviousCell = function() {
        // Setting the previous Item
        if(mario.rejectedItem.length > 0) {
            let name = "";
            let color = "";
            if(mario.rejectedItem[0] == 3) {
                name = "star";
                color = "yellow";
            }
            else if(mario.rejectedItem[0] == 4) {
                name = "fire-flower";
                color = "orange";
            }
            paintItem(mario.posx, mario.posy, name, color)
            world[mario.posy][mario.posx] = mario.rejectedItem[0].toString();
            mario.rejectedItem.pop();
        }
        else {
            mario.recentlyRejected = false;
            paintSquare(mario.posx*squareSize,mario.posy*squareSize,squareSize,squareSize,"white");
            world[mario.posy][mario.posx] = "0";
        }
    }
    /**
     * Draws the mario's shape according to his status
     */
    let drawMario = function() {
        if(mario.items.includes("star")) {
            paintMario(mario,"ssj")
        }
        else if(mario.items.includes("flower")) {
            paintMario(mario,"fire-mario")
        }
        else {
            paintMario(mario,"normal")
        }
    }
    // Logic
    let impossiblesM = impossibleMovements(mario, world);
    if(dir == "up" && !impossiblesM.includes("up")) {
        movePreviousCell(world[mario.posy-1][mario.posx])
        manageItems(mario, world, "up", true)
        manageKoopas(world[mario.posy-1][mario.posx])
        world[mario.posy-1][mario.posx] = "2";
        mario.posy -= 1;
        drawMario()
    }
    if(dir == "down" && !impossiblesM.includes("down")) {
        movePreviousCell(world[mario.posy+1][mario.posx])
        manageItems(mario, world, "down", true)
        manageKoopas(world[mario.posy+1][mario.posx])
        world[mario.posy+1][mario.posx] = "2";
        mario.posy += 1;
        drawMario()
    }
    if(dir == "left" && !impossiblesM.includes("left")) {
        movePreviousCell(world[mario.posy][mario.posx-1])
        manageItems(mario, world, "left", true)
        manageKoopas(world[mario.posy][mario.posx-1])
        world[mario.posy][mario.posx-1] = "2";
        mario.posx -= 1;
        drawMario()
    }
    if(dir == "right" && !impossiblesM.includes("right")) {
        movePreviousCell(world[mario.posy][mario.posx+1])
        manageItems(mario, world, "right", true)
        manageKoopas(world[mario.posy][mario.posx+1])
        world[mario.posy][mario.posx+1] = "2";
        mario.posx += 1;
        drawMario()
    }
}

/**
 * Ends with all the mario's world, when mario losses or wins.
 */

function endGame() {
    computingTime = Math.abs(endTime-startTime);
    // hide container and show the end screen.
    let endScreen = document.getElementById('end-screen');
    let container = document.getElementById('container');
    endScreen.style.display = `flex`;
    container.style.display = `none`;
    // show the statistics too.
    document.getElementById("expanded_nodes").textContent = `${tree.expanded.length}`;
    document.getElementById("tree_depth").textContent = `${tree.depth}`;
    document.getElementById("computing_time").textContent = `${util.truncateDecimals(computingTime,4)} ms`;
}

/**
 * Restarts the mario's game with the same world.
 */

function restartGame() {
    world = util.deep_copy(initWorld);
    mario = util.deep_copy(initMario);
    tree = { 
        queue: [{ parent: null, posx: null, posy: null, dir: null, val: null, g: 0, depth: 1, items: [], starTime: 0, rejectedItem: []}],
        expanded: [],
        depth: 1
    };
    computingTime = 0;
    
    paintWorld(world);
    let endScreen = document.getElementById('end-screen');
    let container = document.getElementById('container');
    endScreen.style.display = `none`;
    container.style.display = `flex`;

    audioBackground.pause()
    audioBackground.src = `../sound/main-theme.mp3`
    audioBackground.currentTime = 0
    audioBackground.loop = true
    audioBackground.play()

    startTime = performance.now()
    sol = starAlgorithm(util.deep_copy(mario), util.deep_copy(world), null);
    endTime = performance.now()
    sol = util.convertSolutionToList(sol);

    let intervalID = setInterval(() => {
        nextMovement(sol)
        if(mario.posx == princess.posx && mario.posy == princess.posy) {
            clearInterval(intervalID);
            endGame();
        }
    }, 1000) 
}

/**
 * Performs the next mario's movement.
 * @param {Object} mario 
 * @param {List} sol 
 */

function nextMovement(sol) {
    let nextMov = sol.shift()
    moveMario(nextMov)
}

/**
 * Determines expanded nodes, tree depth and solution of avara's algorithm.
 * @param {Object} node the world
 * @param {Number} prevDir previous direction
 */

function avaraAlgorithm(node, prevDir) {
    // Let's determine all posible heuristics
    let impossiblesM = impossibleMovements(mario, node);
    let heuristics = []
    // up
    if(!impossiblesM.includes("up") && prevDir != "down") {
        let marioCopy = util.deep_copy(mario);
        marioCopy.posy -= 1;
        let heuristic = util.manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"up", h:heuristic })
    }
    // down
    if(!impossiblesM.includes("down") && prevDir != "up") {
        let marioCopy = util.deep_copy(mario);
        marioCopy.posy += 1;
        let heuristic = util.manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"down", h:heuristic })
    }
    // left
    if(!impossiblesM.includes("left") && prevDir != "right") {
        let marioCopy = util.deep_copy(mario);
        marioCopy.posx -= 1;
        let heuristic = util.manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"left", h:heuristic })
    }
    // right
    if(!impossiblesM.includes("right") && prevDir != "left") {
        let marioCopy = util.deep_copy(mario);
        marioCopy.posx += 1;
        let heuristic = util.manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"right", h:heuristic })
    }
    // calculates the minimum heuristic and expand the tree
    let min = heuristics[0];
    for (let i = 0; i < heuristics.length; i++) {
        if(min.h > heuristics[i].h) {
            min = heuristics[i]
        }
    }
    expandedNodes.push(min.dir);
    treeDepth += 1;
    moveMario(min.dir);
    // console.log(mario)
    // console.log(heuristics)
    // console.log(`dir: ${min.dir}, h: ${min.h}, prevDir: ${prevDir}`)
}

/**
 * Determines expanded nodes, tree depth and solution of star's algorithm.
 * @param {Object} mario
 * @param {Number} prevDir previous direction
 */

function starAlgorithm(mario, node, prevDir) {
    // ==============================================================
    // Variables and functions
    // ==============================================================
    let impossiblesM = impossibleMovements(mario, node);
    /**
     * Calculates the minimum weight of a tree's queue.
     * @param {List} queue 
     * @returns Node
     */
    let minimum = function (queue) {
        let mini = 0;
        for(let i = 1; i < queue.length; i++) {
            let h1 = 0;
            let h2 = 0;
            if(queue[i].g + h1 < queue[mini].g + h2) {
                mini = i;
            }
        }
        return queue.splice(mini,1)[0];
    }
    /**
     * Checks if there's a start or flower right after mario's position to take it. Allowing him
     * to return whenever he wants.
     * @param {Object} node 
     * @param {Object} mario 
     * @param {String} dir
     * @param {Object} parent (optional): a parent node to check if mario picked a star or not.
     * @returns boolean
     */
    let checkIfItem = function (node, mario, dir, parent) {
        prevDir = mario.dir
        // Checks if mario picked an item righ before this movement.
        if(parent != null) {
            if(mario.items.length != parent.items.length) {
                prevDir = null;
                return 0;
            }
        }
        // up
        if(mario.posy > 0) {
            if(node[mario.posy-1][mario.posx] == 3 && dir == "up") {
                prevDir = null;
                return 0;
            }
            if(node[mario.posy-1][mario.posx] == 4 && dir == "up") {
                prevDir = null;
                return 0;
            }
        }
        // down
        if(mario.posy < node.length) {
            if(node[mario.posy+1][mario.posx] == 3 && dir == "down") {
                prevDir = null;
                return 0;
            }
            if(node[mario.posy+1][mario.posx] == 4 && dir == "down") {
                prevDir = null;
                return 0;
            }
        }
        // left
        if(mario.posx > 0) {
            if(node[mario.posy][mario.posx-1] == 3 && dir == "left") {
                prevDir = null;
                return 0;
            }
            else if(node[mario.posy][mario.posx-1] == 4 && dir == "left") {
                prevDir = null;
                return 0;
            }
        }
        // right
        if(mario.posx < node.length) {
            if(node[mario.posy][mario.posx+1] == 3 && dir == "right") {
                prevDir = null;
                return 0;
            }   
            else if(node[mario.posy][mario.posx+1] == 4 && dir == "right") {
                prevDir = null;
                return 0;
            }   
        }
    }
    /**
     * Determines the cost of the movement.
     * @param {Number} valDir - value of cell where mario's gonna stay.
     * @returns Cost
     */
    let g = function (node, valDir) {
        if(node.items.includes("star")) {
            return 1/2;
        }
        if(node.items.includes("flower")) {
            return 1;
        }
        else {
            if(valDir == 3 || valDir == 4 || valDir == 0 || valDir == 6 || valDir == 2) {
                return 1;
            }
            if(valDir == 5) {
                return 6;
            }
        }
    }
    // ==============================================================
    // Body
    // ==============================================================
    // --------------------------------------------------------------
    // starting up with inital values
    // --------------------------------------------------------------
    // up
    checkIfItem(node, mario, "up");
    if(!impossiblesM.includes("up") && prevDir != "down") {
        let marioCopy = util.deep_copy(mario);
        let nodeCopy = util.deep_copy(node);
        manageItems(marioCopy, nodeCopy, "up", false);
        let object = { 
            parent: tree.queue[0],
            posx: marioCopy.posx, 
            posy: marioCopy.posy-1,
            dir: "up", 
            val: node[marioCopy.posy-1][marioCopy.posx],
            g: tree.queue[0].g + g(mario, node[marioCopy.posy-1][marioCopy.posx]), 
            depth: tree.queue[0].depth + 1,
            items: marioCopy.items, 
            starTime: marioCopy.starTime, 
            rejectedItem: marioCopy.rejectedItem,
            currentNode: nodeCopy
        }        
        tree.queue.push(object);
    }
    // down
    checkIfItem(node, mario, "down");
    if(!impossiblesM.includes("down") && prevDir != "up") {
        let marioCopy = util.deep_copy(mario);
        let nodeCopy = util.deep_copy(node);
        manageItems(marioCopy, nodeCopy, "down", false);
        let object = { 
            parent: tree.queue[0], 
            posx: marioCopy.posx, 
            posy: marioCopy.posy+1,
            dir: "down", 
            val: node[marioCopy.posy+1][marioCopy.posx], 
            g: tree.queue[0].g + g(mario, node[marioCopy.posy+1][marioCopy.posx]), 
            depth: tree.queue[0].depth + 1,
            items: marioCopy.items, 
            starTime: marioCopy.starTime, 
            rejectedItem: marioCopy.rejectedItem,
            currentNode: nodeCopy
        }
        tree.queue.push(object);
    }
    // left
    checkIfItem(node, mario, "left");
    if(!impossiblesM.includes("left") && prevDir != "right") {
        let marioCopy = util.deep_copy(mario);
        let nodeCopy = util.deep_copy(node);
        manageItems(marioCopy, nodeCopy, "left", false);
        let object = { 
            parent: tree.queue[0], 
            posx: marioCopy.posx-1, 
            posy: marioCopy.posy,
            dir: "left", 
            val: node[marioCopy.posy][marioCopy.posx-1],
            g: tree.queue[0].g + g(mario, node[marioCopy.posy][marioCopy.posx-1]), 
            depth: tree.queue[0].depth + 1,
            items: marioCopy.items, 
            starTime: marioCopy.starTime, 
            rejectedItem: marioCopy.rejectedItem,
            currentNode: nodeCopy
        }
        tree.queue.push(object);
    }
    // right
    checkIfItem(node, mario, "right");
    if(!impossiblesM.includes("right") && prevDir != "left") {
        let marioCopy = util.deep_copy(mario);
        let nodeCopy = util.deep_copy(node);
        manageItems(marioCopy, nodeCopy, "right", false);
        let object = { 
            parent: tree.queue[0], 
            posx: marioCopy.posx+1, 
            posy: marioCopy.posy,
            dir: "right", 
            val: node[marioCopy.posy][marioCopy.posx+1],
            g: tree.queue[0].g + g(mario, node[marioCopy.posy][marioCopy.posx+1]), 
            depth: tree.queue[0].depth + 1,
            items: marioCopy.items, 
            starTime: marioCopy.starTime, 
            rejectedItem: marioCopy.rejectedItem,
            currentNode: nodeCopy
        }
        tree.queue.push(object);
    }
    let expandedN = tree.queue.shift();
    tree.expanded.push(expandedN);
    // increases the depth
    if(tree.depth < tree.queue[0].depth){
        tree.depth = tree.queue[0].depth;
    }
    // --------------------------------------------------------------
    // loop to extend nodes
    // --------------------------------------------------------------
    let c = 0;
     while(true) {
        c++;
        let parentNode = minimum(tree.queue)
        impossiblesM = impossibleMovements(parentNode, parentNode.currentNode);
        if(parentNode.val == "6")  {
            return parentNode;
        }
        // up
        checkIfItem(parentNode.currentNode, parentNode, "up", parentNode.parent);
        if(!impossiblesM.includes("up") && prevDir != "down") {
            let parentNodeCopy = util.deep_copy(parentNode);
            let nodeCopy = util.deep_copy(parentNode.currentNode);
            manageItems(parentNodeCopy, nodeCopy, "up", false);
            let object = { 
                parent: util.deep_copy(parentNode), 
                posx: parentNodeCopy.posx, 
                posy: parentNodeCopy.posy-1,
                dir: "up", 
                val: parentNode.currentNode[parentNodeCopy.posy-1][parentNodeCopy.posx],
                g: parentNodeCopy.g + g(parentNode, parentNode.currentNode[parentNodeCopy.posy-1][parentNodeCopy.posx]), 
                depth: parentNodeCopy.depth + 1,
                items: parentNodeCopy.items, 
                starTime: parentNodeCopy.starTime, 
                rejectedItem: parentNodeCopy.rejectedItem,
                currentNode: nodeCopy
            }
            tree.queue.push(object);
        }
        // down
        checkIfItem(parentNode.currentNode, parentNode, "down", parentNode.parent);
        if(!impossiblesM.includes("down") && prevDir != "up") {
            let parentNodeCopy = util.deep_copy(parentNode);
            let nodeCopy = util.deep_copy(parentNode.currentNode);
            manageItems(parentNodeCopy, nodeCopy, "down", false);
            let object = { 
                parent: util.deep_copy(parentNode), 
                posx: parentNodeCopy.posx, 
                posy: parentNodeCopy.posy+1,
                dir: "down", 
                val: parentNode.currentNode[parentNodeCopy.posy+1][parentNodeCopy.posx],
                g: parentNodeCopy.g + g(parentNode, parentNode.currentNode[parentNodeCopy.posy+1][parentNodeCopy.posx]), 
                depth: parentNodeCopy.depth + 1,
                items: parentNodeCopy.items, 
                starTime: parentNodeCopy.starTime, 
                rejectedItem: parentNodeCopy.rejectedItem,
                currentNode: nodeCopy
            }
            tree.queue.push(object);
        }
        // left
        checkIfItem(parentNode.currentNode, parentNode, "left", parentNode.parent);
        if(!impossiblesM.includes("left") && prevDir != "right") {
            let parentNodeCopy = util.deep_copy(parentNode);
            let nodeCopy = util.deep_copy(parentNode.currentNode);
            manageItems(parentNodeCopy, nodeCopy, "left", false);
            let object = { 
                parent: util.deep_copy(parentNode), 
                posx: parentNodeCopy.posx-1, 
                posy: parentNodeCopy.posy,
                dir: "left", 
                val: parentNode.currentNode[parentNodeCopy.posy][parentNodeCopy.posx-1],
                g: parentNodeCopy.g + g(parentNode, parentNode.currentNode[parentNodeCopy.posy][parentNodeCopy.posx-1]), 
                depth: parentNodeCopy.depth + 1,
                items: parentNodeCopy.items, 
                starTime: parentNodeCopy.starTime, 
                rejectedItem: parentNodeCopy.rejectedItem,
                currentNode: nodeCopy
            }
            tree.queue.push(object);
        }
        // right
        checkIfItem(parentNode.currentNode, parentNode, "right", parentNode.parent);
        if(!impossiblesM.includes("right") && prevDir != "left") {
            let parentNodeCopy = util.deep_copy(parentNode);
            let nodeCopy = util.deep_copy(parentNode.currentNode);
            manageItems(parentNodeCopy, nodeCopy, "right", false);
            let object = { 
                parent: util.deep_copy(parentNode),  
                posx: parentNodeCopy.posx+1, 
                posy: parentNodeCopy.posy,
                dir: "right", 
                val: parentNode.currentNode[parentNodeCopy.posy][parentNodeCopy.posx+1],
                g: parentNodeCopy.g + g(parentNode, parentNode.currentNode[parentNodeCopy.posy][parentNodeCopy.posx+1]), 
                depth: parentNodeCopy.depth + 1,
                items: parentNodeCopy.items, 
                starTime: parentNodeCopy.starTime, 
                rejectedItem: parentNodeCopy.rejectedItem,
                currentNode: nodeCopy
            }
            tree.queue.push(object);
        }
        tree.expanded.push(parentNode)
        // increases the depth
        if(tree.depth < parentNode.depth){
            tree.depth = parentNode.depth;
        }
    }
}

//====================================================================================
// logical structure
//====================================================================================

try{
    // Plays the background music
    audioBackground.pause()
    audioBackground.currentTime = 0
    audioBackground.loop = true
    audioBackground.play()
    hereWeGo.currentTime = 0
    hereWeGo.play()

    // The world is painted at the beginning
    paintWorld(world)

    startTime = performance.now()
    sol = starAlgorithm(util.deep_copy(mario), util.deep_copy(world), null);
    endTime = performance.now()
    sol = util.convertSolutionToList(sol);
    console.log(sol);
    console.log(tree);

    // When mario starts to move
    let intervalID = setInterval(() => {
        nextMovement(sol)
        if(mario.posx == princess.posx && mario.posy == princess.posy) {
            clearInterval(intervalID);
            endGame();
        }
    }, 1000) 

    // Button listener
    restartButton.addEventListener('mousedown', () => {
        restartGame();
    })
       
    // let intervalID = setInterval(() => {
    //     let prevDir = null
    //     if(expandedNodes.length > 0) {
    //         prevDir = expandedNodes[expandedNodes.length-1];
    //     }
    //     avaraAlgorithm(world,prevDir);
    //     if(mario.posx == princess.posx && mario.posy == princess.posy) {
    //         clearInterval(intervalID);
    //         endGame();
    //     }
    // }, 1000)    

    // // Key listener
    // document.body.addEventListener('keydown', ( event ) => {
    //     console.log(mario)
    //     if(event.key == "ArrowUp") {
    //         moveMario("up")
    //     }
    //     if(event.key == "ArrowDown") {
    //         moveMario("down")
    //     }
    //     if(event.key == "ArrowLeft") {
    //         moveMario("left")
    //     }
    //     if(event.key == "ArrowRight") {
    //         moveMario("right")
    //     }
    // })
}
catch(e) {
    console.error(`An error has occurred during game's execution: ${e}`);
}