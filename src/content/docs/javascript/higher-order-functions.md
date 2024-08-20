---
title: Higher order functions in js
date: 20/8/2024
---

A function that takes a function as an argument or returns a function from it, is called a Higher Order Function.


```js
// x() is a callback function
function x(){
    console.log("Hello worlds")
}

// y() is a Higher Order Function
function y(x){
    x()
}
```

### Example use of HOF

```js
const area = function (radius) {
    return Math.PI * radius * radius
}

const circumference = function (radius){
    return 2 * Math.PI * radius
}

const diameter = function (radius) {
    return 2 * radius
}

const calculate = function (radius, logic){
    const output = [];
    for(let i = 0; i < radius.length; i++){
        output.push_back(logic(radius[i]))
    }
    return output
}

const radius = [1, 3, 9, 18]

console.log(calculate(radius, area))
console.log(calculate(radius, circumference))

```

We are making the `calculate()` modular and reusable. The `calculate()` is similar to `map()` method.
We can create our own `map()` method using `prototype`.


```js

Array.prototype.calculate = function (logic){
    const output = [];
    for(let i = 0; i < this.length; i++){
        output.push_back(logic(this[i]))
    }
    return output
}

console.log(radius.calculate(area))
console.log(radius.calculate(circumference))

```

## prototype
- Every object in javascript has a built-in property, which is called its **prototype**.
- The `prototype` is itself an object, so the prototype will have its own prototype, making what's called a **prototype chain**.
- The chain ends when we reach a prototype that has `null` for its own prototype.

> Note: The property of an object that points to its own prototype is not called `prototype`. It is not a standard name, but in practice all browsers use `__proto__`.

### prototype chain example

#### Array chain

```js

// Create an array
const myArray = [1, 2, 3];

// Accessing a method from Array.prototype
console.log(myArray.length); // Output: 3

// Accessing a method from Array.prototype
myArray.push(4); 
console.log(myArray); // Output: [1, 2, 3, 4]

// Accessing a method from Object.prototype
console.log(myArray.toString()); // Output: "1,2,3,4"

Array.prototype.myMethod = function (){
    console.log(this[0])
}

console.log(myArray.__proto__)
// Array []

console.log(myArray.__proto__.__proto__)
// Object {}

console.log(myArray.__proto__.__proto__.__proto__)
// null

```

```
myArray --> Array.prototype --> Object.prototype --> null
```

#### Object chain

```js
// Create a simple object
const myObject = {
  name: "Alice"
};

// Accessing a property on the object
console.log(myObject.name); // Output: "Alice"

// Accessing a method from Object.prototype
console.log(myObject.toString()); // Output: "[object Object]"

console.log(myObject.__proto__) 
// Object {}

console.log(myObject.__proto__.__proto__) 
// null

```

```
myObject --> Object.prototype --> null
```

#### Function chain

```js
// Create a function
function add() {
  console.log("Hello, World!");
}

console.log(add.__proto__)
// function ()

console.log(add.__proto__.__proto__)
// Object {}

console.log(add.__proto__.__proto__.__proto__)
// null

```

```
add --> Function.prototype --> Object.prototype --> null
```

#### Inheriting methods

```js

const parent = {
    value: 2,
    method(){
        return this.value + 1
    }
}

console.log(parent.method()) // 3

const child = {
    __proto__: parent
}

console.log(child.method()) // 3
// when child.method is called, 'this' refers to child. 
//The property 'value' is seek on child. Since, child doesnot have an own property called 'value', 
//the propery is found on the [[Prototpye]], which is parent.value.

child.value = 4 // assign the value 4 to property 'value on child
// This shadows the 'value' property on parent.

// The child property looks like
// {value: 4, __proto__: {value: 2, method: [Function]}}
console.log(child.method())

```

