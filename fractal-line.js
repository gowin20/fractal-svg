import * as patterns from "./patterns.js"

// Global variables
let heading = 0;
let sign = "+";
let fractal, base;

// Invariant: The smallest side will always have length 5
const smallestSegment = 5;

/*
Primary function: generateSVG returns an <svg> element containing a self-similar fractal pattern. The pattern is represented as a single <path>

Inputs:
    type - the type of fractal pattern
    depth - the level of detail to generate recursively
    outline - color of SVG path
    fill - color of SVG fill
*/
export function generateSVG(type,depth, outline="#000000", fill="transparent") {


        const baseType = patterns.default.options[type].base;
        base = patterns.default.bases[baseType];

        const shapeType = patterns.default.options[type].shape;
        fractal = patterns.default.patterns[shapeType];

        // recursive call
        const path = drawFractal(depth);
    
        // create SVG element
        const fractalSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const fractalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');


        fractalSVG.setAttributeNS('http://www.w3.org/2000/xmlns/',"xmlns",'http://www.w3.org/2000/svg')
        fractalSVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        fractalSVG.setAttribute('fill', fill);
        fractalSVG.setAttribute('stroke', outline);

        fractalPath.setAttribute('stroke-width',2*depth);
        fractalPath.setAttribute('d', path);
        fractalSVG.appendChild(fractalPath);
    
        // set viewBox to be the full extent of the fractal using helper function
        const bbox = svgBBox(fractalSVG);
        var viewBox = [bbox.x-1, bbox.y-1, bbox.width+2, bbox.height+2].join(" ");
        fractalSVG.setAttribute("viewBox", viewBox);
    
        return fractalSVG;
}

/*
Helper function: drawFractal returns a complete <path> representing a fractal
*/
function drawFractal(maxDepth) {

    let fractalPath = ``
   
    // Number of sides in base shape
    const baseNumSides = Math.floor((base.length)/2)+1

    // Initial segment size
    const startingSize = smallestSegment * baseNumSides * (fractal.scale ** maxDepth);

    // Draw base shape where each side is a fractal pattern
    base.forEach(instruction => {
        if (instruction == "DRAW") {
            fractalPath += drawPattern(startingSize,0,maxDepth)
        }
        else {
            heading += instruction;
            heading %= 360;
        }
    });

    return 'M 0 100 ' + fractalPath;

}

/*
Recursive core: drawPattern recursively creates patterns based on a set of input instructions
*/
function drawPattern(size,depth,max) {
    
    let fractalPath = ``;

    fractal.shape.forEach(instruction => {

        switch (instruction) {
            // Draw something
            case "DRAW":
                if (depth+1 < max) {
                    // Recursive call
                    fractalPath += drawPattern(size/fractal.scale,depth+1,max)
                }
                else {
                    // Draw a line
                    const headingRad = (Math.PI * heading) / 180;

                    const dy = (size * Math.sin(headingRad));
                    const dx = (size * Math.cos(headingRad));
                    fractalPath += `l ${dx} ${dy} `
                }
                break;
            
            //Change rotation direction
            case "FLIP":
                if (sign == "+") sign = "-";
                else sign = "+";
                break;

            // Adjust heading using degrees
            default:
                if (sign == "+") {
                    heading += instruction;
                }
                else {
                    heading -= instruction;
                }
                heading %= 360;
                break;
        }

    })
    return fractalPath;
}

// Helper function to get the bounding box of an SVG before it is rendered. Necessary in order to display the <path> properly
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