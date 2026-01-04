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

