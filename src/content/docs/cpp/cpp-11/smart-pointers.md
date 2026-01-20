---
title: Smart pointers in C++
date: 18/01/2026
---

Smart pointers in C++ are RAII-based objects that automatically manage the lifetime of dynamically allocated objects.

### Types of Smart pointers
1. unique_ptr
2. shared_ptr
3. weak_ptr

### unique_ptr
1. Stores only one pointer at a time.
2. Cannot be copied.
3. Ownership can be transferred using `std::move`
4. `unique_ptr` are always passeed as reference to functions. Because copy constructor is deleted in `unique_ptr`

#### Example

```c++

class cA
{
private:
    int m_i;

public:
    cA(int x = -1) : m_i(x)
    {
        cout << "cA::Cons\n";
    }
    ~cA()
    {
        cout << "~cA::Des\n";
    }
    void display() const
    {
        cout << "cA::display: this = " << this << ", m_i = " << m_i << "\n";
    }
};

int main()
{
    cA *ap = new cA();
    // Creating a unique ptr for raw ptr ap
    unique_ptr<cA> up1(ap);
    cout << "up1 = " << up1.get() << "\n";
    
    // Other way of creating unique_ptr
    unique_ptr<cA> up2(new cA());

    // Moving the ownership of the ap ptr
    unique_ptr<cA> up3(std::move(up1));
    cout << "up1 = " << up1.get() << "\n"; // will get nullptr
    cout << "up2 = " << up2.get() << "\n";
    cout << "up3 = " << up3.get() << "\n";

    //up1->display(); // ERROR: nullptr
    up2->display();
    up3->display();
}

```

```sh
cA::Cons
up1 = 0x5eb3789aa920
cA::Cons
up1 = 0 // nullptr, no resource
up2 = 0x5eb3789aad50
up3 = 0x5eb3789aa920 // Same address as up1, because of std::move
cA::display: this = 0x5eb3789aad50, m_i = -1
cA::display: this = 0x5eb3789aa920, m_i = -1
~cA::Des
~cA::Des
```

#### Example2 

```c++
int main()
{
    vector<unique_ptr<cA>> objs;
    objs.push_back(unique_ptr<cA>(new cA(1)));
    objs.push_back(unique_ptr<cA>(new cA()));
    objs.push_back(unique_ptr<cA>(new cA()));
    objs.push_back(unique_ptr<cA>(new cA()));

    // unique_ptr is passed by reference, if we pass by value instead, then compiler will throw error because unique_ptr copy constructor is deleted.
    for (const auto &obj : objs)
    {
        obj->display();
    }
}
```

### make_unique (c++ 14)
- It is used to create a `unique_ptr` object
- Object gets destoryed, when `unique_ptr` gets out of scope

#### Example
```c++
int main()
{
	std::unique_ptr<cA> up1 = std::make_unique<cA>(100);
	up1->display();
	
	{
	    std::unique_ptr<cA> up2 = std::make_unique<cA>(200);
	    up2->display();
	}
	
	std::unique_ptr<cA> up3 = std::move(up1);
	//up1->display(); // ERROR:: accessing nullptr
	up3->display();
	
}
```

```sh
cA::display: this = 0x5e4e2bc77920, m_i = 100
cA::display: this = 0x5e4e2bc77d50, m_i = 200
cA::display: this = 0x5e4e2bc77920, m_i = 100
```

### shared_ptr
- Allows multiple pointers to share the ownership of the same object.
- Reference counting is used to manage ownership
- `shared_ptr` expects objects/resources created in heap. It takes the ownership of the object.
- The object gets destroyed when reference count reaches `0`
- `make_shared` is used to create a `shared_ptr` for a specified type after creating it dynamically in heap memory

#### `shared_ptr` creates below things internally
Control block which consists of 
1. Reference count
2. Deleter

#### `make_shared` creates below things internally
- Single memory allocation for Object `T`
- Control block which consists of 
    1. Reference count
    2. Deleter



#### Example

```c++
int main()
{
	std::shared_ptr<cA> sp1 = std::make_shared<cA>(10);
	cout << "sp1 = " << sp1 << "\n";
	
	// Using new expression to create an object
	std::shared_ptr<cA> sp2(new cA(20));
    // The above line is legal, but bad. No exception safety
	cout << "sp2 = " << sp2 << "\n";
	
	// using make_shared
	std::shared_ptr<cA> sp3 = make_shared<cA>(30);
	cout << "sp3 = " << sp3 << "\n";
	
	// Using nullptr when initialization must be separate from declaration
	std::shared_ptr<cA> sp4(nullptr); // Equivalent to = std::shared_ptr<cA> sp4;
	
	sp4 = std::make_shared<cA>(40);
	cout << "sp4 = " << sp4 << "\n";
	
	sp1->display();
	cout << "sp1.use_count = " << sp1.use_count() << "\n";
	
	std::shared_ptr<cA> sp5 = sp1;
	cout << "sp1.use_count = " << sp1.use_count() << "\n";
	
}
```

```sh
sp1 = 0x572e01f7b920
sp2 = 0x572e01f7bd70
sp3 = 0x572e01f7bdc0
sp4 = 0x572e01f7bde0
cA::display: this = 0x572e01f7b920, m_i = 10
sp1.use_count = 1
sp1.use_count = 2 // Reference count increased
```

#### Custom shared_ptr

```c++
template <typename T>
class shared_ptr
{
    struct{
        T * m_p;
        unsigned int ref_count;
    }resource;
public:
    shared_ptr() : resource.m_p(nullptr), resource.ref_count(0){}
    shared_ptr(T * p) : resource.m_p(p), resource.ref_count(1){}
    ~shared_ptr()
    {
        if(resource.m_p)
        {
            resource.ref_count--;
            if(resource.ref_count <= 0)
            {
                delete resource.m_p;
            }
        }
    }
    unsigned int use_count() {return resource.ref_count;}
    shared_ptr(shared_ptr && rhs)
    {
        if(rhs.resource.m_p)
        {
            this->resource.m_p = rhs.resource.m_p;
            this->resource.ref_count = rhs.resource.ref_count;
        }
    }
};
```

### weak_ptr
- It is a non-owning smart pointer used only with `shared_ptr`
- It observes an object without extending the lifetime
- `weak_ptr` lets you refer to an object managed by `shared_ptr` without increasing the reference count
- `weak_ptr` should be used when access is needed, not ownership

#### Why use `weak_ptr`
`shared_ptr` alone can leak memory dur to cyclic ownership

```c++
#include <memory>
#include <iostream>

struct B;

struct A{
    A()
    {
        std::cout << "A() called" << std::endl;
    }
    ~A()
    {
        std::cout << "~A() called" << std::endl;
    }
    std::shared_ptr<B> b;
};

struct B{
    B()
    {
        std::cout << "B() called" << std::endl;
    }
    ~B()
    {
        std::cout << "~B() called" << std::endl;
    }
    std::shared_ptr<A> a;
};

int main()
{
    auto a = std::make_shared<A>();
    auto b = std::make_shared<B>();

    a->b = b;
    b->a = a;
}
```

```sh
A() called
B() called
```

#### What happened here
- `a` owns `b`
- `b` owns `a`
- Reference count never gets `0`
- Destructors never get called (memory leak)

```c++
//std::shared_ptr<A> a;
// Replace std::make_shared with this line
std::weak_ptr<A> a;
```

```sh
A() called
B() called
~A() called
~B() called
```

