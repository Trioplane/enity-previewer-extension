import { drawPoly, drawTrapezoid } from "./drawEntity.js"
import { getColor, mixColors, modifyColor } from "./modifyColor.js"
import { Parser, getDefinitionData, parseCodeInput } from "./parse.js"
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
function draw(context, definition) {
    context.fillStyle = (getColor(definition.COLOR))
    context.strokeStyle = mixColors((getColor(definition.COLOR)), "#484848", 0.65)
    context.lineWidth = 6
    context.lineCap = 'round'
    context.lineJoin = 'round'
    //drawTrapezoid(context, CONSTANTS.canvasCenter.x, CONSTANTS.canvasCenter.y, 100, 20, 0.8, 0, false, true)
    drawPoly(context, CONSTANTS.canvasCenter.x, CONSTANTS.canvasCenter.y, definition.SIZE, definition.SHAPE, 0, false, true)
}

// Initialize Canvas

function init(context) {
    resizeCanvas(context)
    let values
    let timeout
    window.addEventListener('resize', () => {
        resizeCanvas(context)
        resetCanvas(context)
        try {
            values = new Parser(codeInput.value).parse()
        } catch (error) {
            errorBox.classList.remove('hidden')
            errorBox.textContent = error
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                errorBox.classList.add('hidden')
            }, 3000)
        }
        draw(context, values)
    })
    codeInput.addEventListener('input', () => {
        try {
            values = new Parser(codeInput.value).parse()
        } catch (error) {
            errorBox.classList.remove('hidden')
            errorBox.textContent = error
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                errorBox.classList.add('hidden')
            }, 3000) 
        }
        resetCanvas(context)
        draw(context, values)
    })
}
init(ctx)

window.thing = new Parser(`
    exports.thing = {
        SHAPE: 10,
        SIZE: 20,
        COLOR: 'blue',
        GUNS: [{
            POSITION: {X: 10, Y: 20},
            PROPERTIES: {
                COLOR: 10,
            }
        }],
        TURRETS: [{
            POSITION: [0, 1, 1, 0, 0, 0],
            TYPE: "kronos"
        }]
    }
`)