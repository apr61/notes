---
title: Type Inference in C++
date: 20/8/2024
---

Automatic deduction of datatype of an expression.

Types of type inference
1. auto
2. decltype

### auto
The `auto` keyword deduces type from its intitializer.

In case of function, if the return type is auto then type will be evaluated by return type expression at run time.

1. Declaration
2. Definition
3. Initialization

#### The `auto` keyword does 2 things
1. To infer the type
2. Evaluate to get data and initialize

```c++
int main()
{
    auto li = 10 * 1.1;
    cout << "typeid(li).name() = " << typeid(li).name() << "\n";
    cout << "li = " << li << "\n";
    return 0;
}
```

###### Output
```sh
typeid(li).name() = d
li = 11
```

> __NOTE__:
> 1. The variable declared with `auto` keyword should be initialized at the time of its __declaration__ only or else there will be a __compile-time error__.
> 2. `auto` becomes `int` if a function returns an integer reference `int&`. To make it to reference type we use, `auto &`


### decltype
The `decltype` keyword inspects the declared type of an entity or type of an expression. `decltype` lets you extract the type from variable.

```c++
struct lType
{
    int i, j;
} sObj;

char gFun1() { return 'A'; }
void main()
{
    int y = 20;
    decltype(10) li;
    decltype(10 * 1.1) lj;
    decltype(gFun1()) lk;
    decltype(gFun1() + 1) ll;
    int &x = y;
    decltype(x) z = y;
    decltype(sObj) lm;
    cout << "typeid(li).name() = " << typeid(li).name() << "\n";
    cout << "typeid(lj).name() = " << typeid(lj).name() << "\n";
    cout << "typeid(lk).name() = " << typeid(lk).name() << "\n";
    cout << "typeid(ll).name() = " << typeid(ll).name() << "\n";
    cout << "typeid(lm).name() = " << typeid(lm).name() << "\n";
    cout << "typeid(z).name() = " << typeid(z).name() << "\n";
    cout << "li = " << li << "\n";
}
```

##### Output
```sh
typeid(li).name() = i
typeid(lj).name() = d
typeid(lk).name() = c
typeid(ll).name() = i
typeid(lm).name() = 5lType
typeid(z).name() = i
li = 32658
```
