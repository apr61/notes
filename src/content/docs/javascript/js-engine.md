---
title: JS Engine Architecture
date: 20/8/2024
---

JavaScript Runtime Environemnt
- It is a big container that has all the required API's to run the JavaScript code.
- JS Engine + API's + Event Loop + Callback Queue + Microtask Queue 

## JavaScript Engine 
- Each and every JS Engine must follow ECMAScript language standards.
- It is not a machine.
- The JS Engine takes the JS code as input.

Code -> PARSING -> COMPILATION -> EXECUTION

### PARSING
- The code is broken into **tokens**.
- **Syntax Parser** : Takes the code and generates the **AST (Abstract Syntax Tree)**.
- The generated AST is passed down to **COMPILATION**.

### COMPILATION
- JIT (Just In Time Compilation) => Interpretter + Compiler
- JavaScript can behave sometimes like an Interpretter language or a Compiled language. It all depends on the JS Engine.
- Initially JS was an Interpretter language. Nowadays, most of the browsers use an Interpretter and a Compiler both combined.
- AST that is generated in PARSING goes to the Interpretter. The Interpretter converts the High level to byte code and sends for EXECUTION.
- While the Interpretter is doing the conversion line by line, the Compiler also tries to optimize as much as it can.

### EXECUTION
- Execution is possible because of two components.
    1. Call stack
    2. Heap memory
- Heap memory : Where all the memory is stored. It is constantly insync with the Call Stack, Garbage collector, etc..

#### Garbage collector
- It tries to free up memory space whenever it is possible.
- An algorithm is used called as **Mark and Sweep algorithm** for Garbage collection.

#### Things done by Compiler
1. Inlining
2. Copy elision
3. Inline Caching


#### V8 JS Engine Architecture
![V8 JS Engine Architecture](https://miro.medium.com/v2/resize:fit:720/format:webp/0*ISypeZUo6NggTMff.png)
- Fastest JS Engine.
- It has `Orinoco` Garbage collector, which uses Mark and Sweep algorithm.
