---
title: References
date: 04/01/2026
---

A reference is an alias for an existing variable, meaning it's a different name for the same memory address. 
- Unlike pointers, references can't be null. 
- They must by initialized when they are declared.
- Once a reference is initialized it can't be changed to refer another variable.
- References are used when we want to pass a variable by reference in function arguments or when you want to create an alias for a variable without the need for pointer syntax

- References can be considered as Constant pointers.

```c++
dataType &referenceName = exisitngVariable;
```

#### Example
```c++
int num = 10;
int &ref = num; // Reference ref is now alias of `num`
```

### Function parameters

```c++
void swap(int& a, int& b)
{
    int temp = a;
    a = b;
    b = temp;
}

int main()
{
    int x = 5, y = 10;
    swap(x,y);
    // After this call - x = 10, y = 5
}
```

### const reference

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

### Array reference

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

### Function return type
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
- Returning reference to local variables is dangerous and should be avoided. Reference of static variables can be returned.

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

### Pointer to pointer
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

### References in range based for loops
When iterating over containers such as `std::vectors<std::string>`, the choice of `auto`, `auto &`, `auto const &` or `const auto` makes a big difference.

```c++
std::vector<std::string> strs {"abc", "qwerty", "xyz"};

// Read-only, no copies
for(auto const & str : strs)
    std::cout << str << std::endl;

// Makes a copy of each string
for(auto str : strs)
    std::cout << str << std::endl;

// Direct reference, can modify original elements
for(auto & str : strs)
    str += "#";

// Makes a copy of each string, but prevents modification
for(const auto str : strs)
    std::cout << str << std::endl;

```

## LValue and RValue

Every expression is categorized as either an lvalue (locator value) and rvalue (right value).

### LValue 
Anything that is stored and can be addressable is called l-value. 
__Examples__: variable names, arrays elements, const expressions, bit-fields, unions, class members.

### RValue
Anything that is stored and cannot be addressable is called r-value
__Examples__: literals, function calls that return a nonreference type and temporary objects that are created during expression evaluation and can be accessed only by the compiler.

```c++

int main()
{
    int a = 10;
    // `a` is an lvalue
    // `10` is an rvalue

    int b = a;
    // `a` (lvalue) used on right is fine (lvalue to rvalue conversion)
}

```

