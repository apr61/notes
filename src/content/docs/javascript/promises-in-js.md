---
title: Promises in javascript
date: 18/8/2024
---

A promise is an object that represents eventual completion or failure of an asynchromous operation.

### Promise States

Promise has three states.
1. Pending
2. Fulfilled
3. Rejected

- As soon as promise is fulfilled/rejected, the empty object which is assigned undefined in pending state.
- A promise resolves only once and it is immutable.
- Using `.then()` we can control when we call the callback function.
- To avoid callback hell (Pyramid of doom), we use promise chaining. This way code exapnds vertically instead of horizontally.

#### Promise  lingo's

settled => got result

- resolve / reject
- success / failure
- fulfilled / rejected


#### Creating a promise

```js

function createOrder(cart){
    const pr = new Promise((resolve, reject) => {
        // create order
        // Validate cart

        if(validateCart(cart) === false){
            const err = new Error("Cart is not valid")
            reject(err)
        }

        // logic to create order
        const orderId = "12345"
        if(orderId){
            setTimeout(() => {
                resolve(orderId)
            }, 4000)
        }
    })
    return pr;
}

function validateCart(cart){
    return true
}

const promise = createOrder(cart)

promise.then((orderId) =>{
    console.log(orderId)
})

```

#### Rejecting a promise

```js

function createOrder(cart){
    const pr = new Promise((resolve, reject) => {
        // create order
        // Validate cart

        if(validateCart(cart) === false){
            const err = new Error("Cart is not valid")
            reject(err)
        }

        // logic to create order
        const orderId = "12345"
        if(orderId){
            setTimeout(() => {
                resolve(orderId)
            }, 4000)
        }
    })
    return pr;
}

function validateCart(cart){
    return false
}

const promise = createOrder(cart)

promise
.then((orderId) =>{
    // Promise resolve
    console.log(orderId)
})
.catch((err) => {
    //Promise reject
    console.log(err)
})

```

#### Promise chaining

```js

const promise = createOrder(cart)

promise
.then((orderId) =>{
    // Promise resolve
    console.log(orderId)
    // Return the data/ promise that can be used for promise chaining
    return orderId
})
.then((orderId) => { // Promise chaining
    return proceedToPayment(orderId)
})
.then((paymentInfo) => {
    console.log(paymentInfo)
})
.catch((err) => { // Catch will handle any error that is thrown by any `then`
    //Promise reject
    console.log(err)
})
.then(() => {
    console.log("This will be called, if there are any errors or not")
})

function proceedToPayment(orderId){
    return new Promise((resolve, reject) => {
        resolve("Payment successfull")
    })
}

```

---

### Promise API's 
1. Promise.all()
2. Promise.allSettled()
3. Promise.race()
4. Promise.any()

#### Promise.all()
- Make parallel api calls and get the results.
- Handle multiple promises.
- It takes an array of promises.
- `Promise.all()` waits for all promises to finish and returns the result in the form of array.
- If any promise gets rejected, `Promise.all()` will stop the execution and return the same error that is thrown. It will not wait for other promises.

```js

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p2 success")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3 success")
    }, 3000)
})

const promise = Promise.all([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})

```

```sh
[ 'p1 success', 'p2 success', 'p3 success' ]
```

Making a promise reject.

```js

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p2 success")
        reject("p2 error")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3 success")
    }, 3000)
})

const promise = Promise.all([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
})

```

```sh
p2 error
```

---

#### Promise.allSettled()
- It will wait for all promises to be settled, even if a promise gets rejected and returns the value.
- It is the safest option amoung all promise api's.

```js

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p2 success")
        reject("p2 error")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3 success")
    }, 3000)
})

const promise = Promise.allSettled([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
})

```

```sh
[
  { status: 'fulfilled', value: 'p1 success' },
  { status: 'rejected', reason: 'p2 error' },
  { status: 'fulfilled', value: 'p3 success' }
]
```

---

#### Promise.race()
- It will give the value of the **first settled** promise.
- If the **first settled** promise gets rejected, `Promise.race()` returns the error.
- It will not wait for other promises to be settled.

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p2 success")
        reject("p2 error")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3 success")
    }, 3000)
})

const promise = Promise.race([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
})
```

```sh
p2 error
```

---

#### Promise.any()
- It will wait for **first promise to get resolved / successfull**.
- Even if a promise gets rejected, `Promise.any()` won't throw any error.
- It will only wait for `resolved` promise.
- If every promise is rejected, then an **Aggregate error** is returned. It is an array of all errors.

```js

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p2 success")
        reject("p2 error")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3 success")
    }, 3000)
})

const promise = Promise.any([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
})

```

```sh
p3 success
```

Here `p3` value is returned, even if `p2` got failed. 

- What if all promises were rejected/ failed.


```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p1 success")
        reject("p1 error")
    }, 5000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p2 success")
        reject("p2 error")
    }, 1000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        //resolve("p3 success")
        reject("p3 error")
    }, 3000)
})

const promise = Promise.any([p1, p2, p3])

promise
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
    console.log(err.errors)
})

```

```sh
ERROR!
[AggregateError: All promises were rejected] {
  [errors]: [ 'p1 error', 'p2 error', 'p3 error' ]
}
[ 'p1 error', 'p2 error', 'p3 error' ]
```

---