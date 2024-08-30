---
title: ArrayList in Java
date: 30/8/2024
---

1. ArrayList is an ordered collection and allows duplicates.
2. ArrayList is index based. Accessing of elements is much faster.
3. Insertion and deletions are slower.

### Methods
|Name|Description|
|----|-----------|
|`int size()`|Returns number of elements|
|`boolean add(E e)`|Appends element to end of list|
|`Object remove(int index)`|Removes the element at specified position|
|`void clear()`|Removes all elements|
|`Object get(int index)`|Retuens the element at specified index|
|`boolean isEmpty()`|Returns `true` if list is empty else `false`|
|`Object set(int index, E element)`|Replaces element at specified postion with given element|
|`boolean contains(Object o)`|Returns `true` if element present in List else `false`|
|`int indexOf(Object o)`|Returns the index of specified object, else -1|
|`Iterator<Object> iterator()`|Returns an iterator over the list of elements|
|`boolean addAll(Collection c)`|Appends all elemets in the collection to end of list|
|`Object clone()`|Returns a **Shallow copy** of this ArrayList instance|
|`ListIterator iterator(int index)`|Returns a list iterator over the elements this list, starting at specified position|
|`Object[] toArray()`|Returns aan array containing all of the elements in this list in proper sequence|


### for-each loop
- Enhanced for loop
- It is available **JDK5**.
- Provides easy syntax to process elements of **Array or Collection**.

#### Limitations
- for-each can be used only for accessing in forward direction.
- one by one element processing.

```java
for(datatype var: Array/Collection){
    statements;
}
```

### Iterator
- It is an `Interface`.
- Iterator provides methods to iterate any collection.
- `iterator()` returns Iterator object of **any collection**.

#### Methods
|Name|Description|
|----|-----------|
|`boolean hasNext()`|Checks whether next element is present or not to iterate|
|`Object next()`|Returns the next element from iterator object|

```java
import java.util.*;
class Example{
    public static void main(String[] args){
        List<Integer> list = new ArrayList<Integer>();
        for(int i = 0; i <= 5; i++){
            list.add(i * 100);
        }

        Iterator<Integer> itr = list.iterator();
        while(itr.hasNext()){
            Integer ele = itr.next();
            System.out.println(ele);
        }
    }
}
```

### for vs for-each vs iterator

|for|for-each|iterator|
|---|--------|--------|
|Index based|Not index based|Not index based|
|Process only List/Array(Index based)|Process List, Set and Map | Process List, Set and Map|
|Use get(index) method|Do not use any other method|Do not use any other method|

### ListIterator
- It is an `interface`.
- `listIterator()` returns ListIterator object.
- We can iterate elements,
    1. Forward direction
    2. In backward direction
    3. From specified index

1. Accessing elements in forward direction

```java
import java.util.*;
class Example{
    public static void main(String[] args){
        List<Integer> list = new ArrayList<Integer>();
        for(int i = 0; i <= 5; i++){
            list.add(i * 100);
        }

        ListIterator<Integer> itr = list.listIterator();
        while(itr.hasNext()){
            Integer ele = itr.next();
            System.out.println(ele);
        }
    }
}
```

2. Accessing elements in backward direction

```java
import java.util.*;
class Example{
    public static void main(String[] args){
        List<Integer> list = new ArrayList<Integer>();
        for(int i = 0; i <= 5; i++){
            list.add(i * 100);
        }

        ListIterator<Integer> itr = list.listIterator(list.size());
        while(itr.hasPrevious()){
            Integer ele = itr.previous();
            System.out.print(ele + " ");
        }
    }
}
```
#### Methods
|Name|Description|
|----|-----------|
|`boolean hasPrevious()`|Checks whether previous element is present or not to iterate|
|`Object previous()`|Returns the previous element from iterator object|


3. ccessing elements from a specified index

```java
import java.util.*;
class Example{
    public static void main(String[] args){
        List<Integer> list = new ArrayList<Integer>();
        for(int i = 0; i < 10; i++){
            list.add(i * 100);
        }

        ListIterator<Integer> itr = list.listIterator(5); // starting index
        while(itr.hasNext()){
            Integer ele = itr.next();
            System.out.print(ele + " ");
        }
    }
}
```

## POJO class
Plain Old Java Object

#### POJO class rules
1. Class must be public
2. Variables must be private 
3. Every variable must have a `getter` and `setter` method.

```java
public class Rectangle{
    private int length;
    private int breadth;

    public void setLength(int length){
        this.length = length;
    }

    public int getlength(){
        return this.length;
    }

    public void setBreadth(int breadth){
        this.breadth = breadth;
    }

    public int getBreadth(){
        return this.breadth;
    }
}
```

