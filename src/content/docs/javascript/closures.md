---
title: Closures in js
date: 20/8/2024
---

A **closure** is the combination of a function bundled together with reference to its lexical scope/environment. (or)
A **closure** can gives access to outer function scope from an inner function.

#### Example 1
```js
function x(){
    var a = 7;
    function y(){
        console.log(a);
    }
    y()
}
x()
```
```sh
7
```

#### Example 2
```js
function x(){
    var a = 7;
    function y(){
        console.log(a);
    }
    return y
}
var z = x()
console.log(z)
z()
```
```sh
y(){
    console.log(a)
}
7
```

#### Example 3
```js
function x(){
    var a = 7;
    function y(){
        console.log(a);
    }
    a = 100;
    return y
}
var z = x()
console.log(z)
z()
```
```sh
y(){
    console.log(a)
}
100
```

#### Example 4
```js
function z(){
    var b = 500
    function x(){
        let a = 7;
        function y(){
            console.log(a, b);
        }
        y()
    }
    x()
}
z()
```
```sh
7, 500
```

## Uses of Closures
    1. Module Design Pattern
    2. Currying
    3. Functions like once
    4. memoize
    5. maintaining state in `async` world
    6. setTimeouts
    7. Iterators

## Disadvantages of closures
    - Over consumption of memory because to keep track of lexical environment. And these variables are not garbage collected till the program expiress and lead to memory leaks.

## Important questions

#### Q 1

```js
function x(){
    var i = 0;
    setTimeout(function(){
        console.log(i)
    }, 3000)
    console.log("hello world")
}
x()
```

First "hello world" is printed and after 3s i value is printed.

#### Question 2
```js
function x(){
    for(var i = 0; i <= 5; i++){
        setTimeout(function(){
            console.log(i)
        }, i * 1000)
    }
    console.log("hello world")
}
x()
```

```sh
hello world
6
6
6
6
6
6
```

- **Sol 1**:  Using `let`

```js
function x(){
    for(let i = 0; i <= 5; i++){
        setTimeout(function(){
            console.log(i)
        }, i * 1000)
    }
    console.log("hello world")
}

x()
```

```sh
hello world
0
1
2
3
4
5
```
Here, let variable is block scoped, so each iteration a new copy of i is created, and setTimeOut references to new copy of i.

- **Sol 2**: Using closures

```js
function x(){
    for(var i = 0; i <= 5; i++){
        function close(x){
            setTimeout(function(){
                console.log(x)
            }, x * 1000)
        }
        close(i)
    }
    console.log("hello world")
}

x()
```

#### Question 3

```js

function counter(){
    var count = 0;
    return function incrementCounter(){
        count++;
        console.log(count)
    }
}

var counter1 = counter()
var counter2 = counter() // creates a fresh copy
counter1()
counter1()
counter2() // starts from 1
counter2()
```
```sh
1
2
1
2
```

#### Question 4

```js
function Counter(){
    var count = 0;
    this.incrementCounter = function (){
        count++;
        console.log(count)
    }
    this.decrementCounter = function (){
        count--;
        console.log(count)
    }
}

var counter1 = new Counter()
counter1.incrementCounter()
counter1.decrementCounter()
```