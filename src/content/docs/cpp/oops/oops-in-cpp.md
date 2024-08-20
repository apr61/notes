---
title: Oops
date: 18/8/2024
---

## Class
Class is a blueprint for creating objects. It is a user defined datatype that holds it's own data members and member functions. 

## Object
Object is an instance of class. When a class is defined, no memory is allocated but when it is instantiated (i.e. an object is created) memory is allocated.

## Pillars of OOPS
1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

## Access Specifiers
Assigns accessibility to the class members.

Three types of access specifiers
1. public
2. private
3. protected

### `public`
`public` data memebers can be accessed by anyone and from anywhere int the program using direct member access operator(.)

### `private`
`private` gives access to only member functions. Cannot be accessed outside class.

__friend functions__ are allowed to access `private` data members.

### `protected`
Can be accessed only by sub classes(derived classes) of that class. __friend classes__ can also access.

## Constructor
A special function that gets invoked automatically at the time of object creation. It has the same name as of the class. __Contructors__ doesnot return any value.

```c++
<className>()
{
    // Some Instructions
}

// Define constructor outside of class
<className>::<className>()
{
    // Some Instructions
}
```

## Types of Constructors
1. Default Constructor
2. Parameterized Constructor
3. Copy Constructor
4. Move Constructor

## Default Constructor
A default constructor is a constructor that doesn’t take any argument. It has no parameters. It is also called a __zero-argument constructor__.

```c++
class cA{
    int m_i;
    int m_j;
    public:
        // Default constructor
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        void display()
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        // cA * const __thiscall ~cA(cA * const this)
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
};

int main()
{
    cA obj1;
    obj1.display();
}
```

## Parameterized Constructor
Passing of parameters to constructor. It is used to overload constructors. 

> __Note__: When Parameterized constructor is created and no default constructor is defined explicitly, the compiler will not implicitly call the default constructor.

```c++
class cA{
    int m_i;
    int m_j;
    public:
        // Default constructor
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        // Parameterized constructor with default value
        cA(int m_i_value, int m_j_value = -1)
        {
            cout<<"cA:: Parameter constructor - this = "<<this<<"\n";
            this->m_i = m_i_value;
            this->m_j = m_j_value;
        }
        void display()
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        // cA * const __thiscall ~cA(cA * const this)
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
};

int main()
{
    cA obj1(10);
    cA obj2(100, 200);
    obj1.display();
    obj2.display();
}
```

## Copy Constructor
A special member function that initiates an object using another object of the same class. A copy constructor takes reference to an object of same class as an arg.

```c++
class cA{
    int m_i;
    int m_j;
    public:
        // Default constructor
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        // Parameterized constructor
        cA(int m_i_value, int m_j_value)
        {
            cout<<"cA:: Parameter constructor - this = "<<this<<"\n";
            this->m_i = m_i_value;
            this->m_j = m_j_value;
        }
        // Copy Constructor
        cA(cA & rhs)
        {
            cout<<"cA:: Copy constructor - this = "<<this<<"\n";
            this->m_i = rhs.m_i;
            this->m_j = rhs.m_j;
        }
        void display()
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
};

int main()
{
    cA obj1(10, 100);
    cA cloneObj(obj1);
    cloneObj.display();
    obj1.display();
}
```

## Move Constructor
A special member function that is used to transfer data from one object(source) 
to another object (destination) efficiently. It is used to transfer dynamically allocated
resources such as heap-allocated memory or file handles.

The move constructor is invoked in several situations, such as when initializing a new object
with an existing object, passing an object by value to a function, or returning an object 
from a function.

```c++
#define MAX 100
class cA
{
private:
    int *m_arr;
public:
    cA()
    {
        cout << "cA : Default/Single cons: this = " << this << "\n";
        try
        {
            m_arr = new int[MAX];
        }
        catch (...)
        {
            cout << "Low memeory...\n";
        }

        for (int i = 0; i < MAX; i++)
        {
            m_arr[i] = 1000 + i;
        }
    }
    ~cA()
    {
        cout << "~cA : Des : this = " << this << "\n";
        if (m_arr != nullptr)
        {
            cout << "Deleting resources..."<<endl;
            delete[] m_arr;
        }
        else
        {
            cout<<"Object without resource\n";
        }
    }
    cA(cA && rhs) // Move constrcutor
    {
        cout << "cA : Mov cons : this = " << this << "\n";
        this->m_arr = rhs.m_arr;
        rhs.m_arr = nullptr; // Moving-ownership
    }
};
void main()
{
    // Using move semantics
    cA cloneObj(std::move(cA())); // Created and handover resource and get deleted
    // cA obj1;
    // cA cloneObj(std::move(obj1)); // using move schemantics
    cout<<"&cloneObj = "<< &cloneObj << "\n";
}
```

## Destructor
A special function that gets invoked automatically when a object is going to be destroyed. A __destructor__ is the last function that gets called before an object is destroyed.

- Destructor also has the same name that of Class. Except a tilde(~) symbol infront of it.
- Destructor releases the memory that is occupied by object that is created by constructor.
- In destructor, Objects are destroyed in the reverse of an object creation.
- Not possible to define more than one destructor.

```c++
~<className>()
{
    // Some Instructions
}

// Define constructor outside of class
<className>::~<className>()
{
    // Some Instructions
}
```

## this

The this pointer is a pointer accessible only within the nonstatic member functions of a `class`, `struct`, or `union` type. It points to the object for which the member function is called. __Static member functions__ don't have a this pointer.

```c++
class cA{
    public:
        int m_i; // Offset => 0
        int m_j; // Offset => 4
        int m_k; // Offset => 8

        void m_fun1(){}
        // g++ : void __attribute__(thiscall) m_fun1(cA * const this)
        void m_fun2(){}
        void m_fun3(){}
};

int main()
{
    cout<<"sizeof(cA) = "<< sizeof(cA) << "\n";

    cA obj1, obj2;
    cA * Aptr = nullptr;

    obj1.m_i = 10; // &obj1 + offset (cA:m_i)

    Aptr = &obj1;
    cout<<"Aptr = "<<Aptr->m_i<<"\n";
    obj1.m_fun1();
    /*
        push &obj1 -> this arg value
        call cA::m_fun1(cA * const this)
    */
}
```

### Example for Construtor, Destructor and this
```c++
class cA{
    int m_i;
    int m_j;
    public:
        // Default constructor
        // cA * const __thiscall cA(cA * const this)
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        void display()
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        // cA * const __thiscall ~cA(cA * const this)
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
};

int main()
{
    cA obj1;
    obj1.display();
}
```

## `const` member functions

Declaring a member function with the const keyword specifies that the function is a "__read-only__" function that doesn't modify the object for which it's called. 

A `const` member function can't __modify any non-static data members__ or __call any non-constant member functions__.

> __Note__: Static data members can be modified in `const` member functions.

```c++
class cA{
    int m_i;
    int m_j;
    public:
        // Default constructor
        // cA * const __thiscall cA(cA * const this)
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        
        // void __thiscall display(const cA *const this)
        void display() const
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
            // m_i = 500; // Gives error
            // m_j = 1000; // Gives error
            myfun();
            // myfun1(); // Calling of non const memebers is not possible
        }
        // cA * const __thiscall ~cA(cA * const this)
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
        void myfun() const
        {
            cout<<"myfun()\n";
        }
        void myfun1()
        {
            cout<<"myfun1()\n";
        }
};

int main()
{
    cA obj1;
    obj1.display();
}
```

## `mutable`

`mutable` keyword can only be applied to __non-static, non-const, and non-reference__ data members of a class. 

If a data member is declared mutable, then it is legal to assign a value to this data member from a const member function.

```c++
class cA{
    int m_i;
    mutable int m_j;
    public:
        // Default constructor
        // cA * const __thiscall cA(cA * const this)
        cA()
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
            this->m_i = 0;
            this->m_j = 0;
        }
        // void __thiscall display(const cA *const this)
        void display() const
        {
            cout<<"cA::display - this = "<< this << "\n";
            m_j = 1000; // Can change even when member is const
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        // cA * const __thiscall ~cA(cA * const this)
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
};

int main()
{
    cA obj1;
    obj1.display();
}
```

## `static` members

Classes can contain `static` member data and member functions. When a data member is declared as `static`, only one copy of the data is maintained for all objects of the class.

```c++ 
class cA
{
private:
    static int gCount; // Declaration only - private to not give access to other functions
public:
    cA()
    {
        ++gCount;
    }
    ~cA()
    {
        --gCount;
    }
    static int getGcount(void) // Not to go with this, instead go with standard function
    {
        return gCount;
    }
};

// Intitalizing static data member
int cA::gCount = 0;

int main()
{
    cout << " Total objects of cA: " << cA::getGcount() << "\n";
    cA obj1;
    cout << " Total objects of cA: " << obj1.getGcount() << "\n";
    {
        cA obj2;
        cout << " Total objects of cA: " << obj1.getGcount() << "\n";
        cout << " Total objects of cA: " << obj2.getGcount() << "\n";
    } // obj2.~cA()
    cout << " Total objects of cA: " << obj1.getGcount() << "\n";
}
```

## `explicit`

The `explicit` keyword is used with a constructor to prevent it from performing implicit conversions. A `explicit` constructor is marked to not convert types implicitly.

### Without `explicit` keyword
```c++
#include <iostream>
using namespace std;
 
class Demo{
    public:
        Demo(int n){
            demo1 = n;
        }
        int getDemo(){
            return demo1;
        }
    private:
        int demo1;
};
 
void getDemoExternally(Demo demo){
    cout << demo.getDemo();
}
// Driver Code
int main()
{
    getDemoExternally(10); // Object is created
    return 0;
}
```

### With `explicit` keyword
```c++
class Demo{
    public:
        explicit Demo(int n){
            demo1 = n;
            cout<<"Demo() - this = "<<this << endl;
        }
        int getDemo(){
            return demo1;
        }
        ~Demo(){
            cout<<"~Demo() - this = "<<this << endl;
        }
    private
        int demo1;
};
 
void getDemoExternally(Demo demo){
    cout << demo.getDemo()<<endl;
}
// Driver Code
int main()
{
    // getDemoExternally(10); // Gives error - no suitable constructor exists to convert from "int" to "Demo"
    getDemoExternally(Demo (10));
    return 0;
}
```

## Initializer-list
The initializer list is used to directly initialize data members of a class.

```c++
class cA{
    const int m_i;
    int m_j;
    public:
        cA() : m_i(0), m_j(0)
        {
            cout<<"cA:: Default constructor - this = "<<this<<"\n";
        }
        explicit cA(int m_i_value, int m_j_value) : m_i(m_i_value), m_j(m_j_value)
        {
            cout<<"cA:: Parameter constructor - this = "<<this<<"\n";
        }
        void display() const
        {
            cout<<"cA::display - this = "<< this << "\n";
            cout<<"this->m_i = "<< this->m_i << "\n";
            cout<<"this->m_j = "<< this->m_j << "\n";
        }
        ~cA()
        {
            cout<<"cA::~cA (desrtuctor): this = " << this <<"\n";
        }
        
};

int main()
{
    cA obj1(10, 20);
    obj1.display();
}
```

***