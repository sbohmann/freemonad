// minimal implementation of Free

// Free: Pure(f) | Bind(f, g)

function Pure(x, f) {
    return {
        type: 'Pure', // debug info
        accept(interpreter) {
            return interpreter.pure(x, f)
        },
        bind(next) {
            return (x) => Bind(f(x), next)
        }
    }
}

function Bind(lhs, rhs) {
    return {
        type: 'Bind', // debug info
        accept(interpreter) {
            interpreter.bind(lhs, rhs)
        },
        bind(next) {
            return (x) => Bind(this, next)
        }
    }
}

function lift(f) {
    return (x) => Pure(x, f)
}

function count(n) {
    let result = []
    for (let i = 0; i < n; ++i) {
        result.push(i)
    }
    return result
}

console.log(lift(count)(7))

let lifted = lift(count)

let bound = (x) => lifted(x).bind(lifted)

// an interpreter

let FlatMap = {
    pure(x, f) {
        return f(x).accept(this)
    },
    bind(lhs, rhs) {

    }
}
