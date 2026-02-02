---
title: Rules of 5,3,0 in C++
date: 28/01/2026
---

Rule of 0/3/5 defines the following
- If my class manages resources(File, Mutex, FD, Heap Memory, etc..) what are all the special functions I need to define

### Special member functions 
1. Destructor
2. Copy Contructor
3. Copy Assignment Operator
4. Move Constructor
5. Move Assignment Operator

### Rule of 0
If a class does not manage any resources directly, then no need to define any special member functions.
Let the standard library handle the special member functions.

### Rule of 3
If a class defines any one of the following, it should probably define the other two.
1. Destructor
2. Copy Constructor
3. Copy Assignment Operator

Because the class manages resources (File, Mutex, FD, Heap Memory, etc..)

#### Problem example

```c++
class Buffer {
    int* data;
public:
    Buffer(int size) {
        data = new int[size];
    }
    ~Buffer() {
        delete[] data;
    }
};

int main()
{
    Buffer b1(10);

    Buffer b2 = b1; // ERROR:: double delete is detected
}
```

```sh
free(): double free detected in tcache 2
```

The above error is seen because the default copy constructor performs `shallow copy`

#### Corrected version
```c++

#include <iostream>
#include <algorithm>

class Buffer {
    int* data;
    size_t size;
    
public:
    Buffer(int size) {
        this->size = size;
        data = new int[size];
    }
    ~Buffer() {
        std::cout << "Destructor called" << std::endl;
        delete[] data;
    }
    
    Buffer(const Buffer & other) : size(other.size)
    {
        std::cout << "Copy constructor called" << std::endl;
        data = new int[size];
        std::copy(other.data, other.data + size, data);
    }
    
    Buffer& operator=(const Buffer & other)
    {
        std::cout << "Copy Assignment operator called" << std::endl;
        if(this != &other)
        {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);            
        }
        
        return *this;
    }
    
};

int main()
{
    Buffer b1(10);
    Buffer b2 = b1; // Copy constructor
    Buffer b3(20);
    b3 = b2; // Copy Assignment operator
}
```
```sh
Copy constructor called
Copy Assignment operator called
Destructor called
Destructor called
Destructor called
```

### Rule of 5 (C++ 11 or later)
If a class defines any one of 
1. Destrcutor
2. Copy Constrcutor
3. Copy Assignement operator

then it should define *all five* including
- Move constructor
- Move assignment operator

In the Rule of 3, example. If we try to perform below operation

```c++
int main()
{
    Buffer b1(1000);
    Buffer b2 = std::move(b1); // STILL copy constructor is called
}
```

```sh
Copy constructor called
Destructor called
Destructor called
```

To fix the above issue
```c++

#include <iostream>
#include <algorithm>

class Buffer {
    int* data;
    size_t size;
    
public:
    Buffer(int size) {
        this->size = size;
        data = new int[size];
    }
    ~Buffer() {
        std::cout << "Destructor called" << std::endl;
        delete[] data;
    }
    
    Buffer(const Buffer & other) : size(other.size)
    {
        std::cout << "Copy constructor called" << std::endl;
        data = new int[size];
        std::copy(other.data, other.data + size, data);
    }
    
    Buffer& operator=(const Buffer & other)
    {
        std::cout << "Copy Assignment operator called" << std::endl;
        if(this != &other)
        {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);            
        }
        
        return *this;
    }
    
    Buffer(Buffer && other) noexcept
    {
        std::cout << "Move constructor called" << std::endl;
        size = other.size;
        data = other.data;
        
        other.size = 0;
        other.data = nullptr;
    }
    
    Buffer & operator=(Buffer && other) noexcept
    {
        std::cout << "Move Assignment operator called" << std::endl;
        if(this != &other)
        {
            delete[] data;
            
            data = other.data;
            size = other.size;
            
            data = nullptr;
            size = 0;
        }
        
        return *this;
    }
    
    void print()
    {
        std::cout << "this :: " << this << ", size :: " << size << std::endl;
    }
};

int main()
{
    Buffer b1(1000);
    
    b1.print();
    
    Buffer b2 = std::move(b1);
    
    b1.print();
    b2.print();
    
    Buffer b3(2000);
    b3.print();
    
    b3 = std::move(b2);
    b3.print();
    b2.print();
}
```

```sh
this :: 0x7ffff7a5d9e0, size :: 1000
Move constructor called
this :: 0x7ffff7a5d9e0, size :: 0
this :: 0x7ffff7a5d9d0, size :: 1000
this :: 0x7ffff7a5d9c0, size :: 2000
Move Assignment operator called
this :: 0x7ffff7a5d9c0, size :: 0
this :: 0x7ffff7a5d9d0, size :: 1000
Destructor called
Destructor called
Destructor called
```

#### Why `noexcept` is required

Standard containers use move operations only if they are `except`, otherwise they fall back to copying to preserve strong exception safety.

##### Real problem `noexcept` solves
When `std::vector` grows:
1. It allocates a new buffer
2. Moves (or copies) existing elements
3. Destroys old storage

If move throws an exception in the middle, the vector could be left half-moved, which breaks invariants.


### What is invariant?
An invariant is a condition that must be always true for an object or data structures whenever it is in valid state.

If an invariant is broken, the object is corrupted even if the program has not yet crashed.

For a class, invariant rules are like:
1. This pointer is either `nullptr` or points to a valid address.
2. size correctly matches the allocated buffer.

#### Example

```c++
class Buffer {
    int* data;
    size_t size;
};
```

Valid invariants are
1. `data == nullptr` or `data` points to a valid `int[size]`
2. size == 0 or data != nullptr
3. No two Buffer class objects own the same data

- If any of above is false, invariant is broken.

#### Why copy preserves invariant
Copying:
1. Does not modify the source
2. If copy fails, source remain intact

So vector can 
1. Discard new storage
2. Continue using old one
