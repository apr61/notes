---
title: Shallow Copy and Deep copy in C++
date: 20/8/2024
---


## Shallow Copy
A Shallow Copy is a type of copy operation in which the bits of one object is directly copied
to another object.  
(or)  
A Shallow copy simply duplicates the references of the resource without
creating new copies of the resource themselves.

### Example

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
            cout << "Deleting resource" <<endl;
            delete[] m_arr;
        }
        else
        {
            cout << "Deleting resource of nullptr" <<endl;
        }
    }
    cA(cA &rhs)
    {
        cout << "cA : Copy cons : this = " << this << "\n";
        // Shallow copy
        // Just copying the refence of source object
        this->m_arr = rhs.m_arr;
    }
};
int main()
{
    cA obj1;
    cA cloneObj(obj1);
    return 0;
}
```

### Output
```sh
cA : Default/Single cons: this = 0x7ffe1f2a4e28
cA : Copy cons : this = 0x7ffe1f2a4e30
~cA : Des : this = 0x7ffe1f2a4e30
Deleting resource
~cA : Des : this = 0x7ffe1f2a4e28
Deleting resource

free(): double free detected in tcache 2
Command terminated by signal 6
```

Here we are getting `free(): double free detected in tcache 2 Command terminated by signal 6`, because
we are trying to delete the resource that is already deleted.

We can overcome above error by moving the ownership of the resource.

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
            cout << "Deleting resource" << endl;
            delete[] m_arr;
        }
        else
        {
            cout << "Deleting resource of nullptr" << endl;
        }
    }
    cA(cA &rhs)
    {
        cout << "cA : Copy cons : this = " << this << "\n";
        try
        {
            this->m_arr = new int[MAX];
        }
        catch (...)
        {
            cout << "Low memeory...\n";
        }
        // Shallow copy
        this->m_arr = rhs.m_arr;
        rhs.m_arr = nullptr;
    }
};
void main()
{
    cA obj1;
    cA cloneObj(obj1);
}
```

#### Output
```sh
cA : Default/Single cons: this = 0x7ffca846b8e8
cA : Copy cons : this = 0x7ffca846b8f0
~cA : Des : this = 0x7ffca846b8f0
Deleting resource
~cA : Des : this = 0x7ffca846b8e8
Deleting resource of nullptr
```

## Deep Copy

A deep copy is a type of copy operation in which a new copy of an object is created, including 
new copies of any resources it owns.

This means that the copied object has its own independent memory for its member variables, 
rather than sharing the same memory addresses with the original object.

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
            cout << "Deleting resource" << endl;
            delete[] m_arr;
        }
        else
        {
            cout << "Deleting resource of nullptr" << endl;
        }
    }
    cA(cA &rhs)
    {
        cout << "cA : Copy cons : this = " << this << "\n";
        try
        {
            this->m_arr = new int[MAX];
        }
        catch (...)
        {
            cout << "Low memeory...\n";
        }
        // Deep - Copy
        for (int i = 0; i < MAX; i++)
        {
            this->m_arr[i] = rhs.m_arr[i];
        }
    }
};
void main()
{
    cA obj1;
    cA cloneObj(obj1);
}
```
