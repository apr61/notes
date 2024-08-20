---
title: Lambda functions in C++
date: 20/8/2024
---

### Callable / Functors

A Callable/ Functors object is something that can be called like a function. The operator overload of `()` makes a callable.

#### Example
```c++
class cA
{
    int m_i;

public:
    cA(int arg = -1) : m_i(arg)
    {
    }
    void m_fun1() const
    {
        cout << "cA :: m_fun1: m_i = " << m_i << "\n";
    }
    void m_fun2() const
    {
        cout << "cA :: m_fun2: m_i = " << m_i << "\n";
    }
    void operator () (int id = 0) // Callable
    {
        switch (id)
        {
        case 1:
            m_fun1();
            break;
        default:
            m_fun2();
            break;
        }
    }
};
int main()
{
    cA obj;
    obj(1); // callable
    obj();
    return 0;
}
```

```sh
cA :: m_fun1: m_i = -1
cA :: m_fun2: m_i = -1
```

## Lambda Functions (C++ 11)

C++ Lambda expression allows us to define anonymous function objects (functors) which can either be used inline or passed as an argument.

#### Lambda parts 

[1] (2) 3 4 -> 5 {6}
1. Capture
2. Arguments
3. const/mutable
4. Exception throw
5. Return type
6. Body

```c++
int main()
{
    auto add = [](int x, int y) -> int
    {
        return x + y;
    };
    cout << "typeid(add).name = " << typeid(add).name() << "\n";
    cout << "add(10,15) = " << add(10, 15) << "\n";
    return 0;
}
```

```sh
typeid(add).name = Z4mainEUliiE_
add(10,15) = 25
```

> __NOTE__: Lambda parts 3,4,5 can be removed it is still a valid lambda calling. We can also remove Lambda part 2, if we don't want any arguments to be passed.

### Capture clause

Capture clause can apture all variables that are till the lambda function.

1. Capture variable by value

```c++
int main()
{
    int li = 100;
    int lj = 200;
    auto add = [li](int x, int y) -> int
    {
        return x + y + li;
    };
    cout << "add(10,15) = " << add(10, 15) << "\n";
    return 0;
}
```

```sh
add(10,15) = 125
```

2. Capture all variables by value

```c++
int main()
{
    int li = 100;
    int lj = 200;
    auto add = [=](int x, int y) -> int
    {
        return x + y + li + lj;
    };
    cout << "add(10,15) = " << add(10, 15) << "\n";
    return 0;
}
```


```sh
add(10,15) = 325
```

3. Capture variable by reference

```c++
int main()
{
    int li = 100;
    int lj = 200;
    cout << "li = "<< li << endl; 
    auto add = [&](int x, int y) -> int
    {
        li = 10;
        return x + y + li + lj;
    };
    cout << "add(10,15) = " << add(10, 15) << "\n";
    cout << "li = "<< li << endl; 
    return 0;
}
```


```sh
li = 100
add(10,15) = 235
li = 10
```

4. Capture all variables by reference
```c++
int main()
{
    int li = 100;
    int lj = 200;
    cout << "li = "<< li << endl; 
    cout << "lj = "<< lj << endl; 
    auto add = [&](int x, int y) -> int
    {
        li = 10;
        lj = 20;
        return x + y + li + lj;
    };
    cout << "add(10,15) = " << add(10, 15) << "\n";
    cout << "li = "<< li << endl; 
    cout << "lj = "<< lj << endl; 
    return 0;
}
```


```sh
li = 100
lj = 200
add(10,15) = 55
li = 10
lj = 20
```

### Const/Mutable

If we want to modify captured pass by value variables we can `mutable` in Lambda Function prototype. And modified value not gets reflected outside of lambda function.

```c++
int main()
{
    int li = 100;
    int lj = 200;
    cout << "li = "<< li << endl; 
    cout << "lj = "<< lj << endl; 
    auto add = [=](int x, int y) const -> int
    {
        li = 10;
        lj = 20;
        return x + y + li + lj;
    };
    cout << "add(10,15) = " << add(10, 15) << "\n";
    cout << "li = "<< li << endl; 
    cout << "lj = "<< lj << endl; 
    return 0;
}
```


```sh
li = 100
lj = 200
add(10,15) = 55
li = 100
lj = 200
```

#### Example 1
```c++
int main()
{
    auto fun = [](){ return 56; };
    cout << "fun() = " << fun() << endl;
    return 0;
}
```

```sh
fun() = 56
```
