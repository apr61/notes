---
title: Opearator Overloading in C++
date: 18/8/2024
---

Operator Overloading is a compile time polymorphism. It is an idea of giving a special meaning to existing operator without changing it's original meaning.

## Operators that can be overloaded
1. `new` `delete`
2. (+ - * / % ^ & | ~)
3. ! = < > += -= *= /= %= 
4. ^= &= |= << >> >>= <<= == !=
5. <= >= && || ++ -- ->* -> ,
6. () []

## Operators that can't be overloaded
1. scope operator ::
2. sizeof() operator
3. period .
4. ternary operator ?:
5. typeid() operator

## Rules of Operator overloading

1. __Precedence__ and __associativity__ of operator cannot be changed
2. Arity (number of operands) of operators cannot be changed
3. Bulit-in operators can be overloaded
4. Operators cannot be overloaded for __built-in types__. At least one operand must be a user-defined type. In C++, you cannot overload operators for built-in types like __int, float, char,__ etc., but you can overload operators if at least one of the operands is a user-defined type.
5. Overloaded operators __cannot have default arguments__ except the function __call operator ()__ which can have default arguments.
6. Assignment (=), subscript ([]), function call ("()"), and member selection (->) operators must be defined as member functions
7. Some operators like (assignment)=, (address)& and comma (,) are by default overloaded.

## Operator Overlading example

```c++
class Complex
{
private:
    int m_real;
    int m_img;

public:
    Complex();
    explicit Complex(int = 0, int = 0);
    explicit Complex(Complex &);
    ~Complex();
    /*
        Getters and Setters
    */
    int get_M_Real(void) const;
    int get_M_Img(void) const;
    void set_M_Real(int realVal);
    void set_M_Img(int imgVal);
    Complex &operator++();
    Complex &operator--();
    Complex &operator--(int);
    void operator+=(Complex &rhs);
    void operator*=(Complex &rhs);
    friend std::ostream &operator<<(std::ostream &os, Complex &rhs);
    Complex &operator+(int value);
    void operator=(Complex &rhs);
};
std::ostream &operator<<(std::ostream &os, Complex &rhs);

void operator+(Complex &lhs, Complex &rhs);
Complex &operator/(Complex &ref, int value);
Complex &operator*(Complex &ref, int value);
void operator-(Complex &lhs, Complex &rhs);
bool operator==(Complex &lhs, Complex &rhs);
bool operator!=(Complex &lhs, Complex &rhs);
bool operator>=(Complex &lhs, Complex &rhs);
bool operator>(Complex &lhs, Complex &rhs);
bool operator<(Complex &lhs, Complex &rhs);
bool operator<=(Complex &lhs, Complex &rhs);

Complex::~Complex()
{
    cout << "Destrutor :: this " << this << " m_real = " << this->m_real << ", m_img = " << this->m_img << endl;
}

Complex::Complex()
{
    this->m_real = 0;
    this->m_img = 0;
}

Complex::Complex(int realValue, int imgValue) : m_real(realValue), m_img(imgValue)
{
}

Complex::Complex(Complex &ref)
{
    this->m_img = ref.m_img;
    this->m_real = ref.m_real;
}

int Complex::get_M_Real(void) const
{
    return this->m_real;
}
int Complex::get_M_Img(void) const
{
    return this->m_img;
}
void Complex::set_M_Real(int realVal)
{
    this->m_real = realVal;
}
void Complex::set_M_Img(int imgVal)
{
    this->m_img = imgVal;
}
```

## Arithmetic Operators

## Pre Increment (++)

```c++
Complex &Complex::operator++()
{
    cout << "Complex & Operator ++ \n";
    ++this->m_real;
    return *this;
}
```

## Post Increment (++)

```c++
Complex &Complex::operator++(int)
{
    cout << "Complex & Operator ++ \n";
    this->m_real++;
    return *this;
}
```

## Pre Decrement (--)

```c++
Complex &Complex::operator++()
{
    cout << "Complex & Operator ++ \n";
    --this->m_real;
    return *this;
}
```

## Post Decrement (--)

```c++
Complex &Complex::operator++(int)
{
    cout << "Complex & Operator ++ \n";
    this->m_real--;
    return *this;
}
```

## Addition Operator with `int` (+)

```c++
Complex &Complex::operator+(int value) 
{
    cout << "Complex & Operator + \n";
    this->m_real = this->m_real + value;
    return *this;
}
```
## Addition Operator with `Object Reference` (+)

```c++
void operator+(Complex &lhs, Complex &rhs)
{
    cout << "Complex & + Complex &\n";
    lhs.set_M_Real(lhs.get_M_Real() + rhs.get_M_Real());
}
```

## Substraction Operator with `Object reference` (-)
```c++
void operator-(Complex &lhs, Complex &rhs)
{
    lhs.set_M_Real(lhs.get_M_Real() - rhs.get_M_Real());
}
```

## Multiplication Operator (*)
```c++
Complex &operator*(Complex &ref, int value)
{
    cout << "Complex & * \n";
    ref.set_M_Real(ref.get_M_Real() * value);
    return ref;
}
```

## Division Operator (/)
```c++
Complex &operator/(Complex &ref, int value)
{
    cout << "Complex & / \n";
    ref.set_M_Real(ref.get_M_Real() / value);
    return ref;
}
```

## Comparison Operators

## Equal to operator (==)
```c++
bool operator==(Complex &lhs, Complex &rhs)
{
    if (lhs.get_M_Real() == rhs.get_M_Real())
    {
        return true;
    }
    else
    {
        return false;
    }
}
```

## Not equal operator (!=)

```c++
bool operator!=(Complex &lhs, Complex &rhs)
{
    return (lhs.get_M_Real() != rhs.get_M_Real());
}
```

## Greater than operator (>)

```c++
bool operator>(Complex &lhs, Complex &rhs)
{
    return (lhs.get_M_Real() > rhs.get_M_Real());
}
```

## Less than operator (<)

```c++
bool operator<(Complex &lhs, Complex &rhs)
{
    return (lhs.get_M_Real() < rhs.get_M_Real());
}
```

## Less than or equal to operator (<=)

```c++
bool operator<=(Complex &lhs, Complex &rhs)
{
    return (lhs.get_M_Real() <= rhs.get_M_Real());
}
```

## Greater than or equal to operator (>=)

```c++
bool operator>=(Complex &lhs, Complex &rhs)
{
    return (lhs.get_M_Real() >= rhs.get_M_Real());
}
```

## Assignment Operators

## Assignment operator (=)

```c++
void Complex::operator=(Complex &rhs)
{
    this->m_real = rhs.m_real;
}
```

## Addition assignment (+=)

```c++
void Complex::operator+=(Complex &rhs)
{
    this->m_real += rhs.get_M_Real();
}

Complex obj1(10);
Complex obj2(20);
obj1 = obj2;
/*
    obj1 = obj2;
    is equalent to
    Complex :: operator = (obj1, obj2);
*/
```

## Multiplication assignment (*=)

```c++
void Complex::operator*=(Complex &rhs)
{
    this->m_real *= rhs.get_M_Real();
}
```

## `cout` operator

```c++
std::ostream &operator<<(std::ostream &os, Complex &rhs)
{
    os << "this : " << &rhs << ", m_real = " << rhs.get_M_Real() << ", m_img = " << rhs.get_M_Img() << "\n";
    return os;
}
```