---
title: Pimpl Idiom
date: 19/09/2026
---

Pimpl Idiom (Pointer to implementaion) is a technique where we replace data members of a class with a pointer to an implementaion class (or struct).

### Pimpl using `std::unique_ptr`

```c++
// widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <memory>

struct Gadget{
    int id;
};

class Widget{
public:
    Widget();
    ~Widget();

    // Move Cons and Assignment
    Widget(Widget && rhs);
    Widget & operator=(Widget && rhs);

    // Copy cons and Assignment
    Widget(const Widget & rhs);
    Widget & operator=(const Widget & rhs);

private:
    // This is Pimpl Idiom
    struct Impl;
    std::unique_ptr<Impl> m_impl;    
};

#endif
```

```c++
// widget.cpp
#include <iostream>

#include <memory>
#include <vector>
#include <string>

#include "widget.h"

// Defination goes here
struct Widget::Impl
{
    Impl()
    {
        std::cout << "Impl()" << std::endl;
    }
    ~Impl()
    {
        std::cout << "~Impl()" << std::endl;
    }
    std::string m_name;
    std::vector<int> m_list;
    Gadget g1, g2, g3;
};

Widget::Widget() : m_impl(std::make_unique<Impl>())
{
    std::cout << "Widget()" << std::endl;
}

Widget::~Widget() = default;

// or
// Widget::~Widget(){}

// No need to add custom implementation.
// Default implementations perform the move on underlying std::unique_ptr
Widget::Widget(Widget && rhs) = default;
Widget& Widget::operator=(Widget && rhs) = default;

// Custom implementaion is needed because
// 1. Compilers won't generate copy operations for classes with move-only types like std::unique_ptr
// 2. Even if generated, they only copy std::unique_ptr (i.e., perform shallow copy)
// and we want to copy what the pointer points to (i.e., deep copy)
Widget::Widget(const Widget & rhs) 
    : m_impl(std::make_unique<Impl>(*rhs.m_impl)) // Here, we are deferencing the unique_ptr and creating a new unique_ptr
{
}

Widget & Widget::operator=(const Widget & rhs)
{
    // Here, object already exists, so no need o use make_unqiue
    *m_impl = *rhs.m_impl;
    return *this;
}
```

```c++
// main.cpp

#include "widget.h"

int main()
{
    Widget w1;

    // Move Cons
    Widget w2 (std::move(w1));

    // Move assignment
    w1 = std::move(w2);

    // Copy Cons
    Widget w3 = w1;

    Widget w4;
    // Copy assignment
    w4 = w3;
}

```

### Pimpl using `std::shared_ptr`

```c++
#ifndef WIDGET_H
#define WIDGET_H

#include <memory>

struct Gadget{
    int id;
};

class Widget{
public:
    Widget();

private:
    // This is Pimpl Idiom
    struct Impl;
    std::shared_ptr<Impl> m_impl;
};

#endif
```

```c++
// main.cpp

#include "widget.h"

int main()
{
    Widget w1;

    // Move Cons
    Widget w2 (std::move(w1));

    // Move assignment
    w1 = std::move(w2);

    // Copy Cons
    Widget w3 = w1;

    Widget w4;
    // Copy assignment
    w4 = w3;
}
```

Here, everything works fine with default implementation.

Because
    - copy operations increases reference count
    - move operations move the ownership and no reference count manipulation

### `std::unique_ptr` vs `std::shared_ptr`

The key difference comes from how these pointers support custom deleters.

For `std::unique_ptr`
    - The type of deleter is part of the type of the smart pointer
    - This makes compilers to generate smaller run time data structures and faster runtime code

For `std::make_shared`
    - The type of deleter is not part of the type of smart pointer
    - This makes complier to generate larger run time data structures and somewhat slower code

