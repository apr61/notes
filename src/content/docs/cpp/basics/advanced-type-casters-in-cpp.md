---
title: Advanced Type Casters in C++
date: 18/8/2024
---

## Type casters Types

1. Const Cast
2. Reinterpret Cast
3. Static Cast
4. Dynamic Cast

## Const Cast
This type caster is used to add or remove the __const qualification__ from a variable. It can be used to temporarily cast away the constness of an object, which allows the modification.

Example 1

```c++
void gfun(const int *ip)
{
    int *ip2 = const_cast<int *>(ip);
    cout << " ip2 = " << ip2 << ", *ip2 = " << *ip2 << "\n";
    //Changing value
    *ip2 = 2000;
    cout << " ip2 = " << ip2 << ", *ip2 = " << *ip2 << "\n";
}
void main()
{
    const int i = 10;
    cout << " i = " << i << ", &i = " << &i << "\n";
    gfun(&i);
    cout << " i = " << i << ", &i = " << &i << "\n";
}
```

Example 2

```c++
void gfun(const int *ip)
{
    int *ip2 = const_cast<int *>(ip);
    cout << " ip2 = " << ip2 << ", *ip2 = " << *ip2 << "\n";
    *ip2 = 2000;
    cout << " ip2 = " << ip2 << ", *ip2 = " << *ip2 << "\n";
}

void main()
{
    const int i = 10;
    const int * li = &i;
    cout << " i = " << i << ", &i = " << &i << "\n";
    cout << " *li = " << *li << ", li = " << li << "\n";
    gfun(&i);
    cout << " i = " << i << ", &i = " << &i << "\n";
    cout << " *li = " << *li << ", li = " << li << "\n";
}
```

`const_cast` can be used to change non-const class members inside a constant member function. Inside const member function this is treated as `const Student* const this` i.e., this is a constant pointer pointing to a constant object.

```c++
class Student
{
private:
    int roll;

public:
    // constructor
    Student(int r) : roll(r) {}
    // A const function that changes roll with the help of const_cast
    void fun() const
    {
        (const_cast<Student *>(this))->roll = 5;
    }
    int getRoll() { return roll; }
};

int main(void)
{
    Student s(3);
    cout << "Old roll number: " << s.getRoll() << endl;
    s.fun();
    cout << "New roll number: " << s.getRoll() << endl;
    return 0;
}
```

## Reinterpret Cast

This type caster allows you to perform low-level reinterpretation of data, __converting one type to another without any checks or conversions__. 

It is typically used for casting between unrelated types, such as __converting a pointer to an integer or vice versa__. Reinterpret casting should be used with caution, as it can lead to undefined behaviour if misused.

```c++
void main()
{
    struct sA
    {
    };
    union uA
    {
    };

    sA *sp = nullptr;
    uA *up = new uA();

    sp = reinterpret_cast<sA *>(up);
    cout << "up = " << up << "\n";
    cout << "sp = " << sp << "\n";
}
```

## Static Cast

This is the most used type caster in C++. It allows you to perform a wide range of conversions, including __implicit conversions, narrowing conversions, and up casting/down casting within an inheritance hierarchy__.

#### Converting a `double` to a `char` type

```c++
void main()
{
    double d = 65.5;
    char ch;
    // ch = (char)(short)(int)d; // Regular way
    ch = static_cast<char>(d);
    cout << "ch = " << ch << "\n";
}
```

#### Static cast in Inheritance

```c++
void main()
{
    // Multi level inheritance
    struct sA
    {
    };
    struct sB : sA
    {
    };
    struct sC : sB
    {
    };
    struct sD : sC
    {
    };

    sA *ap = new sA();
    sB *bp = nullptr;
    sC *cp = nullptr;
    sD *dp = nullptr;

    cout << "ap = " << ap << "\n";
    cout << "bp = " << bp << "\n";
    cout << "cp = " << cp << "\n";
    cout << "dp = " << dp << "\n";

    // ap = (sA *)(sB *)cp; // up-casting - Regular way
    bp = static_cast<sB *>(ap);
    cp = static_cast<sC *>(ap);
    dp = static_cast<sD *>(ap);
    cout << "ap = " << ap << "\n";
    cout << "bp = " << bp << "\n";
    cout << "cp = " << cp << "\n";
    cout << "dp = " << dp << "\n";
}
```

## Dynamic Cast

This type caster is specifically used for performing safe __down casting (converting a base class pointer/reference to a derived class pointer/reference)__ in `polymorphic` class hierarchies. 

It performs a __runtime type__ check to ensure the conversion is valid, __returning a pointer/reference of the derived class type if successful or a null pointer__ if the conversion is not possible. To perform dynamic casting at least __one function needs to be virtual__.


```c++
void main()
{
    struct sA
    {
        virtual ~sA() {} // Mandatory
    };
    struct sB : sA
    {
    };
    struct sC : sB
    {
    };
    struct sD : sC
    {
    };
    // Try changing the dervied class to see how dynamic casting works
    sA *ap = new sB(); 
    sB *bp = nullptr;
    sC *cp = nullptr;
    sD *dp = nullptr;

    cout << "ap = " << ap << "\n";
    cout << "bp = " << bp << "\n";
    cout << "cp = " << cp << "\n";
    cout << "dp = " << dp << "\n";

    // ap = dynamic_cast<sA *>(bp);
    bp = dynamic_cast<sB *>(ap);
    cp = dynamic_cast<sC *>(ap);
    dp = dynamic_cast<sD *>(ap);

    cout << "ap = " << ap << "\n"; // same address
    cout << "bp = " << bp << "\n"; // same address
    cout << "cp = " << cp << "\n"; // nullptr
    cout << "dp = " << dp << "\n"; // nullptr
}
```