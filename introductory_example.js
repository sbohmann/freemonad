function Pure(f) {
    return {
        type: 'Pure',
        f,
        bind(next) {
            return Bind((x) => this, next)
        }
    }
}

function Bind(lhs, rhs) {
    return {
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

console.log(lift(count)(7))

let lifted = lift(count)

// manual binding in lieu of an >>= operator
let bound = (x) => lifted(x).bind(lifted)

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

console.log(flatMap(bound, 7))
