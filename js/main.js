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

//canvas
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = 800
canvas.height = 800

//Dimensions
const squareSize = 80

//Sounds
let audioBackground = new Audio(`../sound/main-theme.mp3`)
let hereWeGo = new Audio(`../sound/here-we-go.mp3`)

//world
var world = 
[
    [1,0,0,0,0,0,0,0,1,1],
    [0,3,1,1,0,1,1,0,0,1],
    [1,1,1,1,0,1,1,1,3,0],
    [0,0,0,0,0,1,1,1,1,0],
    [2,1,1,1,0,0,0,0,5,5],
    [0,0,0,1,0,1,1,1,1,5],
    [0,1,0,0,0,5,5,5,0,0],
    [0,1,1,0,1,1,1,1,1,0],
    [0,4,4,0,1,1,1,6,0,0],
    [1,1,1,1,1,1,1,0,1,1],
]

// Mario's stats
let mario = {
    posx: 0,
    posy: 0
}

//====================================================================================
// DECLARATION OF FUNCTIONS OR METHODS
//====================================================================================

/**
 * sleeps the program while is executing with a given delay in miliseconds
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
 * Displays a square with a defined color
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
 * Draws an image in canvas with a given source, which means the pic's name
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
 * Draws and paints all the magnificence of the mario's world
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
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"#fa4b2a")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"mario")
                mario.posx = x
                mario.posy = y
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
                paintSquare(x*squareSize,y*squareSize,squareSize,squareSize,"pink")
                showImage(x*squareSize,y*squareSize,squareSize,squareSize,"peach")
            }
            else {
                throw `There's an invalid item in world's array: ${world[y][x]} at (${x+1},${y+1})`
            }
        }
    }
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

    // Key listener
    document.body.addEventListener('keydown', ( event ) => {
        console.log(event.key)
        if(event.key == "ArrowUp") {
            
        }
        if(event.key == "ArrowDown") {

        }
        if(event.key == "ArrowLeft") {

        }
        if(event.key == "ArrowRight") {

        }
    })
}
catch(e) {
    console.error(`An error has occurred during game's execution: ${e}`);
}