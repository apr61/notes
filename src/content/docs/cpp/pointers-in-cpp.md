---
title: Pointers in C++
date: 20/8/2024
---


A pointer is a variable that is used to store the address of a variable or an object. Three main purposes.
1.	To allocate new objects in heap memory
2.	To pass functions to other functions
3.	To iterate over elements of arrays or other data structures

## Const pointers
Two types of const pointer
1. Pointer Constant
2. Constant Pointer

### Pointer Constant
__Value constant__ and __address changes__.

#### Syntax

```c++
const int * ptr_name;
// Or
int const * ptr_name;
```

### Constant Pointer
__Address constant__ and __value changes__.

#### Syntax
```c++
int * const ptr_name;
```

## new - delete operators
Dynamic memory allocation and deallocation of objects is done by using the new and delete operators. 

The `new operator calls` special function `operator new` and `delete operator calls` special function `operator delete`.

### new operator

The new operator allocates memory for objects of built-in types, objects of class type that __doesn’t contain user-defined operator new__ functions, and arrays of any type. The __return type__ of new operator is always `void*(void pointer)`. It also constructs the object in the allocated memory.

### delete operator

Memory that is __dynamically allocated__ using __new operator__ can be freed using __delete operator__. Using delete operator also causes the __class destructor (if exists) to be called__.

```c++ 
class cA
{
private:
    int m_i;

public:
    cA(int arg) : m_i(arg)
    {
        cout << "cA::cA: this = " << this << "\n";
    }
    ~cA()
    {
        cout << "cA::~cA: this = " << this << "\n";
    }
    void display() const
    {
        cout << "cA::display: this = " << this << " : m_i = " << m_i << "\n";
    }
};

void main()
{
    cA *ptr = nullptr;
    // Allocating memory using new operator
    ptr = new cA(); // Constructor gets called
    // Calling cA member display()
    ptr->display();
    // Deallocating memeory using delete operator
    delete ptr; // Destructor gets called
    cout << "ptr = " << ptr << endl;
    ptr = nullptr; // Pointing to null
    cout << "ptr = " << ptr << endl;
}
```

## new - delete operator subscript []
This type of new – delete is used for __allocating__ and __deallocating memory__ for __continuous allocation__(Array).

```c++
class cA
{
private:
    int m_i;

public:
    cA(int arg = -1) : m_i(arg)
    {
        cout << "cA::cA: this = " << this << "\n";
    }
    ~cA()
    {
        cout << "cA::~cA: this = " << this << "\n";
    }
    void display() const
    {
        cout << "cA::display: this = " << this << " : m_i = " << m_i << "\n";
    }
};
void main()
{
    cA *ptr = nullptr;
    // Allocating memory using new subscript
    ptr = new cA[4];
    cout << "ptr = " << ptr << "\n";
    ptr->display();

    // Deallocating memory using delete subscript
    delete[] ptr;
    /*
        ptr[3]->~cA();
        ptr[2]->~cA();
        ptr[1]->~cA();
        ptr[0]->~cA();
        call std::operator delete[](ptr) => free(ptr)
    */
    cout << "ptr = " << ptr << "\n";
    ptr = nullptr;
    cout << "ptr = " << ptr << "\n";
}
```

## Handling insufficient memory
The new operator throws an exception when there is insufficient memory. new throws a `std::bad_alloc` exception. We can use `std::bad_alloc exception class` or a `derived class of std::bad_alloc`.

```c++
#define BIG_NUMBER 10000000000LL
int main()
{
    try
    {
        int *pI = new int[BIG_NUMBER];
    }
    catch (bad_alloc &ex)
    {
        cout << "Caught bad_alloc: " << ex.what() << endl;
    }
    return 0;
}
```

### `nothrow` form of `new`

We can use the nothrow form of new where __exception is not raised__. In case of insufficient memory `nothrow new` returns a `nullptr`.

```c++
#define BIG_NUMBER 10000000000LL
int main()
{
    int *pI = new (nothrow) int[BIG_NUMBER];
    if (pI == nullptr)
    {
        cout << "Insufficient memory" << endl;
    }
    return 0;
}
```

## Placement `new`

Normal `new` allocates memory for object in __heap__ and constructs the object in the allocated memory. __Placement new__ takes a pre-allocated memory and object construction is done in the __pre-allocated memory__.

```c++
class cA
{
private:
    int m_i;

public:
    cA(int arg = -1) : m_i(arg)
    {
        cout << "cA::cA: this = " << this << "\n";
    }
    ~cA()
    {
        cout << "cA::~cA: this = " << this << "\n";
    }
    void display() const
    {
        cout << "cA::display: this = " << this << " : m_i = " << m_i << "\n";
    }
};

void main()
{
    char buffer[1024];
    cA *ptr = nullptr;
    cA *ptr1 = nullptr;
    cA *ptr2 = nullptr;
    cout << "ptr = " << ptr << "\n";
    cout << "&buffer = " << (void *)&buffer[0] << "\n";
    // allocating memory
    ptr = new (buffer) cA();
    ptr1 = new (buffer + sizeof(cA)) cA();
    ptr2 = new (buffer + 2 * sizeof(cA)) cA();
    cout << "ptr = " << ptr << "\n";
    ptr->display();
    // delete ptr; // Never use delete for placement new
    // Instead call destructor
    ptr2->~cA();
    ptr1->~cA();
    ptr->~cA();
    ptr = nullptr;
    ptr1 = nullptr;
    ptr2 = nullptr;
}

```

> __Note__: Never use `delete` for deallocating memory for __placement new__. Call the __destructor__ instead. 

## Difference between `new` and `placement new`

|new|placement new|
|---|-------------|
|Address or memory location is unknown|Address or memory location is known|
|Object construction is done in heap memory| Object construction is done at known address|
|Deallocation is done using __delete__ operator|Deallocation is done by calling __destructor__|
