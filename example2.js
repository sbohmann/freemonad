class Free {
}

class Return extends Free {
    constructor(result) {
        super()
        this._result = result
    }

    get result() {
        return this._result
    }
}

class FlatMap extends Free {
    constructor(result, f) {
        super()
        this._result = result
        this._f = f
    }

    get result() {
        return this._result
    }

    get f() {
        return this._f
    }
}

function compose(f) {
    function interpret(free) {
        if (free instanceof Return) {
            return free.result
        } else if (free instanceof FlatMap) {
            return free.result.flatMap(x => interpret(free.f(x)))
        }
    }
    return x => interpret(f(x))
}

function count(x) {
    let result = []
    for (let index = 0; index < x; ++index) {
        result.push(index)
    }
    return new Return(result)
}

function example(x) {
    let result = [x, x / 2, x / 4]
    if (x >= 10) {
        return new FlatMap(result, digits)
    } else {
        return new Return(result)
    }
}

function digits(x) {
    return new Return(Array.from(x.toString()))
}

function fbind(...f) {
    if (f.length < 1) {
        throw new RangeError()
    } else if (f.length === 1) {
        return f[0]
    } else {
        return x => {
            let free = f[0](x)
            if (free instanceof Return) {
                return new FlatMap(free.result, fbind(...f.slice(1)))
            } else if (free instanceof FlatMap) {
                return new FlatMap(free.result, fbind(free.f, ...f.slice(1)))
            }
        }
    }
}

console.log(compose(fbind(count, example))(12))
