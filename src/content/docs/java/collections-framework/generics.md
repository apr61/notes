---
title: Generics in Java
date: 30/8/2024
---

Collections only store objects. **Generics** were introduced in **JDK5**. Generics Specify what type of object are allowed to be stored into collections.

### Collections without generics
It will allow any type of object to be stored.

```java
Collection c = new Collection();
c.add(10);
c.add(23.4);
c.add("Java");
```

### Collections generics
It will allow only specific type of object to be stored.

```java
Collection<Integer> c = new Collection<Integer>();
c.add(10);
c.add(23.4); //gives error
c.add("Java"); // gives error
```

### Collections with generics that allows any type of Object

```java
Collection<Object> c = new Collection<Object>();
c.add(10);
c.add(23.4); 
c.add("Java"); 
```

> Note: **Object** is super class of all classes in Java.

If we store information in Object form, we need to downcast the object into corresponding type to perform operations.

From above example to access the values, we need to perform 

```java
// Downcasting or AutoUnboxing
Interger x = c.get(0);
Double d = c.get(1);
String s = c.get(2);
```

