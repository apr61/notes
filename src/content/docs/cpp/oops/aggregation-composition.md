---
title: Aggregation and composition in C++
date: 20/8/2024
---

## Composition:
Composition represents a strong **has-a** relationship between classes, where one class owns and contains objects of another class. The lifetime of the `contained objects is controlled by the container class`. If the container object is destroyed, the contained objects are also destroyed. Composition is typically implemented using member variables.

### Example
```c++
class Engine {
  // Engine implementation...
};

class Car {
  Engine engine;  // Car has an Engine (composition)
  // Car implementation...
};
```

In this example, the Car class has a composition relationship with the Engine class. The Car class owns and contains an Engine object as a member variable. When a Car object is destroyed, the Engine object inside it is also destroyed.

## Aggregation
Aggregation represents a **has-a** relationship between classes, where one class contains objects of another class, but the lifetime of the contained objects is `independent of the container class`. Aggregation is typically implemented using **pointers or references**.

### Example
```c++
class Person {
  // Person implementation...
};

class Organization {
  std::vector<Person*> members;  // Organization has Persons (aggregation)
  // Organization implementation...
};
```

In this example, the Organization class has an aggregation relationship with the 
Person class. The Organization class contains pointers to Person objects but doesn't 
own their lifetime. The Person objects can exist independently and can be shared 
among multiple organizations.

# Association
Association represents a **knows-about** relationship between classes, where one class 
is aware of another class. It is a more general and loosely coupled relationship 
compared to composition and aggregation. The lifetime and ownership of the associated
objects are independent.

```c++
class Teacher {
  // Teacher implementation...
};

class Student {
  // Student implementation...
};

class Classroom {
  Teacher* teacher;      // Classroom knows about a Teacher (association)
  std::vector<Student*> students;  // Classroom knows about Students (association)
  // Classroom implementation...
};
```

In this example, the Classroom class has an association relationship with the Teacher 
and Student classes. The Classroom class is aware of the Teacher and Student objects 
but doesn't own their lifetime. The Teacher and Student objects can exist 
independently and can be associated with multiple classrooms.
