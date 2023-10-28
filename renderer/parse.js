import { getColor } from './modifyColor.js'
let lazyRealSizes = [1, 1, 1];
for (let i = 3; i < 17; i++) {
    // We say that the real size of a 0-gon, 1-gon, 2-gon is one, then push the real sizes of triangles, squares, etc...
    let circum = (2 * Math.PI) / i;
    lazyRealSizes.push(Math.sqrt(circum * (1 / Math.sin(circum))));
}

lazyRealSizes = new Proxy(lazyRealSizes, {
    get: function(arr, i) {
        if (!(i in arr) && !isNaN(i)) {
            let circum = (2 * Math.PI) / i;
            arr[i] = Math.sqrt(circum * (1 / Math.sin(circum)));
        }
        return arr[i];
    }
});
class Parser {
    constructor(data) {
        this.data = data
        this.parsedData = {}
    }
    parse(data = this.data) {
        let exports = {},
            gunCalcNames = {},
            base = {},
            statnames = {},
            g = {},
            combineStats = x => null
        let minified = {}
        
        if (/exports\..*/.test(data)) this.parsedData = eval(data)
        else if (/[^.]+\.[^=]+ =/.test(data)) throw new SyntaxError("Code must start with `exports.`")
        else throw new SyntaxError("Code is not a valid arras tank syntax")

        this.parsedData.SIZE != null ? minified.SIZE = this.parsedData.SIZE : minified.SIZE = 20
        this.parsedData.SHAPE != null ? minified.SHAPE = this.parsedData.SHAPE : minified.SHAPE = 0
        this.parsedData.COLOR != null ? minified.COLOR = this.parsedData.COLOR : minified.COLOR = 10
        this.parsedData.BORDERLESS != null ? minified.BORDERLESS = this.parsedData.BORDERLESS : minified.BORDERLESS = false
        this.parsedData.DRAW_FILL != null ? minified.DRAW_FILL = this.parsedData.DRAW_FILL : minified.DRAW_FILL = true

        if (this.parsedData.GUNS != null) {
            minified.GUNS = []
            for (let gun of this.parsedData.GUNS) {
                minified.GUNS.push(this.parseGun(gun))
            }
        }

        // minified.TURRETS = []
        // for (let turret of this.parsedData.TURRETS) {
        //     minified.TURRETS.push(this.parseTurret(turret))
        // }

        if (typeof minified.SHAPE != 'string') minified.SIZE *= lazyRealSizes[Math.floor(Math.abs(minified.SHAPE))];

        this.parsedData = minified
        return this
    }
    parseGun(data) {
        let minified = {}
        data.POSITION != null ? minified.POSITION = data.POSITION : minified.POSITION = [0, 0, 0, 0, 0, 0, 0]
        minified.PROPERTIES = {
            COLOR: 16,
            BORDERLESS: false,
            DRAW_FILL: true,
            DRAW_ABOVE: false
        }
        if (data.PROPERTIES != null) {
            data.PROPERTIES.COLOR != null ? minified.PROPERTIES.COLOR = data.PROPERTIES.COLOR : null
            data.PROPERTIES.BORDERLESS != null ? minified.PROPERTIES.BORDERLESS = data.PROPERTIES.BORDERLESS : null
            data.PROPERTIES.DRAW_FILL != null ? minified.PROPERTIES.DRAW_FILL = data.PROPERTIES.DRAW_FILL : null
            data.PROPERTIES.DRAW_ABOVE != null ? minified.PROPERTIES.DRAW_ABOVE = data.PROPERTIES.DRAW_ABOVE : null
        }
        return minified
    }
    parseTurret(data) {
        let minified = {}
        data.POSITION != null ? minified.POSITION = data.POSITION : minified.POSITION = [0, 0, 0, 0, 0, 0, 0]
        return minified
    }
    standardize(parsedData = this.parsedData) { // will make things easier to deal with by turning things into 1 format
        // turn all positions into an object
        let standardized = structuredClone(parsedData)
        
        if (standardized.GUNS != null) {
            for (let i = 0; i < standardized.GUNS.length; i++) {
                if (!Array.isArray(standardized.GUNS[i].POSITION)) continue
                let position = standardized.GUNS[i].POSITION
                let newPosition = {
                    LENGTH: position[0] ?? 0,
                    WIDTH: position[1] ?? 0, 
                    ASPECT: position[2] ?? 0,
                    X: position[3] ?? 0,
                    Y: position[4] ?? 0,
                    ANGLE: position[5] ?? 0
                }
                standardized.GUNS[i].POSITION = newPosition
            }
        }
        this.parsedData = standardized
        return this.parsedData
    }
}

/**
 * 
 * @param {string} code 
 * @returns {object}
 */
let timeout
const parseCodeInput = (code, errorBox) => {
    let combineStats = () => {}
    let g = {}
    let gunCalcNames = {}
    let base = {}
    let statnames = {}
    let exports = {}
    let parsedCode
    try {
        parsedCode = eval(code)
        return parsedCode
    } catch (error) {
        errorBox.classList.remove('hidden')
        errorBox.textContent = error
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            errorBox.classList.add('hidden')
        }, 3000)
    }
}

const getDefinitionData = (code) => {
    let output = {}
    code.SHAPE != null ? output.SHAPE = code.SHAPE : 0
    code.SIZE != null ? output.SIZE = code.SIZE : 16
    code.COLOR != null ? output.COLOR = code.COLOR : 'blue'
    return output
}

export {
    parseCodeInput,
    getDefinitionData,
    Parser
}