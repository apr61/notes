---
title: Memory Model
date: 04/01/2026
---

Memory model consists of different segments.
1. Stack Segment
2. Heap Segment
3. Data Segment
4. Code Segment

## Stack Segment
Stack segment is used for storing local variables and function call data. Stack Segment is managed by compiler and it's allocation and deallocation are done automatically. Stack memory is also a LIFO (Last In First Out) data structure.

```c++
void functionF1()
{
    int x = 10; // x is stored locally in the stack memory
}
```

## Heap Segment
Heap segment is used for dynamic storage duration variables, such as objects created using `new` keyword. The programmer has control over the allocation and deallocation of heap memory using `new` and `delete`. Heap Segment is a larger pool of memory but with slower access.

```c++
void functionEx()
{
    int * p = new int; // dynamically allocated memory
    *p = 10;

    delete p; //deallocate memory
}
```

## Data Segment
The data segment is composed of two parts
1. The initialized data segment
    - Writable segment
    - Read-only segment
2. Uninitialized data segment (BSS - Block Started By Symbol)

The initialized data segment (Writable) stores global, static with initial values.

The initialized data segment (read-only) stores constant globals variables, string literals with initial values

Where as Uninitialized segment stores Uninitialized global and static variables.

```c++
// Initialized data segment - writable
int globalVar = 10;
static int staticVar = 10;

// Initialized data segment - read-only
const int constVar = 10;
const char * str = "Hello world";

// Uninitialized data segment
int globalVar;
static int staticVar;
```

## Code segment
The code segment (also known as Text Segment) stores the executable code (machine code) of program. It is usually located in read-only area of memory to prevent accidental modification.