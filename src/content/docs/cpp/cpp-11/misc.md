---
title: C++ 11 features
date: 20/09/2026
---

## `nullptr` over `0` and `NULL`

Always prefer `nullptr` over `0` and `NULL`.

`nullptr` doesnot have an integral type.  And it doesn't even have a pointer type. It can be considered as pointer of all types.

`nullptr` actual type is `std::nullptr_t`. The type `std::nullptr_t` implicitly converts to all raw pointer types.

```c++
void f(int);
void f(bool);
void f(void *);

f(10); // Calls f(int), not f(void*)

f(NULL); // Might not compile, but typically calls f(int)
```

### Example using templates

```c++
#include <iostream>
#include <mutex>
#include <memory>

std::mutex f1m, f2m, f3m;

using MuxGuard = std::lock_guard<std::mutex>;

int f1(std::shared_ptr<Widget> spw)
{
    std::cout << "int f1(std::shared_ptr<Widget> spw)" << std::endl;
    // some logic
    return 1;
}

double f2(std::unique_ptr<Widget> upw)
{
    std::cout << "int f2(std::unique_ptr<Widget> upw)" << std::endl;
    // some logic
    return 1.1;
}

bool f3(Widget * pw)
{
    std::cout << "bool f3(Widget * pw)" << std::endl;
    // some logic
    return true;
}



int main()
{
    {
        MuxGuard g(f1m);
        auto result = f1(0); // Pass 0 as null to f1
    }

    {
        MuxGuard g(f2m);
        auto result = f2(NULL); // Pass NULL as null to f2
    }

    {
        MuxGuard g(f3m);
        auto result = f3(nullptr); // Pass nullptr as null to f1
    }
}
```

In above case the code compiles and calls the respective API.
But there is a repetaive task of locking the mutex, calling the function and releasing the mutex.
We can templatize this.

```c++
// same code as above
// change main and template function

template <typename FuncType, typename MuxType, typename PtrType>
auto lockAndCall(FuncType func, MuxType & mutex, PtrType ptr) -> decltype(func(ptr))
{
    MuxGuard g(mutex);
    return func(ptr);
}

int main()
{
    auto res1 = lockAndCall(f1, f1m, 0); // ERROR!!!
    auto res1 = lockAndCall(f2, f2m, NULL); // ERROR!!!
    auto res1 = lockAndCall(f3, f3m, nullptr); // OK
}
```

In the usecase of templates, the actual use of `nullptr` shines.

## alias declarations to typedef

```c++

// Repeated writing some like this is very difficult

std::unique_ptr<std::unordered_map<std::string, std::string>> umap;
```

This can be resolved by using typedef

```c++
typedef std::unique_ptr<std::unordered_map<std::string, std::string>> UPtrMapSS;
```

or using ___alias declaration___

```c++
using UPtrMapSS = std::unique_ptr<std::unordered_map<std::string, std::string>>;
```

```c++

// FP is a synonym for a pointer to a function taking an int and
// ocnst std::string & and returning nothing
typedef void (*FP)(int, const std::string&);

using FP = void (*)(int, const std::string&);
```

### alias templates

Let's define a synonym for a linked list what uses a custom allocator MyAlloc.

```c++
template<typename T>
using MyAllocList = std::list<T, MyAlloc<T>>;

// Client uses
MyAllocList<Widget> lw;
```

With typedef declaration

```c++
template<typename T>
struct MyAllocList{
    typedef std::list<T, MyAlloc<T>> type;
};

// Client uses
MyAllocList<Widget>::type lw;
```

It gets even worse, if we try to use typedef in a template

```c++
template<typename T>
struct MyAllocList{
    typedef std::list<T, MyAlloc<T>> type;
};

template <typename T>
class Widget{
private:
    typename MyAllocList<T>::type list;
};
```

Here, MyAllocList<T>::type refers to a type that's dependent on a template type parameter (T).
MyAllocList<T>::type is thus a dependent type.
And C++ has a rule that "Dependent types must be preceded by `typename`"

If we were to use alias templates

```c++
template<typename T>
using MyAllocList = std::list<T, MyAlloc<T>>;

template <typename T>
class Widget{
private:
    MyAllocList<T> list;
};
```

## scoped enums

- C++ 98 enums are known as scoped enums.

Scoped enums can be declared as below

```c++
enum Color {white, red, black}; // Unscoped enum

enum class Fruit {apple, mango, banana}; // scopped enum
```

- Enumarations for scoped enums are visible only within the enum. 
- Scoped enums can be converted to other types using cast.

```c++
enum class Fruit {apple, mango, banana};

auto f = Friut::apple;

if(statci_cast<size_t>(f) == 1)
{
    std::cout << "Fruit is apple" << std::endl;
}
```

- The default type of scoped enum is `int`.
- Unscoped enums doesnot have a underlying type.

```c++
enum class Status; // underlying type is int

// We can change the underlying type.
enum class Status : std::uint32_t;

// Changing type for unscoped enum
enum Color : std::uint8_t; // Here the unscoped enum is forward declared.
```

- Scoped enums can be forward declared.
- Unscoped enums can also be forward declared only if their declaration specifies an underlying type.

## deleted functions

- Prefer deleted functions to private undefined ones.
- Any function may be deleted, including non-member function and template instantiation.
- deleted functions doesn't depend on access specifier.

```c++
class Widget{
public:
    Widget();
    Widget(const Widget & rhs) = delete;

    template<typename T>
    void processPointer(T * ptr){}
};

// Templates must be written in namespace scope,
// not at class scope
template<>
void Widget::processPointer<void>(void*) = delete;
```

#### Deleting non-member functions

```c++
int add(int a, int b)
{
    return a + b;
}

int add(int a, bool b) = delete;
int add(bool a, bool b) = delete;
int add(char a, char b) = delete;
```

#### declaring templates as deleted 

```c++
// Declaring templates as delete
template<typename T>
void processRequest(T * ptr);

// If we want processRequest should accept void * and char * as arguments
// those can be deleted
template<>
void processRequest<void>(void*) = delete;

template<>
void processRequest<char>(char *) = delete;

template<>
void processRequest<const void>(const void*) = delete;

template<>
void processRequest<const char>(const char *) = delete;
```