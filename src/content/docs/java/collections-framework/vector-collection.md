---
title: Vector collection in Java
date: 30/8/2024
---

**Vector** implements List(Interface).
Vector allows duplicates and follows insertion order.
Vector is **Synchronized** by default / Thread safe.

```java
import java.util.*;
class Example{
    public static void main(String[] args){
        Vector<Integer> v = new Vector<Integer>();
        for(int i = 1; i <= 5; i++){
            v.add(i * 10);
        }
        System.out.println(v);
    }
}
```

### Enumeration
- Vector is legacy class since first version of JDK.
- Enumeration interface is used to process vector elements one by one.
- `elements()` returns Enumeration-interface

#### Methods
|Name|Description|
|----|-----------|
|`Enumeration<Integer> elements()`|Returns enumeration-interface|
|`boolean hasMoreElements()`|Returns `true` if element is present in Enumeration else `false`|
|`E nextElement()`|Returns the next element in the Enumeration|


### ArrayList vs Vector

ArrayList is not **Synchronized**. It is not thread safe. Will get odd results when we try to add elements into ArrayList from multiple threads.

```java
import java.util.*;

class Test{
    static ArrayList<Integer> list = new ArrayList<Integer>();
}

class First extends Thread{
    public void run(){
        for(int i = 0; i < 100000; i++){
            Test.list.add(i);
        }
    }
}

class Second extends Thread{
    public void run(){
        for(int i = 0; i < 100000; i++){
            Test.list.add(i);
        }
    }
}

public class Main{
    public static void main(String[] args) throws InterruptedException{
        First f = new First();
        Second s = new Second();
        f.start();
        s.start();
        f.join();
        s.join();
        System.out.println("List size = " + Test.list.size());
    }
}

```

```sh
List size = 130050
```

Vector is **Synchronized** by default. It is thread safe. Will get perfect results when we try to add elements into Vector from multiple threads.

```java
import java.util.*;

class Test{
    static Vector<Integer> list = new Vector<Integer>();
}

class First extends Thread{
    public void run(){
        for(int i = 0; i < 100000; i++){
            Test.list.add(i);
        }
    }
}

class Second extends Thread{
    public void run(){
        for(int i = 0; i < 100000; i++){
            Test.list.add(i);
        }
    }
}

public class Main{
    public static void main(String[] args) throws InterruptedException{
        First f = new First();
        Second s = new Second();
        f.start();
        s.start();
        f.join();
        s.join();
        System.out.println("Vector size = " + Test.list.size());
    }
}

```

```sh
Vector size = 200000
```