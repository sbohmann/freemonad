// A Free is either a Pure or a Bind
let Free = {
    bind(next) {
        return Bind((x) => this, next)
    }
}

// A Pure contains a function f that does *not* return a Free<M> but an M
function Pure(f, x) {
    return {
        ...Free,
        accept(interpreter) {
            return interpreter.pure(f(x))
        }
    }
}

// A Bind contains two functions, lhs and rhs, that return a Free<M>
function Bind(lhs, rhs) {
    return {
        ...Free,
        accept(interpreter, x) {
            return interpreter.bind(lhs, rhs, x)
        }
    }
}

function lift(f) {
    return (x) => Pure(x)
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
    bind(lhs, rhs, x) {
        let result = []
        let lhsResult = this.run(lhs, x)
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
    bind(lhs, rhs, x) {
        let result = []
        let lhsResult = this.run(lhs, x)
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
