// A Free is either a Pure or a Bind
let Free = {
    bind(next) {
        return Bind((x) => this, next)
    }
}

// A Pure contains a function f that does *not* return a Free<M> but an M
function Pure(f) {
    return {
        ... Free,
        type: 'Pure',
        f
    }
}

// A Bind contains two functions, lhs and rhs, that return a Free<M>
function Bind(lhs, rhs) {
    return {
        ... Free,
        type: 'Bind',
        lhs,
        rhs
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
function flatMap(f, x) {
    let next = f(x)
    if (next.type === 'Pure') {
        return next.f(x)
    } else if (next.type === 'Bind') {
        let result = []
        let lhsResult = flatMap(next.lhs, x)
        for (let lhsValue of lhsResult) {
            result.push(...flatMap(next.rhs, lhsValue))
        }
        return result
    } else {
        throw new RangeError('Unknown Free type: [' + next.type + ']')
    }
}

const n = 7

// using the flatMap interpreter
console.log(flatMap(doubleBound, n))

// using Array.flatMap
console.log(count(n).flatMap(count).flatMap(count))
