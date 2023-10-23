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

        this.parsedData.SIZE != null ? minified.SIZE = this.parsedData.SIZE : minified.SIZE = 0
        this.parsedData.SHAPE != null ? minified.SHAPE = this.parsedData.SHAPE : minified.SHAPE = 0
        this.parsedData.COLOR != null ? minified.COLOR = this.parsedData.COLOR : minified.COLOR = 10

        minified.SIZE *= lazyRealSizes[Math.floor(Math.abs(minified.SHAPE))];

        return minified
    }
    standardize(parsedData = this.parsedData) { // will make things easier to deal with by turning things into 1 format
        return parsedData
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