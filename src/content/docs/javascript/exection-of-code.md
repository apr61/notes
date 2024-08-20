---
title: Code execution in js
date: 20/8/2024
---

Everything in JavaScript happens inside an **Execution context**.

|Memory|Code|
|------|----|
|key: value|------|
|a: 10|...|
|fn: {...}|....|

Memory is also called **Variable Environment**.
Code is also called **Thread of Execution**

- JavaScript is a **synchronous single threaded language**.
- Can execute one command at a time and in a sequence.

- An Execution context is created when a js code is run.

```js
var n = 2
function square(n){
    var ans = n * n
    return ans
}
var square2 = square(n)
var square4 = square(4)
```

### Execution context is created in two phases

1. Memory creation phase

|Memory|Code|
|------|----|
|n: undefined|------|
|square: function square(n){var ans = n * n; return ans;}|...|
|square2: undefined|...|
|square4: undefined|...|

2. Code execution phase
In this phase value is assigned to variables 

|Memory|Code|
|------|----|
|n: 2|--|
|square: function square(n){var ans = n * n; return ans;}|...|
|square2: undefined|...|
|square4: undefined|...|

When ever a function is invoked, a brand new execution context is created.

- Step-2 : square(n) when invoked, execution context is created.

```js
function square(n){
    var ans = n * n
    return ans
}
```

- Local execution context 

1. Memory phase

|Memory|Code|
|------|----|
|num: undefined|--|
|ans: undefined|...|

2. Code execution phase 

|Memory|Code|
|------|----|
|num: 2| num * num|
|ans: 4| return ans|

- After calculation is done, contolled is returned back to global execution context. And the current execution context is deleted.

- Global context
|Memory|Code|
|------|----|
|n: 2|--|
|square: function square(n){var ans = n * n; return ans;}|...|
|square2: 4|Step-2|
|square4: undefined|...|

Again Same step-2 process is created for square(4) function calling.

|Memory|Code|
|------|----|
|n: 2|--|
|square: function square(n){var ans = n * n; return ans;}|...|
|square2: 4|Step-2|
|square4: 16|...|

- After completion of execution, the global context is also deleted.

## Call stack
1. At bottom we have Global Execution Context. 
2. Whenever a new execution context is created, it is added at top of the callstack. After completion, execution context is poped from top.
3. After Everything is run, GEC is also removed and call stack becomes empty.

> Call stack maintains the order of execution of *Execution contexts*.

Call stack is also known as
1. Execution context stack
2. Program stack
3. Control stack
4. Runtime stack
5. Machine stack

