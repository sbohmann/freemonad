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
let flatMap = {
    run(f, x) {
        return f(x).accept(this, x)
    },
    pure(f) {
        return x => f(x)
    },
    bind(lhs, rhs) {
        return x => {
            let result = []
            for (let lhsValue of x) {
                result.push(...this.run(rhs, lhsValue))
            }
            return result
        }
    }
}

// another interpreter
let bindLast = {
    run(f, x) {
        return f(x).accept(this, x)
    },
    pure(f) {
        return x => f(x)
    },
    bind(lhs, rhs) {
        return x => {
            let result = []
            for (let lhsValue of x.slice(x.length - 1)) {
                result.push(...this.run(rhs, lhsValue))
            }
            return result
        }
    }
}

const n = 7

// using the flatMap interpreter
console.log(flatMap.run(bound, n))

// using Array.flatMap
console.log(count(n).flatMap(count).flatMap(count))

// using the bindLast interpreter
console.log(bindLast.run(bound, n))

let exampleFunction = bind(
    lift(n => {
        if (n % 2 === 0) {
            return [n, n * 3, n * 9]
        } else {
            return [n]
        }
    }),
    lift(x => {
        let result = []
        for (let n = 0; n < x; ++n) {
            result.push(n)
        }
        return result
    }),
    x => {
        if (x % 2 === 0) {
            return Pure([x])
        } else {
            let result = []
            for (let n = 0; n < x; ++n) {
                result.push(n.toString())
            }
            return Pure(result)
        }
    }
)

console.log(flatMap.run(exampleFunction, n))
