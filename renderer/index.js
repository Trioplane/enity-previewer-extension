import { drawPoly, drawTrapezoid } from "./drawEntity.js"
import { mixColors, modifyColor } from "./modifyColor.js"
import { getDefinitionData, parseCodeInput } from "./parse.js"
const CONSTANTS = {
    canvasWidthSize: 1.425,
    canvasCenter: {
        x: innerWidth / 1.425 / 2,
        y: innerHeight / 2
    }
}
let errorBox = document.querySelector('#error-box')
/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.querySelector('#canvas')
/**
 * @type {HTMLTextAreaElement}
 */
let codeInput = document.querySelector('#codeInput')
let ctx = canvas.getContext('2d')

/**
 * @param {CanvasRenderingContext2D} context 
 */
function resizeCanvas(context) {
    context.canvas.height = innerHeight
    context.canvas.width = innerWidth / CONSTANTS.canvasWidthSize
}
function resetCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

// DRAWING FUNCTIONS
/**
 * @param {CanvasRenderingContext2D} context 
 */
function draw(context, shape = 0, color = 18, size = 20) {
    context.fillStyle = modifyColor(color)
    context.strokeStyle = mixColors(modifyColor(color), "#484848", 0.65)
    context.lineWidth = 6
    context.lineCap = 'round'
    context.lineJoin = 'round'
    //drawTrapezoid(context, CONSTANTS.canvasCenter.x, CONSTANTS.canvasCenter.y, 100, 20, 0.8, 0, false, true)
    drawPoly(context, CONSTANTS.canvasCenter.x, CONSTANTS.canvasCenter.y, size, shape, 0, false, true)
}

// Initialize Canvas
let parsedCode
let code

function init(context) {
    resizeCanvas(context)
    draw(context)
    window.addEventListener('resize', () => {
        resizeCanvas(context)
        resetCanvas(context)
        draw(context, code.SHAPE, code.COLOR, code.SIZE)
    })
    codeInput.addEventListener('input', () => {
        parsedCode = parseCodeInput(codeInput.value, errorBox)
        code = getDefinitionData(parsedCode)
        resetCanvas(context)
        draw(context, code.SHAPE, code.COLOR, code.SIZE)
    })
}
init(ctx)