---
title: Async - await in js
date: 20/8/2024
---

### async
- `async` function always returns a promise.
- In a async function we return a promise / the async function wrap the result in a promise and return it.

```js
async function getData(){
    return "Hello world"
}

const data = getData()

console.log(data)

data.then((res) => {
    console.log(res)
})

```

```sh
Promise { 'Hello world' }
Hello world
```

```js

const p = new Promise((resolve, reject) => {
    resolve("Hello world")
})

async function getData(){
    return p
}

const data = getData()

console.log(data)

data.then((res) => {
    console.log(res)
})

```

```sh
Promise { <pending> }
Hello world
```

### await
- `await` is keyword, that can only be used inside an `async` function.
- `await` is added infront of a promise. And it settles the promise.
- `async` and `await` are used to handle promises.
- Prior to `async`-`await`, promises were handled with the help of `.then()`. 

```js
const p = new Promise((resolve, reject) => {
    resolve("Hello world")
})

async function getData(){
    const data = await p
    console.log(data)
}

getData()
```

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})

async function getData(){
    const data = await p
    console.log(data)
}

getData()
```

### Difference b/w async - await and Promise.then/catch

- then/catch

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})

function getData(){
    p.then((res) => {
        console.log(res)
    })
    console.log("Normal .then()")
}

getData()

```

```sh
Normal .then()
Hello world
```

- async - await

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})

async function getData(){
    const data = await p
    // the JS Engine will wait till the setTimeout is expired and then it execute next line.
    console.log("async-await")
    console.log(data)
}

getData()
```

```sh
async-await
Hello world
```

#### Examples

- Example 1

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})

async function getData(){
    const data = await p
    console.log("async-await 1")
    console.log(data)
    const data1 = await p
    console.log("async-await 2")
    console.log(data1)
}

getData()
```

- Example 2

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 10000)
})


async function getData(){
    const data = await p1
    console.log("async-await 1")
    console.log(data)
    const data1 = await p2
    console.log("async-await 2")
    console.log(data1)
}

getData()
```

- Example 3

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 10000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello world")
    }, 5000)
})


async function getData(){
    const data = await p1
    console.log("async-await 1")
    console.log(data)
    const data1 = await p2
    console.log("async-await 2")
    console.log(data1)
}

getData()
```

#### Internal working of Async - Await 
- Whenever async function is called, JS Engine pushes the async function to the call stack. And starts the execution of the function. Whenever `await` keyword is encountered, the execution of the async function is suspended.
- And when the promise gets settled, the async function is pushed backed to call stack and execution is continued from the point of suspended.
- When the async function is suspended, it goes to the **microtask queue** for promise settlement. When the settlement is done, it geets back to main thread and all this movements of the async function is done by the **event loop**.

#### Real world Example

```js

const API = "https://api.github.com/users/apr61"
async function getData(){
    console.log("Hi")
    const data = await fetch(API)
    const jsonData = await data.json()
    console.log(jsonData)
}

getData()

```

#### Error handling
```js

const API = "https://api.github.com/users/apr61"
async function getData(){
    try{
        const data = await fetch(API)
        const jsonData = await data.json()
        console.log(jsonData)
    } catch (error){
        console.error(error)
    }
}

getData()

```
