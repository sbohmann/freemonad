function Return(result) {
    return {
        accept(interpreter) {
            return interpreter.return(result)
        }
    }
}

function FlatMap(result, f) {
    return {
        accept(interpreter) {
            return interpreter.flatMap(result, f)
        }
    }
}

function compose(f) {
    const interpreter = {
        return(result) {
            return result
        },
        flatMap(result, f) {
            return result.flatMap(x => f(x).accept(interpreter))
        }
    }
    return x => f(x).accept(interpreter)
}

function count(x) {
    let result = []
    for (let index = 0; index < x; ++index) {
        result.push(index)
    }
    return Return(result)
}

function example(x) {
    if (x >= 10) {
        return FlatMap([x], digits)
    } else {
        return Return([x])
    }
}

function digits(x) {
    return Return(Array.from(x.toString()))
}

function fbind(...f) {
    if (f.length < 1) {
        throw new RangeError()
    } else if (f.length === 1) {
        return f[0]
    } else {
        return x => f[0](x).accept({
            return(result) {
                return FlatMap(result, fbind(... f.slice(1)))
            },
            flatMap(result, next) {
                return FlatMap(result, fbind(next, ...f.slice(1)))
            }
        })
    }
}

console.log(compose(fbind(count, example))(20))
