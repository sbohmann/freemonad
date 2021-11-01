# Introduction

An interpreter is a piece of code that has an opinion on how to monadically bind functions.

The functions may return e.g. lists, sets, observables, &c.

There are different ways to monadically bind functions that return lists,
e.g. flatMap, which concatenates the results, just applying the first result,
just applying the last result (which bindLast does in the examples), and many others.

The purpose of Free Monads & an interpreter is to allow choosing which way to use very late,
e.g. at the time of execution.

## Glossary

A Free is a data structure used by an interpreter.

A Free is either a Pure or a Bind (A Bind is also sometimes called Roll, FlatMap, &c.).

M is the term used for the functions' result type, like a List, Set, Observable, ..., as mentioned above.

A lifted function is a function that returns a Free instead of an M.

lift(f) takes a function f that returns an M and turns it into a function that instead returns a Pure
that contains the result of calling f.

A Pure contains an M, which is the result of a call of a lifted function.

A Bind contains a Free, named lhs, and a lifted function, named rhs.

lhs, rhs correspond to "left-hand side" and right-hand side, as would be the order in lhs >>= rhs,
if a bind operator >>= was used.

Control and data flow from lhs to rhs.

bind(...) is the equivalent of >>=

- bind() returns undefined
- bind(f) returns f
- bind(f, g) returns the equivalent of f >>= g
- bind(f, g, h) returns the equivalent of f >>= g >>= h
- &c.

## The Two Examples

There are two examples, one using simple data structures that use a String as a discriminator,
which I do not generally recommend in production code but which makes the example more accessible
when trying to grasp what is a Free Mondad.

The other one uses callbacks, which makes the implementation of interpreters much more pleasant. 

### Using Discriminator Strings: introductory_example.js

This example defines Pure and Bind as procedural-style data structures with String discriminators.

This eliminates having to think about these data structures as functions when at the same time
everything is already full of functions.

### Using Callbacks: minimal_example.js

This example uses callbacks, which makes the interpreters' implementation so much more straightforward
at the cost of adding one more layer of functions to an already extremely functional topic.

The methods called "accept" are named like this because the callbacks are part of the Visitor pattern. 

### What Do the Examples Demonstrate?

Both examples contain two different interpreters each.

Their output will show:

- count >>= count >>= count >>= count, called with 7 as the initial argument, using the flatMap interpreter
- count >>= count >>= count >>= count, called with 7 as the initial argument, using the Array.flatMap
- count >>= count >>= count >>= count, called with 7 as the initial argument, using the bindLast interpreter

count is a function that for e.g. 3 returns \[0, 1, 2], counting from zero up to one less than three.

## The Missing Optimization

Bind's lhs will be traversed, seeking the original Pure's result, a lot of times
when a lot of functions are bound together and a lot of results are processed.

I will add an optimized version of the example, which will eliminate the recursive search for
the result by discriminating between Pure and Bind in Bind's constructor.

This will probably be perfectly readable after having understood the introductory and minimal
examples but not serve as a good starting point 🙂
