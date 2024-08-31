---
title: Static and default methods in interface (JDK7)
date: 31/8/2024
---

Since JDK7, **interface** is allowed to have static and default methods.

### Static interface methods
- Static interface methods can be accessed using identity of the Interface.
- Static interface methods are used to define common functionality of objects which are implemented from that interface.

```java
interface CreditCard{
    // By default static and final
    String cardType = "VISA-Shopify";

    static void benefits(){
        System.out.println("Extra 10% cashback on each order");
    }
}

// Calling can be done by
CreditCard::benefits();
```

#### static interface methods vs abstract classes
Abstract classes can have constructors, state and behaviour.

### Default interface methods
- `default` keyword is used to define.
- Default interface methods can be accessed through Object reference.
- Implicitly declared as `public`. No need of `public` modifier.

#### Why use default interface methods
Interfaces can have one or more implementations. If one or more methods are added to the interface, all the implementations have to implement them, else it will break the design.

By using *default interface methods*, they allow us to add new methods to an interface that are automatically available in implementations.

```java

import java.util.*;

interface Vehicle{
    public int getTopSpeed();

    default String alarmOn(){
        return "Alarm ON at speed 200 Km/H";
    }
    default String alarmOff(){
        return "Alarm OFF at speed 100 Km/H";
    }
}

class Car implements Vehicle{
    private String brand;

    @Override
    public int getTopSpeed(){
        return 250;
    }

    Car(String brand){
        this.brand = brand;
    }
}

public class Main{
    public static void main(String[] args){
        Vehicle bmw = new Car("BMW");
        System.out.println(bmw.getTopSpeed());
        System.out.println(bmw.alarmOn());
        System.out.println(bmw.alarmOff());
    }
}

```

```
250
Alarm ON at speed 200 Km/H
Alarm OFF at speed 100 Km/H
```

#### Problems with default interface methods

Java allows **Multiple Inheritance** for interface. A class can inherit multiple interfaces. So, when a class inherits multiple interface, that contain the same default methods, it will fall into **Diamond Problem**.

```java
interface Alarm{
    default String alarmOn(){
        return "Turning alarm ON";
    }
    default String alarmOff(){
        return "Turning alarm OFF";
    }
}

class Car implements Vehicle, Alarm{
    private String brand;

    @Override
    public int getTopSpeed(){
        return 250;
    }

    Car(String brand){
        this.brand = brand;
    }
}

public class Main{
    public static void main(String[] args){
        Vehicle bmw = new Car("BMW");
        System.out.println(bmw.getTopSpeed());
        System.out.println(bmw.alarmOn());
        System.out.println(bmw.alarmOff());
    }
}

```

When to try to compile the program we will get this error.

```
error: types Vehicle and Alarm are incompatible;
class Car implements Vehicle, Alarm{
^
  class Car inherits unrelated defaults for alarmOff() from types Vehicle and Alarm
1 error

```

To resolve this we have to provide custom implementations or we can call the parent implementations.


#### Using custom implementations

```java
class Car implements Vehicle, Alarm{
    // Other implementations

    @Override
    public String alarmOn(){
        return "Alarm will turn on";
    }

    @Override
    public String alarmOff(){
        return "Alarm will turn OFF";
    }
}
```

#### Calling parent implementations explicitly

```java
class Car implements Vehicle, Alarm{
    // Other implementations

    @Override
    public String alarmOn(){
        //using super
        return Vehicle.super.alarmOn();
    }

    @Override
    public String alarmOff(){
        return Vehicle.super.alarmOff();
    }
}
```

```java
class Car implements Vehicle, Alarm{
    // Other implementations

    @Override
    public String alarmOn(){
        return Alarm.super.alarmOn();
    }

    @Override
    public String alarmOff(){
        return Alarm.super.alarmOff();
    }
}
```

```java
class Car implements Vehicle, Alarm{
    // Other implementations

    @Override
    public String alarmOn(){
        return Vehicle.super.alarmOn() + " " + Alarm.super.alarmOn();
    }

    @Override
    public String alarmOff(){
        return Vehicle.super.alarmOff() + " " + Alarm.super.alarmOff();
    }
}
```