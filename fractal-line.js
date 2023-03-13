
// Fractal information

let fractal, fractalInfo;


// Global variables
let heading = 0;
let side = "LEFT";
// invariant: the smallest side will always have length 5
const smallestSegment = 5;

fetch('./fractals.json')
    .then((response) => response.json())
    .then((json) => fractalInfo = json)


function getFractalInfo() {
    let fractalJSON = fs.readFileSync('./fractals.json','utf8');
    return JSON.parse(fractalJSON)
}


// draws a line based on the current heading and step size
function drawSegment(size,depth,max) {
    //console.log(heading)
  if (depth < max) {
    return drawPattern(size/fractal.scale,depth,max)
  }
  else {

    const radHead = (Math.PI * heading) / 180;

    const dy = (size * Math.sin(radHead));
    const dx = (size * Math.cos(radHead));
    //console.log(size,dx,dy,"\n");
    return `l ${dx} ${dy} `
  }
  
}

function drawPattern(size,depth,max) {
    let section = ``;
    //creates eight segments - a single fractal unit
    fractal.shape.forEach(instruction => {

        if (instruction == "DRAW") {
            // draw a line
            section += drawSegment(size,depth+1,max);
        }
        else if (instruction == "FLIP") {
            if (side == "LEFT") side = "RIGHT";
            else side = "LEFT";
        }
        else {
            // instruction is an angle: change the heading
            if (side == "LEFT") {
                heading += instruction;
            }
            else {
                heading -= instruction;
            }
            heading %= 360;
        }
    })

    return section;
}


function generatePath(base,maxDepth) {
    const path = drawFractal(base,maxDepth);
    return 'M 0 100 ' + path
}

function drawFractal(basePar,maxDepth) {
    let fractalPath = ``

    const base = fractalInfo.bases[basePar];
    
    // calculate size

    const numSides = Math.floor((base.length)/2)+1
    const startingSize = smallestSegment * numSides * (fractal.scale ** maxDepth);

    base.forEach(instruction => {
        if (instruction == "DRAW") {
            fractalPath += drawSegment(startingSize,0,maxDepth)
        }
        else {
            //console.log(heading)
            heading += instruction;
            heading %= 360;
        }
    });
    return fractalPath;
}

// helper function to get the bounding box of an SVG before it is rendered
function svgBBox (svgEl) {
    let tempDiv = document.createElement('div')
    tempDiv.setAttribute('style', "position:absolute; visibility:hidden; width:0; height:0")
    document.body.appendChild(tempDiv)
    let tempSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    tempDiv.appendChild(tempSvg)
    let tempEl = svgEl.cloneNode(true)
    tempSvg.appendChild(tempEl)
    let bb = tempEl.getBBox()
    document.body.removeChild(tempDiv)
    return bb
  }

// main function that generates a square SVG of a given size and depth and adds it to the DOM
function generateSVG(node,type,maxDepth, base="line", fill="transparent") {

    // parse inputs
    fractal = fractalInfo.fractals[type];
    
    if (!(fractal.bases.includes(base))) {
        console.log(base,fractal.bases);
        console.error("Invalid base")
        alert("Invalid base");
        return;
    }

    if (maxDepth > 10) {
        console.error("Depth too large for SVG format")
        alert("Depth too large for SVG format")
        return
    }
    if (fill == "") {
        fill = "transparent";
    }
    if (maxDepth == "") {
        maxDepth = 3;
    }

    heading = 0;

    // recursive call
    const path = generatePath(base,maxDepth)


    // create SVG element
    const fractalSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const fractalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');


    fractalSVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    fractalSVG.setAttribute('fill', fill);
    fractalSVG.setAttribute('stroke', 'black');

    fractalPath.setAttribute('d', path);
    fractalSVG.appendChild(fractalPath);

    // set viewBox to be the full extent of the fractal using helper function
    const bbox = svgBBox(fractalSVG);
    var viewBox = [bbox.x-1, bbox.y-1, bbox.width+2, bbox.height+2].join(" ");
    fractalSVG.setAttribute("viewBox", viewBox);

    // return
    return node.appendChild(fractalSVG);
}
