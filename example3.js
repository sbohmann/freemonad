const fs = require('fs')

class Free {
}

class Return extends Free {
    constructor(result) {
        super()
        this._result = result
    }

    get result() {
        return this._result
    }
}

class FlatMap extends Free {
    constructor(result, f) {
        super()
        this._result = result
        this._f = f
    }

    get result() {
        return this._result
    }

    get f() {
        return this._f
    }
}

function fbind(...f) {
    if (f.length < 1) {
        throw new RangeError()
    } else if (f.length === 1) {
        return f[0]
    } else {
        return x => {
            let free = f[0](x)
            if (free instanceof Return) {
                return new FlatMap(free.result, fbind(...f.slice(1)))
            } else if (free instanceof FlatMap) {
                return new FlatMap(free.result, fbind(free.f, ...f.slice(1)))
            }
        }
    }
}

// example interpreter, expecting array results and using Array.flatMap for FlatMap

function arrayFlatMapInterpreter(f) {
    function interpret(free) {
        if (free instanceof Return) {
            return free.result
        } else if (free instanceof FlatMap) {
            return free.result.flatMap(x => interpret(free.f(x)))
        }
    }

    return x => interpret(f(x))
}

// example functions

// extremely simplified criteria for directories to consider for year, month and date
const yearPattern = /(\d){4}/
const monthPattern = /\d|1[012]/
const dayPattern = /\d|[12]\d|3[01]/

function years(parentDirectory) {
    let files = fs.readdirSync(parentDirectory)
    let result = []
    for (let file of files) {
        if (file.match(yearPattern) != null) {
            result.push(parentDirectory + '/' + file)
        }
    }
    return new Return(result)
}

function months(parentDirectory) {
    let files = fs.readdirSync(parentDirectory)
    let result = []
    for (let file of files) {
        if (file.match(monthPattern) != null) {
            result.push(parentDirectory + '/' + file)
        }
    }
    return new Return(result)
}

function days(parentDirectory) {
    let files = fs.readdirSync(parentDirectory)
    let result = []
    for (let file of files) {
        if (file.match(dayPattern) != null) {
            result.push(parentDirectory + '/' + file)
        }
    }
    return new Return(result)
}

function data(parentDirectory) {
    let path = parentDirectory + '/data.csv'
    if (fs.existsSync(path)) {
        return new FlatMap([path], lines)
    } else {
        return new Return([])
    }
}

function lines(path) {
    let result = []
    for (let line of fs.readFileSync(path).toString().split('\n')) {
        let product = 1
        for (let value of line.split(';').map(Number)) {
            product *= value
        }
        let lineNumber = result.length + 1
        result.push(path + '[' + lineNumber + ']:' + product)
    }
    return new Return(result)
}

const boundFunction = arrayFlatMapInterpreter(fbind(years, months, days, data))
// calling boundFunction with the initial directory 'example3'
console.log(boundFunction('example3'))
