---
title: Lambda functions in C++
date: 20/8/2024
---

## Closure

A closure is the runtime object created by lambda. Depending on the capture mode, closures hold copies of or references to the captured data.

## Closure class

A closure class is a class from which a closure is instantiated. Each lambda causes compilers to generate a unique closure class. 

A lambda is often used to create a closure that's used only as an argument to a function.  Closures may generally be copied.


```c++
int main()
{
	int x = 10;
	auto c1 = [x](int y) {return x * y > 55;}; // c1 is copy of the 
						   // closure produced by lambda

	auto c2 = c1;  // c2 is copy of c1
	auto c3 = c2;  // c3 is copy of c2
}
```

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

```c++
[capture_list](parameters) const_mutable exception_throw -> return_type{
    //function_body
};
```

- ***capture_list*** : A list of variables from the surrounding scopen that the lambda function can access.
    - `=` can be used to capture surrounding variables by value
    - `&` can be used to capture surrounding varaibles by reference

- ***parameters*** : The list of input parameters.

- ***const_mutable*** : By befault the varaible captured by value are constant `const`. The behavior can be changed by adding the `mutable` keyword, which removes the constness from the lambda function.

- ***exception_throw*** : The `noexcept` specifier can be placed after the parameter list, which informs the compiler that lambda is guaranteed not to throw any exception.

- ***return_type*** : The type of the value that the lambda function will return.

- ***function_body*** : The code that defines the operation that a lambda function performs

- The capture_list and function_body are the required parts of a lambda function. Remaining other fields are optional.

```c++
int main()
{ 
    // A valid lambda function
    auto func = [] {
        std::cout << "Hello world"; 
    };
    
    func();

    return 0;
}
```

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

Capture clause can capture all variables that are till the lambda function.

#### Capture by reference

- A by-reference capture causes a closure to contain a reference to local variable or to a parameter that's available in the scope where the lambda is defined.

- If the lifetime of a closure created from that lambda exceeds the lifetime of the local variable or parameter, the reference in the closure will dangle.

```c++
using FilterContainer = std::vector<std::function<bool(int)>>;

FilterContainer filters;

void addDivisorFilter()
{
  auto calc1 = computeSomeValue1();
  auto calc2 = computeSomeValue2();
  auto divisor = computeDivisor(calc1, calc2);
  filters.emplace_back(                              
	[&](int value) { return value % divisor == 0; }  // Danger!, ref to 
							 // divisor will dangle!
  );       

  // The same problem will exist if by-reference capture were explicit
  filters.emplace_back(
  	[&divisor](int value)              // danger! ref to divisor 
  	{ return value % divisor == 0; }   // will still dangle!     
  );                                                                              
}     
                                               
```

#### Capture by value

- Default by-value capture is susceptible to dangling pointers (especially this).

- Captures apply only to non-static local variables (including parameters) visible in the scope where the lambda is created.

Lets consider below example

```c++
class Widget {
public:
  …                                  
  void addFilter() const;            
private:
  int divisor;                       
};

void Widget::addFilter() const
{
  filters.emplace_back(
	// we may assume that, divisor will be accessible 
	// in the lambda, but it won't.
	[=](int value) { return value % divisor == 0; }
  );
}
```

This issue is because of the implicit use of raw pointer: `this`. Every non-static member function has a `this` pointer. Inside member functions, compilers will replace divisor with this->divisor.

This can be resolved my making a local copy of the data member.

```c++
void Widget::addFilter() const
{
  auto divisorCopy = divisor;          // copy data member      
  filters.emplace_back(
	[divisorCopy](int value)       // capture the copy          
	{ return value % divisorCopy == 0; }    // use the copy 
  );
}
```

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
