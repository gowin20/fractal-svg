import { generateSVG } from "./fractal-line.js"
import * as patterns from "./patterns.js"

// Set up control functionality
const control = document.getElementById("control");

// Hide / Show window
const hideButton = document.getElementById("hide-icon");
const showButton = document.getElementById("hidden-window");

hideButton.addEventListener("click", e => {
    control.style.display = "none";
    showButton.style.display = "block";

    // TODO add button css transisiton
})

showButton.addEventListener("click", e=>{
    control.style.display = "block";
    showButton.style.display = "none";
})

// Window Drag
const header = document.getElementById("control-header");
let x1, x2, y1, y2;
header.onmousedown = mouseDown;

function mouseDown(e) {
    x1 = e.clientX;
    y1 = e.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = dragElement;
}

function dragElement(e) {
    x2 = x1 - e.clientX;
    y2 = y1 - e.clientY;

    x1 = e.clientX;
    y1 = e.clientY;

    control.style.top = (control.offsetTop - y2) + "px";
    control.style.left = (control.offsetLeft - x2) + "px";
}

function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
}

// Populate pattern selector
const patternSelect = document.getElementById("pattern")

Object.keys(patterns.default.options).forEach(value => {
    let opt = document.createElement("option");

    opt.setAttribute("value",value);
    opt.innerHTML = patterns.default.options[value].name;
    patternSelect.appendChild(opt)
})

// Initialize depth slider
const depthSlider = document.getElementById("depth");
const depthDisplay = document.getElementById("depthNumber")


depthDisplay.innerHTML = document.getElementById("depth").value
// update value dynamically


depthSlider.addEventListener("input", e => {
    depthDisplay.innerHTML = e.target.value;
})

// Set max slider value
patternSelect.addEventListener("input", e => {
    const maxDepth = patterns.default.options[e.target.value].maxDepth;

    if (depthSlider.value > maxDepth) {
        depthSlider.value = maxDepth;
        depthDisplay.innerHTML = maxDepth;
    }

    depthSlider.setAttribute("max",maxDepth);

})

let fractal,depth;

document.getElementById("generate").addEventListener("click",() => {

    document.getElementById("download-svg").style.display = "block";

    const result = document.getElementById('result');
    result.innerHTML = "";

    fractal = patternSelect.value;
    depth = depthSlider.value;
    const outline = document.getElementById('outline').value;
    const fill = document.getElementById('fill').value;
    
    const fractalSVG = generateSVG(fractal,depth,outline,fill,result);

    result.appendChild(fractalSVG);
})

// Download SVG file
document.getElementById("download-svg").addEventListener("click", () => {
    const svg = result.innerHTML;


    const base64doc = btoa(unescape(encodeURIComponent(svg)));

    const a = document.createElement('a');

    
    a.download = fractal + '-d' + depth;
    a.href = 'data:image/svg+xml;base64,' + base64doc;

    const e = new MouseEvent('click');
    a.dispatchEvent(e);
})