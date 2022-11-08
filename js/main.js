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

//Images
let wall_img = new Image();
wall_img.src = `../images/wall.png`;
let mario_img = new Image();
mario_img.src = `../images/mario.png`;
let star_img = new Image();
star_img.src = `../images/star.png`;
let flower_img = new Image();
flower_img.src = `../images/fire-flower.png`;
let bowser_img = new Image();
bowser_img.src = `../images/bowser.png`;
let princess_img = new Image();
princess_img.src = `../images/peach.png`;

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

//====================================================================================
// DECLARATION OF FUNCTIONS OR METHODS
//====================================================================================

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
 * Draws and paints all the magnificence of the mario's world
 * @param {Object} world 
 * @returns
 */

function paintWorld(world) {
    let xSquare = 0;      //initial x
    let ySquare = 0;      //initial y
    for (let y = 0; y < world.length; y++){
        xSquare = 0;
        for (let x = 0; x < world[y].length; x++){
            console.log(`x: ${x}, y: ${y}, world[y][x] ${world[y][x]}, xSquare: ${xSquare}, ySquare: ${wall_img}`)
            if (world[y][x] == 0){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"white")
            }
            else if (world[y][x] == 1){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"brown")
                // ctx.drawImage(wall_img, xSquare, ySquare, squareSize, squareSize)
            }
            else if (world[y][x] == 2){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"#fa4b2a")
                // ctx.drawImage(mario_img, xSquare, ySquare, squareSize, squareSize)
            }
            else if (world[y][x] == 3){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"yellow")
                // ctx.drawImage(star_img, xSquare, ySquare, squareSize, squareSize)
            }
            else if (world[y][x] == 4){  
                paintSquare(xSquare,ySquare,squareSize,squareSize,"orange")
                // ctx.drawImage(flower_img, xSquare, ySquare, squareSize, squareSize)
            }
            else if (world[y][x] == 5){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"green")
                // ctx.drawImage(bowser_img, xSquare, ySquare, squareSize, squareSize)
            }
            else if (world[y][x] == 6){
                paintSquare(xSquare,ySquare,squareSize,squareSize,"pink")
                // ctx.drawImage(princess_img, xSquare, ySquare, squareSize, squareSize)
            }
            else {
                throw `There's an invalid item in world's array: ${world[y][x]} at (${x+1},${y+1})`
            }
            xSquare += squareSize;
        }
        ySquare += squareSize;
    }
}

//====================================================================================
// logic - basic's
//====================================================================================

try{
    // paintWorld(world)
    ctx.drawImage(bowser_img,0,0,100,100)
}
catch(e) {
    console.error(`An error has occurred during game's execution ${e}`);
}