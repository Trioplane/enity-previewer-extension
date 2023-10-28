import { drawPoly, drawTrapezoid } from "./drawEntity.js"
import { getColor, mixColors, modifyColor } from "./modifyColor.js"
import { Parser, getDefinitionData, parseCodeInput } from "./parse.js"
const CONSTANTS = {
    canvasWidthSize: 1.425,
    canvasOrigin: {
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

// DEPRECATED, WILL REMOVE SOON
function draw_(context, definition) {
    // TODO: Fix this mess
    context.fillStyle = (getColor(definition.COLOR))
    context.strokeStyle = mixColors((getColor(definition.COLOR)), "#484848", 0.65)
    context.lineWidth = 6
    context.lineCap = 'round'
    context.lineJoin = 'round'
    //drawTrapezoid(context, CONSTANTS.canvasCenter.x, CONSTANTS.canvasCenter.y, 100, 20, 0.8, 0, false, true)
    drawPoly(context, CONSTANTS.canvasOrigin.x, CONSTANTS.canvasOrigin.y, definition.SIZE, definition.SHAPE, 0, definition.BORDERLESS, definition.DRAW_FILL)

    for (let gun of definition.GUNS) {
        // TODO: why is COLOR, BORDERLESS, and FILL needs to have PROPERTIES required
        context.fillStyle = getColor(gun.PROPERTIES.COLOR)
        context.strokeStyle = mixColors((getColor(gun.PROPERTIES.COLOR)), "#484848", 0.65)
        drawTrapezoid(context, gun.POSITION[3] + CONSTANTS.canvasOrigin.x, gun.POSITION[4] + CONSTANTS.canvasOrigin.y, gun.POSITION[0], gun.POSITION[1], gun.POSITION[2], gun.POSITION[5], gun.PROPERTIES.BORDERLESS, gun.PROPERTIES.DRAW_FILL)
    }
}

function setColorStyle(context, fill, stroke = null) {
    context.fillStyle = getColor(fill)
    stroke != null ?
        context.strokeStyle = stroke
    :
        context.strokeStyle = mixColors(getColor(fill), "#484848", 0.65)
}

function draw(context, definition) {
    context.lineWidth = 6
    context.lineCap = 'round'
    context.lineJoin = 'round'
    // Turrets below the depths
    // CODE...

    // Guns beneath the surface of the earth
    for (let gun of definition.GUNS) {
        setColorStyle(context, gun.PROPERTIES.COLOR)
        if (!gun.PROPERTIES.DRAW_ABOVE)
        drawTrapezoid(
            context,
            gun.POSITION.X + CONSTANTS.canvasOrigin.x,
            gun.POSITION.Y + CONSTANTS.canvasOrigin.y,
            gun.POSITION.LENGTH,
            gun.POSITION.WIDTH,
            gun.POSITION.ASPECT,
            gun.POSITION.ANGLE,
            gun.PROPERTIES.BORDERLESS,
            gun.PROPERTIES.DRAW_FILL,
        )
    }
    // Draw me at the middle
    setColorStyle(context, definition.COLOR)
    drawPoly(
        context,
        CONSTANTS.canvasOrigin.x,
        CONSTANTS.canvasOrigin.y,
        definition.SIZE,
        definition.SHAPE,
        0, // todo, add an autospin feature or point to whereever or something
        definition.BORDERLESS,
        definition.DRAW_FILL
    )

    // Guns above the universe
    for (let gun of definition.GUNS) {
        setColorStyle(context, gun.PROPERTIES.COLOR)
        if (gun.PROPERTIES.DRAW_ABOVE)
        drawTrapezoid(
            context,
            gun.POSITION.X + CONSTANTS.canvasOrigin.x,
            gun.POSITION.Y + CONSTANTS.canvasOrigin.y,
            gun.POSITION.LENGTH,
            gun.POSITION.WIDTH,
            gun.POSITION.ASPECT,
            gun.POSITION.ANGLE,
            gun.PROPERTIES.BORDERLESS,
            gun.PROPERTIES.DRAW_FILL,
        )
    }
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
            values = new Parser(codeInput.value).parse().standardize()
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
            values = new Parser(codeInput.value).parse().standardize()
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