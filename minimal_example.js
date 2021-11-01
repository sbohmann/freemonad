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
        accept(interpreter) {
            return interpreter.pure(result)
        }
    }
}

// A Bind contains a Free lhs and a function rhs that returns a Free<M>
function Bind(lhs, rhs) {
    return {
        ...Free,
        accept(interpreter) {
            return interpreter.bind(lhs, rhs)
        }
    }
}

function lift(f) {
    return (x) => Pure(f(x))
}

// the equivalent of the >>= operator
function bind(... functions) {
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
let flatMap = {
    run(f, x) {
        return f(x).accept(this, x)
    },
    pure(x) {
        return x
    },
    bind(lhs, rhs) {
        let result = []
        let lhsResult = lhs.accept(this)
        for (let lhsValue of lhsResult) {
            result.push(...this.run(rhs, lhsValue))
        }
        return result
    }
}

// another interpreter
let bindLast = {
    run(f, x) {
        return f(x).accept(this, x)
    },
    pure(x) {
        return x
    },
    bind(lhs, rhs) {
        let result = []
        let lhsResult = lhs.accept(this)
        for (let lhsValue of lhsResult.slice(lhsResult.length - 1)) {
            result.push(...this.run(rhs, lhsValue))
        }
        return result
    }
}

const n = 7

// using the flatMap interpreter
console.log(flatMap.run(bound, n))

// using Array.flatMap
console.log(count(n).flatMap(count).flatMap(count))

// using the bindFirst interpreter
console.log(bindLast.run(bound, n))
