---
title: Uniform Initialization
date: 20/09/2026
---

There are three ways of initializing variables
1. Using parentheses ()
2. Using =
3. Using braces {}

```c++
int x(10); // Initializer in parentheses
int y = 0; // Initializer follows =
int z{0}; // Initializer is in braces

int w = {100}; // equal + braces
// same as above
```

## Uniform Initialization

To address multiple initialization syntaxes C++ 11 introduced Uniform Initialization.

- It is a single initialization syntax that can, atleast in concept, be used anywhere and express everything.
- It is based on braces.
- Braces can also be used to specify default initialization values for non-static data members.

```c++
std::vector<int> v {1, 2, 3}; // v's intial content is 1, 2, 3
```

### Why use Uniform Initialization

#### Reason #1 - Initialization of variables

```c++
class Widget
{
private:
    int x {10}; // OK
    int y = 0; // OK
    int z(20); // ERROR, inside a class it will be parsed as a function declaration.
};


// Non-copyable objects may in initialized using braces, parentheses but not by "="

std::atomic<int> ai1{10}; // OK
std::atomic<int> ai1(10); // OK
std::atomic<int> ai1 = 10; // ERROR
```

#### Reason #2 - Implicit narrowing conversions

For in built types parentheses and "=" perform implicit type conversions.
But braces doesn't allow it.

```c++
double x = 10.0, y = 3.5, z = 45.5;

int sum2(x + y + z); // OK, implicit conversion

int sum3 = x + y + z; // OK, implicit conversion

int sum{x + y + z}; // ERROR, Sum of doubles cannot expressed as int.
```


#### Reason #3 - Most vexing parse

A side effect of c++'s rule that anything can be parsed as a declaration must be interpreted as one, the most vexing parse frequently afflicts when want to declare-construct an object.

```c++
Widget w1(10); // Call Widget ctor with argument 10

Widget w2(); // ERROR!!! - Most Vexing Parse. Declares a function name w2 which returns a Widget

Widget w3{}; // Calls Widget ctor with no args
```

### Drawbacks of Uniform Initialization

#### Drawback #1 - `std::initializer_list` overloaded constructors

In constructor calls, parentheses and braces have same meaning until `std::initializer_list` are not involved.

```c++
class Widget{
public:
    Widget(int x, bool b);
    Widget(int y, double d);
};

Widget w1(10, true); // Calls first ctor
Widget w2{10, true}; // Calls first ctor

Widget w3(10, 2.5); // Calls second ctor
Widget w4{10, 2.5}; // Calls second ctor
```

If we introduce `std::initializer_list`


```c++
class Widget{
public:
    Widget(int x, bool b);
    Widget(int y, double d);

    Widget(std::initializer_list<long double> il);
};

Widget w1(10, true); // Calls first ctor
Widget w2{10, true}; // Calls std::initializer_list ctor, (10, true) are converted to long double

Widget w3(10, 2.5); // Calls second ctor
Widget w4{10, 2.5}; // Calls std::initializer_list ctor, (10, 2.5) are converted to long double
```

Even though second ctor is a perfect match for objects (w2, w4), `std::initializer_list` ctor is called.

`std::initializer_list` even hijack the working of copy and move ctors.

```c++
class Widget{
public:
    Widget(int x, bool b);
    Widget(int y, double d);

    Widget(std::initializer_list<long double> il);

    operator float() const; // Convert to float
};

Widget w1(10, true); // Calls first ctor

Widget w2(w1); // calls copy ctor

Widget w3{w1}; // uses braces, calls std::initializer_list ctor 
               // w1 is converted to float and floats convert to long double

Widget w2(std::move(w1)); // calls move ctor

Widget w3{std::move(w1)}; // uses braces, calls std::initializer_list ctor 
               // w1 is converted to float and floats convert to long double

```

- Compilers will always try to match braced initializers with constructors taking `std::initializer_list`
- Compiler wil also try if `std::initializer_list` is not the best match.


```c++
class Widget{
public:
    Widget(int x, bool b);
    Widget(int y, double d);

    Widget(std::initializer_list<bool> il);
};

Widget w1{10, 3.5}; // ERROR! Requires narrow conversion 
```

The compiler will try to convert 10, 3.5 to bool. Because of `std::initializer_list`
And narrow conversion is not valid in braced initializers. So, call is invalid and code is rejected.


Let's see one last scenario of `std::initializer_list`

In the below code we have a Widget ctor with `std::initializer_list` and we want to create object with empty initializer_list.

```c++
class Widget{
public:
    Widget();

    Widget(std::initializer_list<int> il);
};

Widget w1; // Default ctor

Widget w2{}; // Still default ctor

Widget w3(); // ERROR!! most vexing parse, decalres a function
```

To solve this

```c++
Widget w2{{}}; // Calls std::initializer_list ctor with empty list

Widget w3({}); // ditto
```

#### `std::vector` use case of `std::initializer_list`

```c++
std::vector<int> v1(10, 20);
```

- Uses parentheses. non-std:initializer_list ctor is called.
- Creates 10-element std::vector, all elements have value 20



```c++
std::vector<int> v1{10, 20};
```

- Uses braces. std:initializer_list ctor is called.
- Creates 2-element std::vector, element values are 10, 20


