---
title: Functional Interface
date: 3/9/2024
---

**Functional interface** are interfaces that accept only **one abstract method**.
- Functional interfaces are annotated using `@FunctionalInterface`.
- Functional interfaces are also called **SAM** (Single Abstract Method Interfaces)
- Functional interfaces can also have **static and default methods**.

```java
@FunctionalInterface
interface Test{
    void m1();
}
```

### Static and default methods in Functional interface

```java
@FunctionalInterface
interface First{
    static void m1(){
        System.out.println("Static method");
    }

    default void m2(){
        System.out.println("Default method");
    }

    void m3();
}

class Second implements First{
    public void m3(){
        System.out.println("Instance method");
    }
}

public class Main{
    public static void main(String [] args){
        First obj = new Second();
        First.m1();
        obj.m2();
        obj.m3();
    }
}

```

### Built-in java functional interfaces
1. **Runnable** : Only contains `run()` method.
2. **Comparable** : Only contains `compareTo()` method.
3. **ActionListen** :  Only contains `actionPerformed()` method.
4. **Callable** : Only contains `call()` method.


## Marker Interface
It is an empty interface (no fields or methods). Examples of marker interface include **Clonable**, **Serializable** and **Remote** interface.