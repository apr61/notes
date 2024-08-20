---
title: Polymorphism in C++
date: 20/8/2024
---


The word __polymorphism__ means having many forms. We can define polymorphism as the ability of a message to be displayed in more than one form.

## Types of Polymorphism
1. Compile Time Polymorphism
    1. Function Overloading
    2. Operator Overloading
2. Run Time Polymorphism / Late Binding / Dynamic Ploymorphism
    1. Function Overriding (Virtual Functions)

## Compile Time Polymorphism
This type of polymorphism is acheived by __Function Overloading__ or __Operator Overloading__.

## Function Overloading

When there are multiple functions with same name and different parameters, thoses functions are called overloadded funtions. __Function Overloading__ can be achieved by changing the __number of arguments__ or/and changing the __type of arguments__.

> __Note__: Just changing __return type__ and __order of parameters__  doesn't perform Function Overloading.

```c++

int add(int x, int  y){
    return x + y;
}

int add(int x, int  y, int z){
    return x + y + z;
}

double add(double x, double y){
    return x + y;
}

int add(double x, double y){
    return x + y;
}

int main()
{
    cout << "add(1, 3) = " << add(1,3) << endl;
    cout << "add(1, 3, 5) = " << add(1,3, 5) << endl;
    cout << "add(1.5, 3.5) = " << add(1.5,3.5) << endl;
}
```

#### Output
```sh
add(1, 3) = 4
add(1, 3, 5) = 9
add(1.5, 3.5) = 5
```

## Run Time Polymorphism

This type of polymorphism is achieved by __Function Overriding__. The function call is resolved at runtime in runtime polymorphism. 

## Function Overriding

Function overridding occurs when a derived class has a definition for one of the member functions of base class. The base class function gets __overridden__.

To perform Function overriding we can use `virtual function.`

## `virtual` functions

A __virtual function__ is a member function that is declared in the base class using the keyword virtual and is re-defined (Overridden) in the derived class. __Virtual Functions__ are called during Run-time.

### Virtual function rules
1. Virtual functions cannot be static.
2. A virtual function can be a friend function of another class.
3. Virtual functions should be accessed using a pointer or reference of base class type to achieve runtime polymorphism.
4. The prototype of virtual functions should be the same in the base as well as the derived class.
5. Virtual functions are always defined in the base class and overridden in a derived class. It is not mandatory for the derived class to override (or re-define the virtual function), in that case, the base class version of the function is used.
6. A class can have a __virtual destructor__ but cannot have virtual constructor.

#### Example 1

```c++
class base1
{
public:
    base1() { cout << "base1()\n"; }
    ~base1() { cout << "~base1()\n"; }
    virtual void m_fun()
    {
        cout << "base1 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base1 :: m_fun1() non virtual " << endl;
    }
};
class derived : public base1
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
    void m_fun()
    {
        cout << "derived :: m_fun() non virtual " << endl;
    }
    void m_fun1()
    {
        cout << "derived :: m_fun1() virtual " << endl;
    }
};
void main()
{
    base1 *bp = new derived();
    bp->m_fun();
    bp->m_fun1();
    delete bp;
}
```

#### Output

```sh
base1()
derived()
derived :: m_fun() non virtual
base1 :: m_fun1() non virtual
~base1()
```

#### Example 2

```c++
class base1
{
public:
    base1() { cout << "base1()\n"; }
    virtual ~base1() { cout << "~base1()\n"; }
    virtual void m_fun()
    {
        cout << "base1 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base1 :: m_fun1() non virtual " << endl;
    }
};
class derived : public base1
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
    void m_fun() // It becomes virtual because of parent class declaration 
    {
        cout << "derived :: m_fun() non virtual " << endl;
    }
    virtual void m_fun1()
    {
        cout << "derived :: m_fun1() virtual " << endl;
    }
};
class mostDerived : public derived
{
public:
    mostDerived() { cout << "mostDerived()\n"; }
    ~mostDerived() { cout << "~mostDerived()\n"; }
    void m_fun()
    {
        cout << "mostDerived :: m_fun() non virtual " << endl;
    }
    void m_fun1()
    {
        cout << "mostDerived :: m_fun1() non virtual " << endl;
    }
};
void main()
{
    base1 *bp = new mostDerived();
    derived *dp = new mostDerived();
    bp->m_fun();
    bp->m_fun1();
    dp->m_fun();
    dp->m_fun1();
    delete dp;
    delete bp;
}
```

#### Output

```sh
base1()
derived()
mostDerived()
base1()
derived()
mostDerived()
mostDerived :: m_fun() non virtual
base1 :: m_fun1() non virtual
mostDerived :: m_fun() non virtual
mostDerived :: m_fun1() non virtual
~derived()
~base1()
~base1()
```

## Pure Virtual functions

A Pure Virtual function is a virtual function which does not have any implementation in the __base class__. A pure virtual function is declared by assigning a `0` in the declaration. For a pure virtual function each and every derived classes must have there own definition(implementation).

#### Syntax

```c++
class Test{
    /* Other data members */
public:
    // Pure virtual function
    virtual void show() = 0;
    /* Other memebers */ 
}
```

## Abstract Class

Any class with atleast one __Pure Virtual Function__ is called a Abstract class.

__Note__:
1. For abstract class Object creatio or instantiation is not possible.
2. If a derived class doesn't overide base class Pure virtual function then the derived class also becomes a _Abstract class_.
3. We can create a pointer variable for abstract class which can refer to any of it's derived class.

#### Example 1
```c++
class Base// Abstract class
{ 
protected:
    int m_x;

public:
    virtual void show() = 0;
    void display(){
        cout << "base display() :: this = " << this << endl;
    }
};
class Derived : public Base
{
private:
    int m_y;

public:
    void show()
    {
        cout << "Derived show() this = " << this << " m_x = " << m_x << endl;
    }
};
void main()
{
    Base *p = new Derived();
    p->show();
    p->display();
}
```

#### Output
```sh
Derived show() this = 0x1f1760 m_x = 0
base display() :: this = 0x1f1760
```

#### Example 2
```c++
class Base
{ // Abstract class
protected:
    int m_x;

public:
    virtual void show() = 0;
    void display(){
        cout << "base display() :: this = " << this << endl;
    }
};
class Derived : public Base
{ // abstract class
private:
    int m_y;

public:
    virtual void show() = 0;
};
class MostDerived : public Derived
{
private:
    int m_z;

public:
    void show()
    {
        cout << "MostDerived show() this = " << this << ", m_x = " << m_x << endl;
    }
};
void main()
{
    // Base * p = new Derived(); // gives an error
    Base *bp = new MostDerived(); 
    bp->show();
    bp->display();
    Derived *dp = new MostDerived(); 
    dp->show();
    dp->display();
}
```

#### Output
```sh
MostDerived show() this = 0xfe1760, m_x = 0
base display() :: this = 0xfe1760
MostDerived show() this = 0xfe1780, m_x = 0
base display() :: this = 0xfe1780
```

## Interface Class

If all the functions of a base class are Pure Virtual Functions, then the base class becomes a Interface class. (Interface Class - Implements in class diagram)

> __Note__: The derived classes of a Interface class needs to define their own Pure virtual functions.

#### Example

```c++
class Base // Interface class
{
protected:
    int m_x;

public:
    virtual void show() = 0;
    virtual void display() = 0;
};
class Derived : public Base
{
private:
    int m_y;

public:
    void show()
    {
        cout << "Derived show() this = " << this << " m_x = " << m_x << endl;
    }
    void display()
    {
        cout << "Derived display() this = " << this << endl;
    }
};
void main()
{
    Base *p = new Derived();
    p->show();
    p->display();
}
```

#### Output
```sh
Derived show() this = 0xfc1760 m_x = 0
Derived display() this = 0xfc1760
```

## Virtual function mechanisms
### Virtual Table (VTABLE) and Virtual Pointer (VPTR)

__VTABLE__: A table of virtual function pointers, maintained per class. (`static` array of function pointers) 
__VPTR__: A pointer to vtable, maintained per object instance which points to the VTABLE. When a new object is created, a new VPTR is insterted as a data member of that class.

The `virtual` keyword tells the compiler not to perform early binding. Late binding is implemented by using the VTABLE. VTABLE is created for each class which has a virtual function.

## Virtual Destructor
Deleting a derived class object using a base class pointer that has a non-virtual destructor will result in undefined behaviour.

#### Example
Without virtual destructor.

```c++
class Base
{
public:
    Base()
    {
        cout << "Base()" << endl;
    }
    ~Base()
    {
        cout << "~Base()" << endl;
    }
};
class Derived : public Base
{
public:
    Derived()
    {
        cout << "Derived()" << endl;
    }
    ~Derived()
    {
        cout << "~Derived()" << endl;
    }
};

int main()
{
    Base *bp = new Derived();
    delete bp;
    return 0;
}
```

#### Output

```sh
Base()
Derived()
~Base()
```

#### Example
With virtual destructor

```c++
class Base
{
public:
    Base()
    {
        cout << "Base()" << endl;
    }
    virtual ~Base()
    {
        cout << "~Base()" << endl;
    }
};
class Derived : public Base
{
public:
    Derived()
    {
        cout << "Derived()" << endl;
    }
    ~Derived()
    {
        cout << "~Derived()" << endl;
    }
};

int main()
{
    Base *bp = new Derived();
    delete bp;
    return 0;
}
```

#### Output
```sh
Base()
Derived()
~Derived()
~Base()
```

> __Note__: If a destructor is virtual it will call the inherited class destructor as well, which properly disposes the class instances.

## `friend` functions and classes

A `friend` define functions and classes can access the `private` and `protected` members of any class.

### Friend Functions
- The keyword friend is placed only in the function declaration of the friend function and not in the function definition.
- A function can declared as friend in any number of classes.
- It possible to define the friend function a either `private` or `protected`.
- Friend function can be invoked without the use of an object.

> __Note__: Derived classes doesn't inherit friend funtions.

#### Example
```c++
class base1
{
    int m_i;

public:
    base1(int arg = -1) : m_i(arg) { cout << "base1()\n"; }
    virtual ~base1() { cout << "~base1()\n"; }
    virtual void m_fun()
    {
        cout << "base1 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base1 :: m_fun1() non virtual " << endl;
    }
    friend void myFndFun(base1 &); // Declaring a friend function
};
void myFndFun(base1 &ob)
{
    cout << "Friend function myFndFun() :: this :: " << &ob << ", m_i :: " << ob.m_i << endl;
}
int main()
{
    base1 obj;
    myFndFun(obj);
    return 0;
}
```

#### Output
```sh
base1()
this :: 0x61fdd0, m_i :: -1
~base1()
```

## Friend classes

- The friend class member functions has access to the private members defined within the class.
- When one class is a friend of another, it only has access to memebrs defined within class. It does not inherit the other class
- Friend class must be previously defined in an enclosing scope.

#### Example 1
```c++
class base2;
class base1
{
    int m_i;

public:
    base1(int arg = -1) : m_i(arg) { cout << "base1()\n"; }
    virtual ~base1() { cout << "~base1()\n"; }
    virtual void m_fun()
    {
        cout << "base1 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base1 :: m_fun1() non virtual " << endl;
    }
    friend void myFndFun(base1 &);
    friend class base2;
};
class base2
{
    int m_j;

public:
    base2(int arg = -1) : m_j(arg) { cout << "base2()\n"; }
    virtual ~base2() { cout << "~base2()\n"; }
    virtual void m_fun()
    {
        cout << "base2 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base2 :: m_fun1() non virtual " << endl;
    }
    void baseFrndFun(base1 &obj)
    {
        cout << "base1 this :: " << &obj << ", m_i = " << obj.m_i << endl;
        cout << "this :: " << this << ", m_j = " << this->m_j << endl;
    }
};
void myFndFun(base1 &ob)
{
    cout << "Friend function myFndFun() :: this :: " << &ob << ", m_i :: " << ob.m_i << endl;
}
void main()
{
    base1 obj;
    base2 obj2;
    obj2.baseFrndFun(obj);
}
```

#### Output
```sh
base1()
base2()
base1 this :: 0x61fdd0, m_i = -1
this :: 0x61fdc0, m_j = -1
~base2()
~base1()
```

#### Example 2
```c++
class base2;
class base1
{
    int m_i;

public:
    base1(int arg = -1) : m_i(arg) { cout << "base1()\n"; }
    virtual ~base1() { cout << "~base1()\n"; }
    virtual void m_fun()
    {
        cout << "base1 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base1 :: m_fun1() non virtual " << endl;
    }
    friend void myFndFun(base1 &);
};
class derived : public base1
{
    int m_derived;

public:
    derived(int arg = -1) : m_derived(arg) { cout << "derived()\n"; }
    virtual ~derived() { cout << "~derived()\n"; }
    virtual void m_fun()
    {
        cout << "derived :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "derived :: m_fun1() non virtual " << endl;
    }
    friend class base2;
};
class base2
{
    int m_j;

public:
    base2(int arg = -1) : m_j(arg) { cout << "base2()\n"; }
    virtual ~base2() { cout << "~base2()\n"; }
    virtual void m_fun()
    {
        cout << "base2 :: m_fun() :: virtual " << endl;
    }
    void m_fun1()
    {
        cout << "base2 :: m_fun1() non virtual " << endl;
    }
    void baseFrndFun(derived &obj)
    {
        cout << "derived this :: " << &obj << ", m_derived = " << obj.m_derived << endl;
        // cout << "base 1 this :: " << this << ", base1 m_i = " << obj.m_i << endl; // Inaccessable
        cout << "this :: " << this << ", m_j = " << this->m_j << endl;
    }
};
void myFndFun(base1 &ob)
{
    cout << "this :: " << &ob << ", m_i :: " << ob.m_i << endl;
}
void main()
{
    derived obj(100);
    base2 obj2;
    obj2.baseFrndFun(obj);
}
```
#### Output
```sh
base1()
derived()
base2()
derived this :: 0x61fdd0, m_derived = 100
this :: 0x61fdc0, m_j = -1
~base2()
~derived()
~base1()
```

