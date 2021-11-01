// A Free is either a Pure or a Bind
let Free = {
    bind(next) {
        return Bind((x) => this, next)
    }
}

// A Pure contains a function f that does *not* return a Free<M> but an M
function Pure(f) {
    return {
        ...Free,
        accept(interpreter, x) {
            return interpreter.pure(f, x)
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
    return (x) => Pure(f)
}

function count(n) {
    let result = []
    for (let i = 0; i < n; ++i) {
        result.push(i)
    }
    return result
}

let lifted = lift(count)

// manual binding in lieu of an >>= operator
let bound = (x) => lifted(x).bind(lifted)
let doubleBound = (x) => bound(x).bind(lifted)

// an interpreter
let flatMap = {
    run(f, x) {
        return f(x).accept(this, x)
    },
    pure(f, x) {
        return f(x)
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

const n = 7

// using the flatMap interpreter
console.log(flatMap.run(doubleBound, n))

// using Array.flatMap
console.log(count(n).flatMap(count).flatMap(count))
