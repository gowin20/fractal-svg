import * as patterns from "./patterns.js"

export function generateSVG(type,depth, outline="#000000", fill="transparent",node) {

        if (depth > 10) {
            console.error("Depth too large for SVG format")
            alert("Depth too large for SVG format")
            return
        }
    
        // recursive call
        const path = drawFractal(type,depth);
    
        // create SVG element
        const fractalSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const fractalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    
        fractalSVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        fractalSVG.setAttribute('fill', fill);
        fractalSVG.setAttribute('stroke', outline);
    
        fractalPath.setAttribute('d', path);
        fractalSVG.appendChild(fractalPath);
    
        // set viewBox to be the full extent of the fractal using helper function
        const bbox = svgBBox(fractalSVG);
        var viewBox = [bbox.x-1, bbox.y-1, bbox.width+2, bbox.height+2].join(" ");
        fractalSVG.setAttribute("viewBox", viewBox);
    
        // return
        return node.appendChild(fractalSVG);
}

// Global variables
let heading = 0;
let side = "LEFT";
// invariant: the smallest side will always have length 5
const smallestSegment = 5;
let fractal;



function drawFractal(type, maxDepth) {

    heading = 0;
    let fractalPath = ``
    console.log(type)
    console.log(patterns.default.options)
    const baseType = patterns.default.options[type].base;
    const base = patterns.default.bases[baseType];

    const shapeType = patterns.default.options[type].shape;
    fractal = patterns.default.patterns[shapeType];
    
    // calculate size
    const numSides = Math.floor((base.length)/2)+1
    const startingSize = smallestSegment * numSides * (fractal.scale ** maxDepth);

    base.forEach(instruction => {
        if (instruction == "DRAW") {
            fractalPath += drawSegment(startingSize,0,maxDepth)
        }
        else {
            heading += instruction;
            heading %= 360;
        }
    });

    return 'M 0 100 ' + fractalPath;

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

