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
    getDefinitionData
}