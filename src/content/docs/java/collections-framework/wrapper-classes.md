---
title: Wrapper classes in java
date: 30/8/2024
---

Collections store only objects(not primitive data types).
Wrapper classes provide functionality to perform converstions like
    1. Primitive -> Object (Boxing)
    2. Object -> Primitive (Unboxing)
The Conversions become automated from JDK5.

Every primitive type has a warapper class in Java.

|Primitive type | Wrapper Class |
|---------------|-------------- |
|byte|Byte|
|short|Short|
|int|Integer|
|char|Character|
|long|Long|
|float|Float|
|double|Double|
|boolean|Boolean|

### Boxing
Conversion of primitive type to object type

```java
int x = 10;
Integer obj = new Integer(x);
```

### UnBoxing
Conversion of Object type to primitive type

```java
int y = obj.intValue();
```

### Auto boxing
Auto conversion of primitive to object type.
```java
int x = 10;
Integer obj = x;
```

### Auto unboxing
Auto conversion of object to primitive type.
```java
int x = obj;
```