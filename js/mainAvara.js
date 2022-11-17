//====================================================================================
// LIBRARIES OR OTHER FUNCTIONS
//====================================================================================
import { manhattanDist } from './utils.js'

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

world = deep_copy(worldTmp);
initWorld = deep_copy(worldTmp);

// Mario's stats
let mario = {
    posx: 0,
    posy: 0,
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
let expandedNodes = []
let treeDepth = 0;
let computingTime = 0;

// performance
let startTime = 0;
let endTime = 0;

// Tests
let sol = ["up","right","right","right","right","down","right","right","right","right","right","right",
           "down","down","down","down","left","left"]

//====================================================================================
// DECLARATION OF FUNCTIONS OR METHODS
//====================================================================================

/**
 * sleeps the program while is executing with a given delay in miliseconds.
 * @param {Number} delay 
 */

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

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
 * Turns mario in a given direction and paints him.
 * @param {String} dir: "up", "down", "left", "right"
 */

function moveMario(dir) {
    /**
     * Manages items in world according to the parameter marioVal.
     * @param {Number} marioVal means the value of cell in the direction to move, i.e. mario[y][x+1] can be a marioVal pointing to right hand
     */
    let manageItems = function(marioVal) {
        // decreases star time
        if(mario.starTime > 0)  {
            mario.starTime -= 1;
            if(mario.starTime == 0){
                audioBackground.src = `../sound/main-theme.mp3`
                audioBackground.currentTime = 0
                audioBackground.loop = true
                audioBackground.play()
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
                audioBackground.src = `../sound/Super_Mario.mp3`
                audioBackground.currentTime = 0
                audioBackground.loop = true
                audioBackground.play()
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
                mario.items.push("flower");
            }
            else {
                mario.rejectedItem.push(4);
            }
        }
    }
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
        manageItems(world[mario.posy-1][mario.posx])
        manageKoopas(world[mario.posy-1][mario.posx])
        world[mario.posy-1][mario.posx] = "2";
        mario.posy -= 1;
        drawMario()
    }
    if(dir == "down" && !impossiblesM.includes("down")) {
        movePreviousCell(world[mario.posy+1][mario.posx])
        manageItems(world[mario.posy+1][mario.posx])
        manageKoopas(world[mario.posy+1][mario.posx])
        world[mario.posy+1][mario.posx] = "2";
        mario.posy += 1;
        drawMario()
    }
    if(dir == "left" && !impossiblesM.includes("left")) {
        movePreviousCell(world[mario.posy][mario.posx-1])
        manageItems(world[mario.posy][mario.posx-1])
        manageKoopas(world[mario.posy][mario.posx-1])
        world[mario.posy][mario.posx-1] = "2";
        mario.posx -= 1;
        drawMario()
    }
    if(dir == "right" && !impossiblesM.includes("right")) {
        movePreviousCell(world[mario.posy][mario.posx+1])
        manageItems(world[mario.posy][mario.posx+1])
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
    endTime = performance.now()
    computingTime = Math.abs(endTime-startTime);
    // hide container and show the end screen.
    let endScreen = document.getElementById('end-screen');
    let container = document.getElementById('container');
    endScreen.style.display = `flex`;
    container.style.display = `none`;
    // show the statistics too.
    console.log(expandedNodes.length)
    console.log(treeDepth)
    console.log(computingTime)
    document.getElementById("expanded_nodes").textContent = `${expandedNodes.length-1}`;
    document.getElementById("tree_depth").textContent = `${treeDepth}`;
    document.getElementById("computing_time").textContent = `${Math.round(computingTime)}`;
}

/**
 * Restarts the mario's game with the same world.
 */

function restartGame() {
    world = deep_copy(initWorld);
    expandedNodes = []
    treeDepth = 0;
    computingTime = 0;
    
    paintWorld(world);
    let endScreen = document.getElementById('end-screen');
    let container = document.getElementById('container');
    endScreen.style.display = `none`;
    container.style.display = `flex`;

    startTime = performance.now()

    let intervalID = setInterval(() => {
        let prevDir = null
        if(expandedNodes.length > 0) {
            prevDir = expandedNodes[expandedNodes.length-1];
        }
        avaraAlgorithm(world,prevDir);
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
        let marioCopy = deep_copy(mario);
        marioCopy.posy -= 1;
        let heuristic = manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"up", h:heuristic })
    }
    // down
    if(!impossiblesM.includes("down") && prevDir != "up") {
        let marioCopy = deep_copy(mario);
        marioCopy.posy += 1;
        let heuristic = manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"down", h:heuristic })
    }
    // left
    if(!impossiblesM.includes("left") && prevDir != "right") {
        let marioCopy = deep_copy(mario);
        marioCopy.posx -= 1;
        let heuristic = manhattanDist(marioCopy, princess);
        heuristics.push({ dir:"left", h:heuristic })
    }
    // right
    if(!impossiblesM.includes("right") && prevDir != "left") {
        let marioCopy = deep_copy(mario);
        marioCopy.posx += 1;
        let heuristic = manhattanDist(marioCopy, princess);
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

//====================================================================================
// logical structure
//====================================================================================

try{
    // Plays the background music
    audioBackground.currentTime = 0
    audioBackground.loop = true
    audioBackground.play()
    hereWeGo.currentTime = 0
    hereWeGo.play()

    // The world is painted at the beginning
    paintWorld(world)

    startTime = performance.now()

    // When mario starts to move
    let intervalID = setInterval(() => {
        let prevDir = null
        if(expandedNodes.length > 0) {
            prevDir = expandedNodes[expandedNodes.length-1];
        }
        avaraAlgorithm(world,prevDir);
        if(mario.posx == princess.posx && mario.posy == princess.posy) {
            clearInterval(intervalID);
            endGame();
        }
    }, 1000)    

    // Button listener
    restartButton.addEventListener('mousedown', () => {
        restartGame();
    })

    // // Key listener
    // document.body.addEventListener('keydown', ( event ) => {
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