// A Free is either a Pure or a Bind
let Free = {
    bind(next) {
        return Bind(this, next)
    }
}

// A Pure contains a result value
function Pure(result) {
    return {
        ...Free,
        type: 'Pure',
        result
    }
}

// A Bind contains a Free lhs and a function rhs that returns a Free<M>
function Bind(lhs, rhs) {
    return {
        ...Free,
        type: 'Bind',
        lhs,
        rhs
    }
}

function lift(f) {
    return (x) => Pure(f(x))
}

// the equivalent of the >>= operator
function bind(...functions) {
    let result = functions[0]
    for (let next of functions.slice(1)) {
        let previousResult = result
        result = (x) => previousResult(x).bind(next)
    }
    return result
}

function count(n) {
    let result = []
    for (let i = 0; i < n; ++i) {
        result.push(i)
    }
    return result
}

let lifted = lift(count)
let bound = bind(lifted, lifted, lifted)

// an interpreter
function flatMap(f, x) {
    function handleNext(next) {
        if (next.type === 'Pure') {
            return next.result
        } else if (next.type === 'Bind') {
            let result = []
            let lhsResult = handleNext(next.lhs)
            for (let lhsValue of lhsResult) {
                result.push(...flatMap(next.rhs, lhsValue))
            }
            return result
        } else {
            throw new RangeError('Unknown Free type: [' + next.type + ']')
        }
    }

    return handleNext(f(x))
}

// another interpreter
function bindLast(f, x) {
    function handleNext(next) {
        if (next.type === 'Pure') {
            return next.result
        } else if (next.type === 'Bind') {
            let result = []
            let lhsResult = handleNext(next.lhs)
            for (let lhsValue of lhsResult.slice(lhsResult.length - 1)) {
                result.push(...bindLast(next.rhs, lhsValue))
            }
            return result
        } else {
            throw new RangeError('Unknown Free type: [' + next.type + ']')
        }
    }

    return handleNext(f(x))
}

const n = 7

// using the flatMap interpreter
console.log(flatMap(bound, n))

// using Array.flatMap
console.log(count(n).flatMap(count).flatMap(count))

// using the bindFirst interpreter
console.log(bindLast(bound, n))
