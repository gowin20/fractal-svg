
// TODO define global constant "DRAW" that can be written as DRAW

/*
JSON format:

{
    fractalName : {
        dimension : int,
        base: instructionList, //initial shape of fractal (typically square or line)
        shape: instructionList
    },
    ...
}

instructionList =

[
    instruction, instruction, ..., instruction
]


instruction = 

DRAW || TURN [x]

TURN [x] - represented as a single DOUBLE

Example instructionList: [DRAW, 90, DRAW, -90, DRAW, -90, DRAW, 90, DRAW]

*/
