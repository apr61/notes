---
title: Functions in js
date: 20/8/2024
---

### Function statement / Function Declaration
```js
function a(){
    console.log("a called")
}
```

### Function expression
```js
var b = function (){
    console.log("b called")
}
```

#### Difference b/t function statement and function expression
- The main differnece is Hoisting.
```js
a()
b()
function a(){
    console.log("a called")
}
var b = function (){
    console.log("b called")
}
```
- Calling of function `a` before intialization works. But calling of `b` gives an error. 
- Because `a` is created in memory and gets intialized with the funtion. But `b` is treated like any other other variable which gets intialized to undefined initially and gets assigned to function when execution reaches the line.

### Anonymous function
A function without any name. It does not have it's own identity.
- Anonymous functions are used when functions are used as values.
- Anonymous functions must be assigned to be an variable to give a function name, else it will give an error.

```js
function (){

}
```

### Named function expression 

- Here the name `xyz` becomes a local scope. And it can be used inside the function.

```js
var b = function xyz(){
    console.log(xyz)
    console.log("Hello world")
}
b() // prints `Hello world`
xyz() // gives an error => Reference error
```

### Difference b/w Parameters and arguments
- **Arguments** : These are variables that are passed to a function when it is called.
- **Parameters** : Parameters are identifiers that get the values which are passed to that function.

```js
//           Parameters
//           |   
function add(a,b){
    console.log(a+b)
}

add(3,5)
//  |
//  Arguments
```

### First Class functions
The ability to use functions as values is called as First Class Functions.
- Like passing a function as variable to other functions.
- Functions can be returned by another functions.
- Functions can be assigned as a value to a variable.

### Arrow functions 
- Introduced in ES6.

## Callback functions 
Passing of functions as a variable to other functions is called as **Callback functions**.
- Callback functions gives us the power of asyncronous behaviour.

#### setTimeout Example
- Javascript engine will register a setTimeout
- setTimeout will take a function and store it in a separate space and attach a timer to it.

```js
setTimeout(function (){
    console.log("Timer")
}, 5000)

function x(y){
    console.log("x")
    y()
}

x(function y(){
    console.log("y")
})
```

#### Eventlisteners

```html
<html>
    <head></head>
    <body>
        <button id="btn">Click me</button>
    </body>
</html>
```

```js
document.getElementById("btn").
addEventListener("click", function(){
    console.log("CLicked")
})
```

Get the number of times the button is clicked without using global variable.

### Using closures

```js
function attachEventListener(){
    let count = 0;
    document.getElementById("btn").
    addEventListener("click", function(){
        console.log("CLicked", ++count)
    })
}
attachEventListener()
```

#### Issues with callback functions
1. Callback hell 
2. Inversion of control

**Callback Hell**: When a function is passed as argument to another function, it becomes a callback function. This process continues and there are many callbacks inside another's callback function. This grows the code horizontally instead of vertically. This mechanism is known as **Callback hell**. This phenomenon is called as **Pyramid of Doom**.

```js
const cart = ["shoes", "shirts"]

api.createOrder(cart, () => {
    // We don't know whether this function gets called or not.
    api.proceedToPayment(() => {
        api.showOrderSumary(() => {
            api.updateWallet(() => {
                // code
            })
        })
    })
})

```

**Inversion of Control**:  Loose the control of code when we use callbacks. 
```js
const cart = ["shoes", "shirts"]

api.createOrder(cart, () => {
    // We don't know whether this function gets called or not.
    api.proceedToPayment()
})

```

### Garbage collection and removeEventListners
- Eventlisteners are heavy. It takes up memory.
- Event listeners forms closures and if we don't remove them it will take a lot of memory and our webpage can become slow.
