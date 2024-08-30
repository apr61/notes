---
title: Set interface in Java
date: 30/8/2024
---

- **Set** doesnot allow duplicates.
- Set in not index based.
- Set is an **interface**.

### Methods of HashSet
|Name|Description|
|----|-----------|
|`boolean add(E e)`|Adds specified element if not present|
|`void clear()`|removes all elements from the set|
|`Object clone()`|Returns a shallow copy|
|`boolean contains(E e)`|Returns `true` if specified element is present else `false`|
|`boolean isEmpty()`|Returns `true` if set is empty else `false`|
|`boolean remove(Object o)`|Removes the specified object from set if not present|
|`Iterator<E> iterator()`|Returns an iterator the elements|
|`int size()`|Returns number of elements|

> **Shallow copy**: The elements themselves are not copied.

### HashSet
- It doesn't maintain insertion order.

```java
import java.util.*;

public class Main{
    public static void main(String[] args){
        HashSet<Integer> hs = new HashSet<Integer>();
        
        hs.add(10);
        hs.add(20);
        hs.add(30);
        
        System.out.println("HashSet :: " + hs);
        
        hs.add(30);
        
        System.out.println("HashSet :: " + hs);
        
    }
}
```

```
HashSet :: [20, 10, 30]
HashSet :: [20, 10, 30]
```

- Remove duplicates in ArrayList

```java
import java.util.*;

public class Main{
    public static void main(String[] args){
        ArrayList<Integer> list = new ArrayList<Integer>();
        for(int i = 0; i < 5; i++){
            list.add(i + 1);
            list.add(i + 2);
        }
        System.out.println("List :: " + list);
        
        HashSet<Integer> hs = new HashSet<Integer>(list);
        System.out.println("Set :: " + hs);
    }
}
```

```
List :: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6]
Set :: [1, 2, 3, 4, 5, 6]
```

### LinkedHashSet
- It maintains insertion order of elements.

```java
import java.util.*;

public class Main{
    public static void main(String[] args){
        LinkedHashSet<Integer> hs = new LinkedHashSet<Integer>();
        
        hs.add(10);
        hs.add(20);
        hs.add(30);
        
        System.out.println("LinkedHashSet :: " + hs);
        
        hs.add(30);
        hs.add(5);
        
        System.out.println("LinkedHashSet :: " + hs);
        
    }
}
```

```
LinkedHashSet :: [10, 20, 30]
LinkedHashSet :: [10, 20, 30, 5]
```

### TreeSet
- It maintains sorted order of elements.

```java
import java.util.*;

public class Main{
    public static void main(String[] args){
        TreeSet<Integer> hs = new TreeSet<Integer>();
        
        hs.add(20);
        hs.add(10);
        hs.add(100);
        hs.add(5);
        System.out.println("TreeSet :: " + hs);
        
    }
}
```

```
TreeSet :: [5, 10, 20, 100]
```