---
title: Map interface in Java
date: 30/8/2024
---

- Stores values using keys.
- Keys must be unique and values can be duplicate.
- Map is an Interface.

### Methods
|Name|Description|
|----|-----------|
|`put(K key, V value)`|Stores value using key|
|`V get(K key)`|Returns value of specified key|
|`void clear()`|removes all elements from the map|
|`boolean isEmpty()`|Returns `true` if map has key-values else `false`|
|`remove(Object key)`|Removes the key-value of specified key|
|`boolean containsKey(Object key)`|Returns `true` if specified key is present else `false`|
|`Set<K> keySet()`|Returns a Set of keys contained in the map|
|`Collection<V> values()`|Returns collection of values|
|`replace(K key, V value)`|Replace the value of specified key with given value|
|`int size()`|Returns number of key-values|

### HashMap
- Doesnot maintain insertion order.
- Only one null key is allowed.

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
		HashMap<Integer, String> hm = new HashMap<Integer, String>();
        hm.put(null, "hi");
		hm.put(50, "Fifty");
		hm.put(20, "Twenty");
		hm.put(30, "Thirty");
		hm.put(40, "Fourty");
		hm.put(10, "Ten");
		System.out.println("Map : " + hm);
		System.out.println(hm.get(null));
	}
}
```

```
Map : {null=hi, 50=Fifty, 20=Twenty, 40=Fourty, 10=Ten, 30=Thirty}
hi
```

### LinkedHashMap
- Maintains insertion order.
- Only one null key is allowed.

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
		LinkedHashMap<Integer, String> hm = new LinkedHashMap<Integer, String>();
        hm.put(null, "hi");
		hm.put(50, "Fifty");
		hm.put(20, "Twenty");
		hm.put(30, "Thirty");
		hm.put(40, "Fourty");
		hm.put(10, "Ten");
		System.out.println("Map : " + hm);
		System.out.println(hm.get(null));
	}
}
```

```
Map : {null=hi, 50=Fifty, 20=Twenty, 30=Thirty, 40=Fourty, 10=Ten}
hi
```

### TreeMap
- Maintains sorted order of keys.
- No null key is allowed.

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
		TreeMap<Integer, String> hm = new TreeMap<Integer, String>();
		hm.put(50, "Fifty");
		hm.put(20, "Twenty");
		hm.put(30, "Thirty");
		hm.put(40, "Fourty");
		hm.put(10, "Ten");
		System.out.println("Map : " + hm);
	}
}
```

```
Map : {10=Ten, 20=Twenty, 30=Thirty, 40=Fourty, 50=Fifty}
```

### Hashtable
- It is a legacy class.
- Maintains sorted order of keys.
- No null key is allowed.

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
		Hashtable<Integer, String> hm = new Hashtable<Integer, String>();
		hm.put(50, "Fifty");
		hm.put(20, "Twenty");
		hm.put(30, "Thirty");
		hm.put(40, "Fourty");
		hm.put(10, "Ten");
		System.out.println("Map : " + hm);
	}
}
```

```
Map : {10=Ten, 20=Twenty, 30=Thirty, 40=Fourty, 50=Fifty}
```

### Map methods example

```java
import java.util.*;

public class Main {
	public static void main(String[] args) {
		ArrayList<Integer> list = new ArrayList<>();
		HashMap<Integer, Integer> hm = new HashMap<>();
		for(int i = 0; i < 5; i++){
		    list.add(i + 1);
		    list.add(i + 2);
		}
		System.out.println("List :: " + list);
		
		for(int i = 0; i < list.size(); i++){
		    int item = list.get(i);
		    // Check if a key is present or not
		    if(hm.containsKey(item)){
		        int value = hm.get(item);
		        hm.put(item,  value + 1);
		    } else {
		        hm.put(item, 1);
		    }
		}
		
		System.out.println("Map :: " + hm);
		
		// get all keys
		Set<Integer> keys = hm.keySet();
		System.out.println("Keys :: " + keys);
		// Iterate using for-each
		for(int key : keys){
		    System.out.print(hm.get(key) + " ");
		}
		System.out.println();
		
		// Iterate using iterate()
		Iterator<Integer> itr = keys.iterator();
		
		while(itr.hasNext()){
		    System.out.print(hm.get(itr.next()) + " ");
		}
		System.out.println();
		
		// Get all values from map 
		Collection<Integer> values = hm.values();
		System.out.println("Values :: " + values);
	}
}
```

```
List :: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6]
Map :: {1=1, 2=2, 3=2, 4=2, 5=2, 6=1}
Keys :: [1, 2, 3, 4, 5, 6]
1 2 2 2 2 1 
1 2 2 2 2 1 
Values :: [1, 2, 2, 2, 2, 1]
```