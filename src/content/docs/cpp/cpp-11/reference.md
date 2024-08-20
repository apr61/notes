---
title: Reference in C++
date: 20/8/2024
---


Reference is an alias or alternative name for an existing variable.
- References can’t be NULL.
- Reference must be initialized when declared.
- Once initialized, we can’t reinitialize a reference.
- Reference doesn’t have its own address.

```c++
int main(void)
{
    int i = 10;
    int &iptr = i;

    cout << "i = " << i << ", &i = " << &i << "\n";
    cout << "iptr = " << iptr << ", &iptr = " << &iptr << "\n";
    return 0;
}
```

```sh
i = 10, &i = 0x7fff4e3be57c
iptr = 10, &iptr = 0x7fff4e3be57c
```

## Const Reference
```c++
void func(int x, int &ref, const int &constRef)
{
    x = ref + constRef;
    ref = constRef * 10;
    // constRef = ref + 10;// error
}
int main()
{
    int x = 10, y = 20, z = 30;
    cout << "x = " << x << ", y = " << y << ", z = " << z << endl;
    func(x, y, z);
    cout << "x = " << x << ", y = " << y << ", z = " << z << endl;
    return 0;
}
```

```sh
x = 10, y = 20, z = 30
x = 10, y = 300, z = 30
```

## Array reference
```c++
int main()
{
    int arr[] = {1, 2, 3, 4, 5};
    int (&ptr)[5] = arr;
    for (int i = 0; i < 5; i++)
    {
        cout << "ptr[" << i << "] = " << ptr[i] << "\n";
    }
    return 0;
}
```

```sh
ptr[0] = 1
ptr[1] = 2
ptr[2] = 3
ptr[3] = 4
ptr[4] = 5
```

## Function parameters
```c++
void modify(int & ref)
{
    ref = ref * 10;
}
int main()
{
    int value = 5;
    modify(value);
    cout<<value<<endl;
    return 0;
}
```

## Function return type

```c++
int arr[] = {1, 2, 3, 4, 5};
int& getElement(int index)
{
    return arr[index];
}
int main()
{
    getElement(2) = 30;
    for(int i : arr)
    {
        cout << i << " ";
    }
    return 0;
}
```

```sh
1 2 30 4 5 
```

> __NOTE__: Returning reference to local variables is dangerous and should be avoided. Reference of static variables can be returned.

## Reference to pointer
Let’s assume that you want to change the pointer to point to another variable in a function. See below example.

```c++
int global_Var = 42; 
// function to change pointer value 
void changePointerValue(int* pp) 
{ 
    pp = &global_Var; 
} 
int main() 
{ 
    int var = 23; 
    int* ptr_to_var = &var; 
    cout << "Passing Pointer to function:" << endl; 
    cout << "Before :" << *ptr_to_var << endl; // display 23 
    changePointerValue(ptr_to_var); 
    cout << "After :" << *ptr_to_var << endl; // display 23 
    return 0; 
}
```

```sh
Passing Pointer to function:
Before :23
After :23
```

We can resolve this issue by two ways
1. Pointer to pointer (Double pointer)
2. Reference Pointer

### Poinnter to pointer
```c++
int global_var = 42; 
// function to change pointer to pointer value 
void changePointerValue(int** ptr_ptr) 
{ 
    *ptr_ptr = &global_var; 
} 
int main() 
{ 
    int var = 23; 
    int* pointer_to_var = &var; 
    cout << "Passing a pointer to a pointer to function " << endl; 
    cout << "Before :" << *pointer_to_var << endl; // display 23 
    changePointerValue(&pointer_to_var); 
    cout << "After :" << *pointer_to_var << endl; // display 42 
    return 0; 
} 
```

```sh
Passing a pointer to a pointer to function 
Before :23
After :42
```

### Reference pointer
```c++
int gobal_var = 42; 
// function to change Reference to pointer value 
void changeReferenceValue(int*& pp)  // IMP
{ 
    pp = &gobal_var; 
} 
int main() 
{ 
    int var = 23; 
    int* ptr_to_var = &var; 
    cout << "Passing a Reference to a pointer to function" << endl; 
    cout << "Before :" << *ptr_to_var << endl; // display 23 
    changeReferenceValue(ptr_to_var); 
    cout << "After :" << *ptr_to_var << endl; // display 42 
    return 0; 
} 
```

## LValue 
Anything that is stored and can be addressable is called l-value. 
__Examples__: variable names, arrays elements, const expressions, bit-fields, unions, class members.

## RValue
Anything that is stored and cannot be addressable is called r-value
__Examples__: literals, function calls that return a nonreference type and temporary objects that are created during expression evaluation and can be accessed only by the compiler.

# LValue and RValue reference (C++ 11)
## LValue reference
LValue Reference can bind to existing __lvalues__. They could also bind to rvalues but only when the reference variable is declared as __constant__. The syntax for L value reference is same as regular reference variable __(Datatype&)__. 

## RValue reference
RValue Reference can only bind to __rvalues__. RValue reference can modify the value of rvalues which means reference variable need not to be constant. A rvalue reference is declared with two ampersands instead of one (Datatype&&).  

```c++
int main()
{
    int x = 10;
    int& lref1 = x; // lvalue reference to lvalue
    const int& lref2 = 15; //lvalue reference to rvalue
    int&& rref = 20; //rvalue reference to rvalue
    rref = 100;
    x = 200;
    cout<<x<<" "<<lref1<<" "<<lref2<<" "<<rref;
    return 0;
}
```

RValue reference has potentially two usecases
1. Move semantics
2. Perfect Forwarding

## Perfect Forwarding

Perfect forwarding reduces the need for overloaded functions and helps avoid forwarding problem. The forwarding problem can occur when we write a generic function that takes references as a parameter. Consider below example.

```c++
struct cA
{
    void m_fun(int & lRef)
    {
        cout<<"void m_fun(int & lRef)\n";
    }
    void m_fun(int && rRef)
    {
        cout<<"void m_fun(int && rRef)\n";
    }
}gobj;

template <typename T>
void gfun(T && arg) // Coined by Scott Meyers T&& => Universal reference
{
    gobj.m_fun(arg);
}

void main()
{
    int li = 10;
    gfun(li); // Passing lvalue
    gfun(100); // passing rvalue
}
```

#### Output
```sh
void m_fun(int & lRef)
void m_fun(int & lRef)
```

#### Expected Output
```sh
void m_fun(int & lRef)
void m_fun(int && rRef)
```

We solve above problem by using `std::forward` semantic.

```c++
struct cA
{
    void m_fun(int & lRef)
    {
        cout<<"void m_fun(int & lRef)\n";
    }
    void m_fun(int && rRef)
    {
        cout<<"void m_fun(int && rRef)\n";
    }
}gobj;

template <typename T>
void gfun(T && arg) // Coined by Scott Meyers T&& => Universal reference
{
    gobj.m_fun(std::forward<T&&>(arg));
}
void main()
{
    int li = 10;
    gfun(li); // Passing lvalue
    gfun(100); // passing rvalue
}
```

#### Output
```sh
void m_fun(int & lRef)
void m_fun(int && rRef)
```

## Reference collapsing rules
|Arg|Converted to|
|----|----|
|T& &arg| &|
|T& &&arg| &|
|T&& &arg| &|
|T&& &&arg| &&|

