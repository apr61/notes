---
title: Linked List in Java
date: 30/8/2024
---

- **LinkedList** implements **List**. 
- LinkedList allows duplicates and is an ordered collection.
- LinkedList store elements in the form of nodes and connect with links.
- Accessing of elements is slower in LinkedList.
- Insertion and Deletions are faster - No shifting of ellements.


### Methods
Linked list has all the methods of except for below one.
|Name|Description|
|----|-----------|
|`void addFirst(E e)`|Inserts specified element to the beginning|
|`boolean addLast(E e)`|Inserts specified element to the end|
|`void removeFirst(E e)`|Removes and returns the first element|
|`void removeLast(E e)`|Removes and returns the lst element|
|`Iterator descendingIterator()`|Returns iterator over the elements in reverse|
|`E getFirst()`|Returns the first element|
|`E getLast()`|Returns the last element|


```java

import java.util.*;

public class Main{
    public static void main(String[] args){
        LinkedList<String> ll = new LinkedList<>();
        ll.add("apple");
        ll.add("banana");
        
        System.out.println("ll :: " + ll);
        
        ll.addFirst("mango");
        System.out.println("added at first :: " + ll);
        
        ll.addLast("grapes");
        System.out.println("added at last :: " + ll);
        
        System.out.println("first element :: " + ll.getFirst());
        System.out.println("last element :: " + ll.getLast());
        
        System.out.println("first element removed :: " + ll.removeFirst());
        System.out.println("last element removed :: " + ll.removeLast());
        
        ll.addLast("pineapple");
        
        ll.addLast("watermelon");
        
        System.out.println("apple is present in list :: " + ll.contains("apple"));
        
        System.out.println("ll :: " + ll);
        
        Iterator<String> itr = ll.descendingIterator();
        
        while(itr.hasNext()){
            System.out.print(itr.next() + " ");
        }
        
        System.out.println();
        
        itr = ll.iterator();
        while(itr.hasNext()){
            System.out.print(itr.next() + " ");
        }
    }
}

```

```
ll :: [apple, banana] 
added at first :: [mango, apple, banana]
added at last :: [mango, apple, banana, grapes]
first element :: mango
last element :: grapes
first element removed :: mango
last element removed :: grapes
apple is present in list :: true
ll :: [apple, banana, pineapple, watermelon]
watermelon pineapple banana apple // descendingIterator()
apple banana pineapple watermelon  // iteraator()
```