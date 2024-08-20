---
title: Inheritance in C++
date: 20/8/2024
---


The capability of a class to derive properties and characteristics from another class is called Inheritance.
Inheritance is a (is-a) relationship.

```c++
class cA{
protected:
    int m_x;
public:
    cA(int x = 10) : m_x(x)
    {

    }
    ~cA()
    {

    }
};

class cB : cA{
    int m_y;
public:
    cB(int a = 20, int b = 10)
    {
        this->m_x = a;
        this->m_y = b;
    }
    ~cB()
    {
    }
    void display() const
    {
        cout << "this = " << this << ", m_x = " << m_x << ", m_y = " << m_y << endl;
    }
};

int main()
{
    cB obj(10, 20);
    obj.display();
}
```

## Difference between `private`, `public` and `protected`

### `private`

|Base Class|Derived Class|
|----------|-------------|
|public|private|
|protected|private|
|private|private|

### `protected`

|Base Class|Derived Class|
|----------|-------------|
|public|protected|
|protected|protected|
|private|private|

### `public`

|Base Class|Derived Class|
|----------|-------------|
|public|public|
|protected|protected|
|private|private|

## Types of Inheritance
1. Basic Inheritance
2. Hierarchical Inheritance
3. Multiple Inheritance
4. Multi-level Inheritance
5. Hybird/ Diamond Inheritance

## Single Inheritance

```c++
class base
{
public:
    base() { cout << "base()\n"; }
    ~base() { cout << "~base()\n"; }
};
class derived : public base
{
public:
    derived() // Base::Base(this)
    { cout << "derived()\n"; }
    ~derived() { 
        cout << "~derived()\n"; 
    } // Base :: ~Base(this)
};
void main()
{
    derived ob;
}
```

Output:

```sh
base()
derived()
~derived()
~base()
```

## Hierarchical Inheritance

```c++
class cA{
};
class cB : cA{
};
class cC : cA{
};
class cD : cA{
};
```

## Multiple Inheritance

```c++
class cA{
};
class cB{
};
class cC : cA, cB{
};
```

#### Example 1

```c++
class base1
{
public:
    base1() { cout << "base1()\n"; }
    ~base1() { cout << "~base1()\n"; }
};
class base2
{
public:
    base2() { cout << "base2()\n"; }
    ~base2() { cout << "~base2()\n"; }
};
class derived : public base1, public base2
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
};
void main()
{
    derived ob;
}
```

#### Output
```sh
base1()
base2()
derived()
~derived()
~base2()
~base1()
```

#### Example 2

```c++
class base1
{
public:
    base1() { cout << "base1()\n"; }
    ~base1() { cout << "~base1()\n"; }
};
class base2
{
public:
    base2() { cout << "base2()\n"; }
    ~base2() { cout << "~base2()\n"; }
};
class derived : public base2, public base1
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
};
void main()
{
    derived ob;
}
```

#### Output
```sh
base2()
base1()
derived()
~derived()
~base1()
~base2()
```

## Multi-level Inheritance

```c++
class cA{
};
class cB: cA{
};
class cC : cB{
};
class cD : cC{
};
```

#### Example

```c++
class base
{
public:
    base() { cout << "base()\n"; }
    ~base() { cout << "~base()\n"; }
};
class derived : public base
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
};
class mostDerived : public derived
{
public:
    mostDerived() { cout << "mostDerived()\n"; }
    ~mostDerived() { cout << "~mostDerived()\n"; }
};
void main()
{
    mostDerived ob;
}
```

#### Output

```sh
base()
derived()
mostDerived()
~mostDerived()
~derived()
~base()
```

## Hybrid Inheritance

```c++
class cA{
};
class cB: cA{
};
class cC : cA{
};
class cD : cC, CB{
};
```

### Diamond problem execution

```c++
struct sA
{
    int m_i;
    sA(int arg = -1) : m_i(arg)
    {
    }
};
struct sB : sA
{
    int m_j;
    sB(int arg = -2) : m_j(arg)
    {
    }
};
struct sC : sA
{
    int m_k;
    sC(int arg = -3) : m_k(arg)
    {
    }
};
struct sD : sB, sC
{
    int m_l;
    sD(int arg = -4) : m_l(arg)
    {
    }
};

void sizes()
{
    cout << "sizeof(sA): " << sizeof(sA) << "\n";
    cout << "sizeof(sB): " << sizeof(sB) << "\n";
    cout << "sizeof(sC): " << sizeof(sC) << "\n";
    cout << "sizeof(sD): " << sizeof(sD) << "\n";
}

int main()
{
    sizes();
    sD dObj;
    cout << dObj.m_i << endl;
}
```

Output:
```sh
<source>: In function ‘int main()’:
<source>:46:18: error: request for member ‘m_i’ is ambiguous
   46 |     cout >> dObj.m_i >> endl;
      |                  ^~~
<source>:7:9: note: candidates are: ‘int sA::m_i’
    7 |     int m_i;
      |         ^~~
<source>:7:9: note:                 ‘int sA::m_i’
```

Here, when we try to access the `m_i` of __sA__, we are getting the above error. This is because we are creating multiple instances of __sA__, through __sB__ and __sC__. And the compiler does know which instance we are referring to – is it through `sB` or through `sC`.

To Overcome this error, we can do two ways.
1. Scope-resolution operator(::)
2. Using `virtual` keyword

### Diamond Problem Solutions

### 1. Scope-resolution operator(::)

```c++
struct sA
{
    int m_i;
    sA(int arg = -1) : m_i(arg)
    {
    }
};
struct sB : sA
{
    int m_j;
    sB(int arg = -2) : m_j(arg)
    {
    }
};
struct sC : sA
{
    int m_k;
    sC(int arg = -3) : m_k(arg)
    {
    }
};
struct sD : sB, sC
{
    int m_l;
    sD(int arg = -4) : m_l(arg)
    {
    }
};

void sizes()
{
    cout << "sizeof(sA): " << sizeof(sA) << "\n";
    cout << "sizeof(sB): " << sizeof(sB) << "\n";
    cout << "sizeof(sC): " << sizeof(sC) << "\n";
    cout << "sizeof(sD): " << sizeof(sD) << "\n";
}

int main()
{
    sizes();
    sD dObj;
    cout << "dObj.sB::m_i = " << dObj.sB::m_i << endl;
    cout << "dObj.sC::m_i = " << dObj.sC::m_i << endl;
}
```

Output

```sh
sizeof(sA): 4
sizeof(sB): 8
sizeof(sC): 8
sizeof(sD): 20
dObj.sB::m_i = -1
dObj.sC::m_i = -1
```

### 2. Using `virtual` keyword

```c++
struct sA
{
    int m_i;
    sA(int arg = -1) : m_i(arg)
    {
    }
};
struct sB : virtual sA
{
    int m_j;
    sB(int arg = -2) : m_j(arg)
    {
    }
};
struct sC : virtual sA
{
    int m_k;
    sC(int arg = -3) : m_k(arg)
    {
    }
};
struct sD : sB, sC
{
    int m_l;
    sD(int arg = -4) : m_l(arg)
    {
    }
};

void sizes()
{
    cout << "sizeof(sA): " << sizeof(sA) << "\n";
    cout << "sizeof(sB): " << sizeof(sB) << "\n";
    cout << "sizeof(sC): " << sizeof(sC) << "\n";
    cout << "sizeof(sD): " << sizeof(sD) << "\n";
}

int main()
{
    sizes();
    sD dObj;
    cout << "dObj.sB::m_i = " << dObj.m_i << endl;
}
```

Output: 
```sh
sizeof(sA): 4
sizeof(sB): 16
sizeof(sC): 16
sizeof(sD): 40
dObj.sB::m_i = -1
```

> __Note__: The `virtual` keyword makes the 
>> 1. Run time binding
>> 2. Address calculation at Compile time

#### Example 1

```c++
class base
{
public:
    base() { cout << "base()\n"; }
    ~base() { cout << "~base()\n"; }
};
class derived : public base
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
};
class derived1 : public base
{
public:
    derived1() { cout << "derived1()\n"; }
    ~derived1() { cout << "~derived1()\n"; }
};
class mostDerived : public derived, public derived1
{
public:
    mostDerived() { cout << "mostDerived()\n"; }
    ~mostDerived() { cout << "~mostDerived()\n"; }
};
void main()
{
    mostDerived ob;
}
```

#### Output
```sh
base()
derived()
base()
derived1()
mostDerived()
~mostDerived()
~derived1()
~base()
~derived()
~base()
```

#### Example 2

```c++
class base
{
public:
    base() { cout << "base()\n"; }
    ~base() { cout << "~base()\n"; }
};
class derived : virtual public base
{
public:
    derived() { cout << "derived()\n"; }
    ~derived() { cout << "~derived()\n"; }
};
class derived1 : virtual public base
{
public:
    derived1() { cout << "derived1()\n"; }
    ~derived1() { cout << "~derived1()\n"; }
};
class mostDerived : public derived, public derived1
{
public:
    mostDerived() { cout << "mostDerived()\n"; }
    ~mostDerived() { cout << "~mostDerived()\n"; }
};
void main()
{
    mostDerived ob;
}
```

#### Output
```sh
base()
derived()
derived1()
mostDerived()
~mostDerived()
~derived1()
~derived()
~base()
```