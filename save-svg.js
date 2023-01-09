const fs = require('fs');
//const { start } = require('repl');

function saveToFile(svg,pattern,base="line",depth,fill) {
    const cropped = cropSVG;
    fs.writeFileSync("./"+pattern+"/"+base+"-"+depth+"-"+fill+".svg",svg,function (err){
        if (err) throw err;
    });
    console.log("SVG generated successfully.")
}