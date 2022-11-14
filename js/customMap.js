// Global variables
let file;
let text;
let world = [];

// Draw map
//canvas
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = 500
canvas.height = 500

//Dimensions
const squareSize = 50

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

// Convert text to matrix
function splitString(string) {
  let arrayOfStrigns = string.split("\r\n");

  function aux(array) {
    var numbers = [];

    let words = array.split(" ");
    words.forEach(element => {
      numbers.push(parseInt(element));     
    });

    return numbers;

  }

  for (let i = 0; i < 10; i++) {
    world.push(aux(arrayOfStrigns[i]));
  }
};

// Read text

document.getElementById('inputFile').addEventListener('change', function() {
  file = new FileReader();
  file.onload = () => {
    text = file.result;
    splitString(text);
    // console.log(world);
    paintWorld(world);
  }
  file.readAsText(this.files[0]);
});

