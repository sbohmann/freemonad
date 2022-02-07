const fs = require('fs')

// The Free data structure is either a Return or a FlatMap

function Return(result) {
    return {
        match(handler) {
            return handler.ifReturn(result)
        }
    }
}

function FlatMap(result, f) {
    return {
        match(handler) {
            return handler.ifFlatMap(result, f)
        }
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
            return free.match({
                ifReturn(result) {
                    return FlatMap(result, fbind(...f.slice(1)))
                },
                ifFlatMap(result, f) {
                    return FlatMap(result, fbind(f, ...f.slice(1)))
                }
            })
        }
    }
}

// example interpreter, expecting array results and using Array.flatMap for FlatMap

function arrayFlatMapInterpreter(f) {
    function interpret(free) {
        return free.match({
            ifReturn(result) {
                return result
            },
            ifFlatMap(result, f) {
                return result.flatMap(x => interpret(f(x)))
            }
        })
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
    return Return(result)
}

function months(parentDirectory) {
    let files = fs.readdirSync(parentDirectory)
    let result = []
    for (let file of files) {
        if (file.match(monthPattern) != null) {
            result.push(parentDirectory + '/' + file)
        }
    }
    return Return(result)
}

function days(parentDirectory) {
    let files = fs.readdirSync(parentDirectory)
    let result = []
    for (let file of files) {
        if (file.match(dayPattern) != null) {
            result.push(parentDirectory + '/' + file)
        }
    }
    return Return(result)
}

function data(parentDirectory) {
    let path = parentDirectory + '/data.csv'
    if (fs.existsSync(path)) {
        return FlatMap([path], lines)
    } else {
        return Return([])
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
    return Return(result)
}

const boundFunction = arrayFlatMapInterpreter(fbind(years, months, days, data))
// calling boundFunction with the initial directory 'example3'
console.log(boundFunction('example3'))
