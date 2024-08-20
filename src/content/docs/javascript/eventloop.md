---
title: Event loop in js
date: 20/8/2024
---

Javascipt is a single threaded language and it can do only one thing at a time. It has only one Call stack.
Call stack is inside the JS Engine.

## Web API's
- Not a part of JS 
- Accessed with `window`
1. setTimeout()
2. DOM API's
3. fetch()
4. localStorage
5. console
6. location

#### How a setTimeout works
When ever we use setTimeout, setTimeout registers the callback function in the web api's environment of the browser, that is passed to it and attaches a timer to the function. And when the timer expires, the function is called an added to the callstack, the Global Execution Context is created and executed.
But the working is not that simple. Before moving to the call stack, the callback function is placed in the callback queue.

### Callback Queue
After the timer gets expired, the callback function is put inside the Callback Queue. The **event lopp** checks whether the call stack is empty or not. If call stack is empty, pushes the callback function from Callback queue to call stack and callback function is removed from the Callback Queue.
Then the call stack creates an Execution Context and excutes the callback function. 
- The Callback Queue is also called as Task Queue or Macrotask Queue or Event Queue.

![Callback Queue Working](https://media.geeksforgeeks.org/wp-content/uploads/20210328211825/async1-660x247.png)

### Event loop
The event loop is responsible for executing the code, collecting and processing events and executing queued sub-tasks.
- Continously monitor the Call stack, Callback Queue and Microtask Queue.
- Event loop gives higher priority to Microtask Queue.
- There is a possiblity that callbacks in Callback Queue can go into **Starvation**, because of Microtask Queue callback functions.

#### How `fetch()` works

```js
console.log("Start")

fetch("example.com")
.then(function cbF(){
    console.log("CB example")
})

console.log("End")
```
- Fetch registers the callback function `cbF()` to the Web API's environment of the browser. Whenever the fetching of data is done. The callback function is placed to the **Macrotask Queue**. Here also the event loop checks if the call stack is empty, if it is empty the callback function that is placed in the Microtask queue will be placed in the call stack and removed from Microtask queue. And a Execution Context is created for the callback function and executed.

### Microtask Queue
Microtask Queue is similar to Callback Queue, but it has **higher priority**. 
All callback functions coming through **Promises** and **Mutation Observers** will go inside the Microtask Queue.

