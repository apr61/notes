---
title: Lambda expressions
date: 10/9/2024
---

**Lambda Expression** is the simplest form of Functional Interface.

Ways of implemeting functional interface
1. Through Class
2. Through anonymous inner class
3. Through lambda expression

#### Impementing interface using class
```java
@FunctionalInterface
interface A{
    void fun();
}

class B implements A{
    public void fun(){
        System.out.println("Hi");
    }
}

public class Main{
    public static void main(String[] args){
        A obj = new B();
        obj.fun();
    }
}
```

#### Through anonymous inner class
Defining a class without identity is called **Anonymous inner class**. Anonymous inner class are always defined inside a method.

```java
@FunctionalInterface
interface A{
    void fun();
}

public class Main{
    public static void main(String[] args){
        A obj = new A(){
            public void fun(){
                System.out.println("Anonymous function...");
            }
        };
        obj.fun();
    }
}
```

## Through Lambda expression
- Expression is a line of code.
- Lambda expression is the implementation of Functional interface.

```java
@FunctionalInterface
interface A{
    void fun();
}

public class Main{
    public static void main(String[] args){
        A obj = () -> System.out.println("Lambda function...");
        obj.fun();
    }
}
```

### Defining a lambda expression
#### 1. Method with no parameters

```java
() -> System.out.println("Hi");
```

```java
@FunctionalInterface
interface A{
    void fun();
}

public class Main{
    public static void main(String[] args){
        A obj = () -> System.out.println("Lambda function...");
        obj.fun();
    }
}
```

#### 2. Method with only one parameter

```java
(a) -> System.out.println("Hi " + a);
```

```java
@FunctionalInterface
interface A{
    void fun(int a);
}

public class Main{
    public static void main(String[] args){
        A obj = (a) -> System.out.println("Lambda function... :: " + a);
        obj.fun(10);
    }
}
```

#### 3. Method with two/more parameters and return type

```java
@FunctionalInterface
interface A{
    int operation(int a, int b);
}

public class Main{
    public static void main(String[] args){
        A add = (a, b) -> a + b;
        A multiply = (a, b) -> a * b;
        System.out.println("Sum :: " + add.operation(10, 20));
        System.out.println("Multiply :: " + multiply.operation(10, 20));
    }
}
```

#### 4. Lambda expression as block

```java
(p1, p2) -> {
    //statement1
    //statement2
    return;
};
```

Here we can make use of `Runnable` interface, which is a functional interface.

```java
public class Main{
    public static void main(String[] args){
        Runnable myThread = () -> {
            String threadName = Thread.currentThread().getName();
            for(int i = 0; i < 20; i++){
                System.out.println(threadName + ", i :: " + i);
            }
        };

        Thread t1 = new Thread(myThread);
        Thread t2 = new Thread(myThread);
        
        for(int i = 0; i < 20; i++){
            System.out.println(Thread.currentThread().getName() + ", i :: " + i);
        }

        t1.start();
        t2.start();
    }
}
```

### Valid and invalid lambda expressions

#### Valid exmaples

```java

// 1
() -> {}

// 2
() -> "hello world"

// 3
() -> {return "Hello world"}

```

#### invalid examples

```java

// 1.
(Integer i) -> return "Hello world" + i;

// Correct is
(Integer i) -> {return "Hello world" + i;}

// 2
(String s) -> {"Hello world";}

//Correct is
(String s) -> "Hello world"
// or
(String s) -> {return "Hello world";};

```