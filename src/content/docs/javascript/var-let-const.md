---
title: Var vs let vs const in js
date: 20/8/2024
---


## Var
1. The scope of a `var` variable is functional or global scope.
2. It can be updated or redeclared in the same scope.
3. It can be declared without initialization.
4. Can be accessed without initialization because it's default value is undefined.
5. These variables are hoisted.

## Let
1. The scope of a `let` variable is block scoped.
2. It can be updated but not redeclared in the same scope.
3. It can be declared without initialization.
4. It cannot be accessed without initialization otherwise it will give `reference error`.
5. These variables are hoisted but stay in temporal dead zone until initialization.

## const
1. The scope of `const` variable is block scoped.
2. It cannot be updated or redeclared in any scope.
3. It cannot be declared without initialization.
4. It cannot be accessed without initialization because it can't be declared.
5. These variables are hoisted but stay in temporal dead zone until initialization.

## Temporal Dead zone
It is the phase from which a variable is hoisted and gets initialized.

## Block scope
- A **block** is used to combine multiple javascript statements together.
```js
{
    //Compound statement
    var a = 10;
    console.log(a);
}
```

- **Block Scope** - All the functions and variables that we can access in a block.

```js
{
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a)
    console.log(b)
    console.log(c)
}
```

Here, b,c are blockscoped, accessing them outside the block gives `reference error`. But for a we will 10.

## Shadowing

### With `var`
```js
var a = 100;
{
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a)
    console.log(b)
    console.log(c)
}

console.log(a)
```

### Output

```sh
10
20
30
10
```

### with `let`

```js
let b = 100;
{
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a)
    console.log(b)
    console.log(c)
}

console.log(b)
```

### Output

```sh
10
20
30
100
```

### with function scope 

```js
let a = 20;
function x(){
    var a = 100;
}
```

### Illegal Shadowing

```js
let a = 20;
{
    var a = 20;
}
```
- Gives reference error.