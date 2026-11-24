---
title: References C++ 11
date: 17/11/2026
---

## LValue and RValue reference (C++ 11)

### LValue reference
LValue Reference can bind to existing __lvalues__. They could also bind to rvalues but only when the reference variable is declared as __constant__. The syntax for L value reference is same as regular reference variable __(Datatype&)__. 

### RValue reference
RValue Reference can only bind to __rvalues__. RValue reference can modify the value of rvalues which means reference variable need not to be constant. A rvalue reference is declared with two ampersands instead of one __(Datatype&&)__.  

```c++
int main()
{
    int x = 10;
    int& lref1 = x; // lvalue reference to lvalue
    const int& lref2 = 15; //lvalue reference to rvalue
    int&& rref = 20; //rvalue reference to rvalue

    std::cout << x << " " << lref1 << " " << lref2 << " " << rref << std::endl;
    rref = 100;
    x = 200;
    std::cout << x << " " << lref1 << " " << lref2 << " " << rref << std::endl;
    return 0;
}
```

```sh
10 10 15 20
200 200 15 100
```

RValue reference has potentially two usecases
1. Move semantics
2. Perfect Forwarding


## std::move

std::move and std::forward are merely functions (actually function templates) that perform casts. 
      - std::move unconditionally casts its argument to an rvalue, while
      - std::forward performs this cast only if a particular condition is fulfilled. 

- Do not declare objects const if you want to be able to move from them. Move requests on const objects are
silently transformed into copy operations. 

```c++
class string {            
public:                   
// std::string is actually a 
// typedef for std::basic_string<char>
  …
  string(const string& rhs);    // copy ctor
  string(string&& rhs);         // move ctor
  …
};
```

- std::move not only doesn’t actually move anything, it doesn’t even guarantee that the object it’s casting will be
eligible to be moved. 

- The only thing you know for sure about the result of applying std::move to an object is that it’s an rvalue.

Use `std::move` when you know the object should always be treated as an rvalue:

```c++
return std::move(member);
```


## std::forward

std::move unconditionally casts its argument to an rvalue, std::forward does it
only under certain conditions. std::forward is a conditional cast. 

std::forward is a conditional cast: it casts to an rvalue only if its argument was initialized with an
rvalue.

Neither std::move nor std::forward do anything at runtime.

Use `std::forward` when forwarding a universal/forwarding reference:

```c++
template<typename T>
void wrapper(T&& arg)
{
    target(std::forward<T>(arg));
}
```


## Universal reference vs rvalue reference

### rvalue reference

```c++
void f(Widget&& param); 	

Widget&& var1 = Widget();

template<typename T>
void f(std::vector<T>&& param);
```

### Universal reference (forwarding reference)

 “T&&” is either rvalue reference or lvalue reference. They can bind to 
	1. rvalues (like rvalue references)
	2. lvalues (like lvalue references)
	3. const or non-const objects
	4. volatile or non-volatile objects
	5. both const and volatile

They can bind to virtually anything.


Universal references arise in two contexts. 

```c++
// 1. Funtion templates

template<typename T>
void f(T&& param); 

// 2. auto declarations
auto&& var2 = var1;
```

What these contexts have in common is the presence of type deduction.
If you see “T&&” without type deduction, you’re looking at an rvalue reference.

-  If a function template parameter has type T&& for a deduced type T, or if an object is declared using auto&&, the parameter or object is a universal reference.

-  If the form of the type declaration isn’t precisely `type&&`, or if type deduction does not occur, `type&&` denotes an rvalue reference.

- Universal references correspond to rvalue references if they’re initialized with rvalues. They correspond to lvalue references if they’re initialized with lvalues.  


```c++

templates <typename T>
void f(T&& param);    // param is a universal reference


Widget w;
f(w);            // lvalue passed to f; param's type is 
                 // Widget& (i.e., an lvalue reference)


f(std::move(w));   // rvalue passed to f; param's type is
f(Widget{});       // Widget&& (i.e., an rvalue reference)

```

## std::move on rvalues references, std::forward on universal references

- rvalue references should be automatically cast to rvalues (via std::move) when forwarding them to other functions, because they are bound to rvalues

- Universal refernces should be conditionally cast to rvalues (via std::forward) when forwarding them, because they are sometimes bound to rvalues

Let's understand this with example

```c++

#include <iostream>
#include <memory>
#include <string>
#include <utility>

struct SomeDataStructure
{
    int value = 42;
};

class Widget
{
public:
    template<typename T>
    void setName(T&& newName)
    {
        name = std::move(newName);
    }

    const std::string& getName() const
    {
        return name;
    }

private:
    std::string name;
    std::shared_ptr<SomeDataStructure> p =
        std::make_shared<SomeDataStructure>();
};

std::string getWidgetName()
{
    return "Modern C++ Widget";
}

int main()
{
    Widget w;

    auto n = getWidgetName();

    std::cout << "Before setName:\n";
    std::cout << "n = " << n << '\n';

    w.setName(n);

    std::cout << "\nAfter setName:\n";
    std::cout << "Widget name = " << w.getName() << '\n';
    std::cout << "n = [" << n << "]\n";
}
```

#### Expected output

```sh
Before setName:
n = Modern C++ Widget

After setName:
Widget name = Modern C++ Widget
n = [Modern C++ Widget]
```

#### Actual output

```sh
Before setName:
n = Modern C++ Widget

After setName:
Widget name = Modern C++ Widget
n = []
```


Here, `n` is a valid but `n` value is a empty string. Because the value of `n` has been moved to object `w` when `w.setName(n);` call was made.

This happened because `n` is a lvalue, when lvalue is passed to universal reference, it becomes lvalue reference.

And we are using `std::move` where `std::forward` needs to be used. 


```c++
class Widget
{
public:
    template<typename T>
    void setName(T&& newName)
    {
        // Here, newName is always lvalue. Because it has a name.
        /*
            the wrapper remembers whether the caller passed:
            an lvalue → forward as lvalue
            an rvalue → forward as rvalue
        */
        name = std::fotward<T>(newName);
    }

    const std::string& getName() const
    {
        return name;
    }

private:
    std::string name;
    std::shared_ptr<SomeDataStructure> p =
        std::make_shared<SomeDataStructure>();
};
```

## Perfect Forwarding

Perfect forwarding reduces the need for overloaded functions and helps avoid forwarding problem. The forwarding problem can occur when we write a generic function that takes references as a parameter. Consider below example.

```c++
struct cA
{
    void m_fun(int & lRef)
    {
        cout<<"void m_fun(int & lRef)\n";
    }
    void m_fun(int && rRef)
    {
        cout<<"void m_fun(int && rRef)\n";
    }
}gobj;

template <typename T>
void gfun(T && arg) // Coined by Scott Meyers T&& => Universal reference
{
    gobj.m_fun(arg);
}

void main()
{
    int li = 10;
    gfun(li); // Passing lvalue
    gfun(100); // passing rvalue
}
```

#### Output
```sh
void m_fun(int & lRef)
void m_fun(int & lRef)
```

#### Expected Output
```sh
void m_fun(int & lRef)
void m_fun(int && rRef)
```

We solve above problem by using `std::forward` semantic.

```c++
struct cA
{
    void m_fun(int & lRef)
    {
        cout<<"void m_fun(int & lRef)\n";
    }
    void m_fun(int && rRef)
    {
        cout<<"void m_fun(int && rRef)\n";
    }
}gobj;

template <typename T>
void gfun(T && arg) // Coined by Scott Meyers T&& => Universal reference
{
    gobj.m_fun(std::forward<T&&>(arg));
}
void main()
{
    int li = 10;
    gfun(li); // Passing lvalue
    gfun(100); // passing rvalue
}
```

#### Output
```sh
void m_fun(int & lRef)
void m_fun(int && rRef)
```

- Perfect forwarding preserves the lvalue and rvalue nature.
- Without collapsing rules, perfect forward is impossible.

### Example

Lets consider `Widget` class, that has below special member functions.

```c++
class Widget{
public:
    Widget(std::string name)
    {
        std::cout << "constructor called, " << name << std::endl;
        m_name = std::move(name);
    }
    
    ~Widget()
    {
        std::cout << "destructor called, " << m_name << std::endl;
    }
    
    Widget(const Widget & rhs)
    {
        std::cout << "copy constructor called, " << rhs.m_name << std::endl;
        this->m_name = rhs.m_name;
    }
    
    Widget(Widget && rhs)
    {
        std::cout << "move constructor called, " << rhs.m_name << std::endl;
        this->m_name = std::move(rhs.m_name);
    }
    
    void get_name()
    {
        std::cout << "m_name :: " <<  m_name << std::endl;
    }
    
    void reduce()
    {
        std::cout << "reduce()" << std::endl;
    }

private:
    std::string m_name;
};
```

A template function `reduce_and_copy` that takes Widget object as input and calls Widget's `reduce` method and returns the widget object.

Lets see three different versions of this template function

### Scenario #1 - Plain return

```c++
template <typename T>
Widget reduce_and_copy(T&& widget)
{
    widget.reduce();
    return widget; // Always Copy constructor called
}

int main()
{
	Widget w1("Widget 1");
	w1.get_name();
	Widget w2 = reduce_and_copy(w1);
	w2.get_name();
	
	Widget w3 = reduce_and_copy(Widget{"Widget 3 temp"}); // rvalue reference
	w3.get_name();
}
```

#### output

```sh
constructor called, Widget 1
m_name :: Widget 1
reduce()
copy constructor called, Widget 1
m_name :: Widget 1
constructor called, Widget 3 temp
reduce()
copy constructor called, Widget 3 temp
destructor called, Widget 3 temp
m_name :: Widget 3 temp
destructor called, Widget 3 temp
destructor called, Widget 1
destructor called, Widget 1
```

Here, always the copy constructor is called, even though the object passed was a rvalue reference.


### Scenario #2 - `std::forward`

```c++
template <typename T>
Widget reduce_and_copy(T&& widget)
{
    widget.reduce();
    return std::forward<T>(widget); // Based on passed Widget, return will be
                                    // lvalue reference -> lvalue, copy constructor called
                                    // rvalue reference -> rvalue, move constructor called
}

int main()
{
	Widget w1("Widget 1");
	w1.get_name();
	Widget w2 = reduce_and_copy(w1); // lvalue passed 
	w2.get_name();
	
	Widget w3 = reduce_and_copy(Widget{"Widget 3 temp"}); // rvalue passed
	w3.get_name();
}
```

#### Output

```sh
constructor called, Widget 1
m_name :: Widget 1
reduce()
copy constructor called, Widget 1
m_name :: Widget 1
constructor called, Widget 3 temp
reduce()
move constructor called, Widget 3 temp
destructor called, 
m_name :: Widget 3 temp
destructor called, Widget 3 temp
destructor called, Widget 1
destructor called, Widget 1
```

Here, the appropriate constructor is called based on the arguments passed.


### Scenario #3 - `std::move`

```c++
template <typename T>
Widget reduce_and_copy(T&& widget)
{
    widget.reduce();
    return std::move(widget); // Always move construtor called
}

int main()
{
	Widget w1("Widget 1");
	w1.get_name();
	Widget w2 = reduce_and_copy(w1); // lvalue passed 
	w2.get_name();
	w1.get_name(); // gives empty string. Ownership has been moved to w2.
	
	Widget w3 = reduce_and_copy(Widget{"Widget 3 temp"}); // rvalue passed
	w3.get_name();
}
```

#### Output

```sh
constructor called, Widget 1
m_name :: Widget 1
reduce()
move constructor called, Widget 1
m_name :: Widget 1
m_name :: 
constructor called, Widget 3 temp
reduce()
move constructor called, Widget 3 temp
destructor called, 
m_name :: Widget 3 temp
destructor called, Widget 3 temp
destructor called, Widget 1
destructor called, 
```

Here, always move constructor is called. 


### NRVO/RVO - Named Return Value Optimization/Return Value Optimization

Take a example API that creates a `Widget` object.

```c++
Widget makeWidget()
{
    Widget w;
    return w;
}
```

the compiler can perform NRVO (Named Return Value Optimization).

Instead of:

```txt
construct w 
copy/move w to return object 
destroy w
```

it does:

```txt
construct w directly in caller's storage
```
0 move and 0 copy is performed.


#### Issue with `std::move`

If we do 

```c++
Widget makeWidget()
{
    Widget w;
    return std::move(w);
}
```

We are no longer sending local object. We are sending rvalue reference `Widget&&`.
Here, no NRVO rule applies. And the compiler performs move construct return value from w. i.e., 1 move instead of 0 move and 0 copy.


In some cases NRVO is not possible, in those cases rvalue is returned.

#### Case #1

```c++
Widget makeWidget(bool flag)
{
    Widget a;
    Widget b;

    if (flag)
        return a;

    return b;
}
```

In this case, we may think that `std::move` might work. But C++ standard has already taken care of this.

If copy elision is not performed, the language treats the returned value as an rvalue.

The compiler prefers to move constructor (if available), else copy constructor, without losing NRVO opportunities.


#### Case #2

```c++
Widget makeWidget(Widget w)
{
    return w;
}
```

w is a function parameter, not a local object eligible for NRVO.

The standard says that returned-by-value parameters are also treated as rvalues. And move or copy constructor is called.


For RVO to occur, we need below conditions to be satisfied
1. The type of the local object is the same as that returned by the function
2. The local object is what's being returned


## Reference collapsing rules
|Arg|Converted to|
|----|----|
|T& &arg| &|
|T& &&arg| &|
|T&& &arg| &|
|T&& &&arg| &&|


Reference collapsing occurs in four contexts
1. Template initialization
2. `auto` type generation
3. Creation and use of `typedef's and alias declaration
4. `decltype`

Universal reference isn't a new kind of reference, it is an rvalue reference where two conditions are satisfied

1. Type deduction distinguishes lvalues from rvalues. Lvalues of type T are deduced to have type T&, while rvalues of type T yield T as their deduced type.
2. Reference collapsing occurs.

```c++
template<typename T>
void func(T&& param);

Widget widgetFactory();     // function returning rvalue

Widget w;                   // a variable (an lvalue)

func(w);                    // call func with lvalue; T deduced
                            // to be Widget&

func(widgetFactory());      // call func with rvalue; T deduced
			    // to be Widget
```


We can check the `auto` form of initialization.


```c++
auto&& w1 = w;
```

`w1` is initialized with an lvalue. thus deducing type becomes `Widget &` for auto.
Putting `Widget&` in place of `auto` yields this reference-to-reference code.

```c++
Widget& && w1 = w;
```

After reference collapsing, becomes

```c++
Widget& w1 = w;
```


On the other hand,

```c++
auto&& w2 = widgetFactory();
```

Here, `w2` is initialized with rvalue. Non-reference type is deduced for `auto`. Substituting `Widget` for `auto` gives below

```c++
Widget&& w2 = widgetFactory();
```

We don't have reference-to-reference code. `w2` will be an rvalue reference.

### auto&&

```c++
int x = 10;

auto&& r1 = x; // lvalue reference
auto&& r2 = 10; // rvalue reference
```

| Initializer | `auto` deduced as | Resulting type |
| ----------- | ----------------- | -------------- |
| lvalue      | `T&`              | `T&`           |
| rvalue      | `T`               | `T&&`          |

- `auto&&` adapts itself to the value category of initializer

### decltype

```c++
int x = 10;

decltype(x)&  r1 = x; // lvalue reference
decltype((x)) r2 = x; // lvalue reference
decltype((x))&& r3 = x; // lvalue reference
```

| Form  | What it is    | Result |
| ----- | ------------- | ------ |
| `x`   | variable name | `int`  |
| `(x)` | expression    | `int&` |
| `(x)&&` | expression    | `int&` |

- In the third case `(x)&&` becomes `int& &&`.
- Reference collapsing rules, make `T& &&` to `T&`.
- This rule exists so `decltype` can preserve value category.

