---
title: Hoisting in js
date: 20/8/2024
---


```js
var x = 7
function getName(){
    console.log("Hello world")
}
getName()
console.log(x)
```

```bash
Hello world
7
```
- Here, we are accessing `x` before even it is initialized

```js
getName()
console.log(x)
var x = 7
function getName(){
    console.log("Hello world")
}
```

```bash
Hello world
undefined
```

- this is called **Hoisting** in JS.

An execution context is created for each and every variable and function. Variables are initialized to undefined and function gets there whose definition.
That is the reason why we are getting `undefined` for x.

Like the same if we try for 

```js
console.log(getName)
var getName = () => {
    console.log("Hello world")
}

console.log(getName2)
var getName2 = function (){
    console.log("Hello world")
}
```

- Here we will get `undefined`. In this case `getName` is also considered as a variable.

