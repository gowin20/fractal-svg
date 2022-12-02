const fs = require('fs');

function saveToFile(svg,pattern,depth,fill) {
    fs.writeFile("./"+pattern+"/"+depth+"-"+fill+".svg",svg,function (err){
        if (err) throw err;
    });
}


let heading = "+x";

// makes a 90deg left turn
const turnLeft = () => {
    switch (heading) {
      case "+x":
        heading = "-y";
        break;
      case "-y":
        heading = "-x";
        break;
      case "-x":
        heading = "+y";
        break;
      case "+y":
        heading = "+x";
        break;
    }
}

// makes a 90deg right turn
const turnRight = () => {
  switch (heading) {
    case "+x":
      heading = "+y";
      break;
    case "+y":
      heading = "-x";
      break;
    case "-x":
      heading = "-y";
      break;
    case "-y":
      heading = "+x";
      break;
  }
}

const straight = () => {return;}

const sausage150 = {
  scale:4,
  base:[
    straight
  ],
  turns:[
    turnLeft,
    turnRight,
    turnRight,
    straight,
    turnLeft,
    turnLeft,
    turnRight
]}

const sausage161 = {
  scale:6,
  base:[
    straight
  ],
  turns:[
  turnLeft,
  straight,
  turnRight,
  straight,
  turnRight,
  turnRight,
  turnLeft,
  turnLeft,
  straight,
  turnRight,
  turnRight,
  turnLeft,
  turnLeft,
  straight,
  turnLeft,
  straight,
  turnRight
]
}
const island161 = {
  scale:6,
  sizeScalar:2, //2 because the height increases by 2 units each time, another 2 because it's a square
  base:[
    turnRight,
    turnRight,
    turnRight,
    turnRight
  ],
  turns:[
  turnLeft,
  straight,
  turnRight,
  straight,
  turnRight,
  turnRight,
  turnLeft,
  turnLeft,
  straight,
  turnRight,
  turnRight,
  turnLeft,
  turnLeft,
  straight,
  turnLeft,
  straight,
  turnRight
]
}

let pattern = [];

// draws a line based on the current heading and step size
function drawSegment(size,depth,max) {
  // direction is either left, right, or straight
  if (depth < max) {
    return drawPattern(size/pattern.scale,depth+1,max)
  }
  else {
    let line = ``
    switch (heading) {
      case "+x":
        line += `h ${size} `;
        break;
      case "+y":
        line += `v ${size} `;
        break;
      case "-x":
        line += `h -${size} `;
        break;
      case "-y":
        line += `v -${size} `;
        break;
    }
    return line
  }
  
}


function drawPattern(size,depth,max) {
    let section = ``;
    //creates eight segments - a single fractal unit
    pattern.turns.forEach(turn => {
      section += drawSegment(size,depth,max);
      turn();
    })
    section += drawSegment(size,depth,max);
    return section;
}

function fractalBase(size,depth,max) {
  let fractal = pattern.start;
  pattern.base.forEach(turn => {
    fractal += drawSegment(size,depth,max)
    turn();
  })
  return fractal;
}


// wrapper that generates a square SVG of a given size and depth and saves it to file
function makeMinkowski(type,depth,size, fill="transparent") {
    let width, height;
    width = (depth==0) ? size : 0;
    let temp = size;
    let offset = 0;
    console.log(width)
    for (let d=0; d<depth;d++){
      width += temp;
      console.log(width,d,temp)
      temp /= pattern.scale;
      offset += temp;
    }
    console.log(width)
    switch (type) {
      case "sausage1.5":
        pattern = sausage150;
        pattern.start = `M 0 ${size/2}`
        break;
      case "sausage1.61":
        pattern = sausage161;
        pattern.start = `M 0 ${size/2}`
        break;
      case "island1.61":
        pattern= island161;
        pattern.start = `M ${offset} ${offset}`
        break;
      default:
        pattern = sausage150;
        pattern.start = `M 0 ${size/2}`
        break;
    }

    let path= fractalBase(size,0,depth) //recursive call
    let svg = `<svg width="${width}" height="${width}" id="iter1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="${path}" fill="${fill}" stroke="black"/></g></svg>`
    saveToFile(svg,type,depth,fill)
}

// TODO: calculate size and placement automatically based on depth (no input required)


const options = [
  "sausage1.50",
  "island1.50",
  "sausage1.61",
  "island1.61"
]

makeMinkowski("sausage1.61",3,300)

options.forEach(type => {
  for (let i=0; i<=5; i++) {
//    makeMinkowski(type,i,1000)
  }
})