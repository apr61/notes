---
title: Comparator Interface in Java
date: 31/8/2024
---

- **Comparator interface** is used to *sort/order* the objects of a user-defined class.
- Comparator provides multiple sorting sequences hence we can sort the elements based on different data members.

### Methods
|Name|Description|
|----|-----------|
|`public int compare(Object o1, Object o2)`| Compares first and second object in the list|
|`public boolean equals(Object obj)`|COmpares this object with specified object|


```java
import java.util.*;

class Student{
    int rollno;
    String name;
    int age;
    Student(int rollno, String name, int age){
        this.rollno = rollno;
        this.name = name;
        this.age = age;
    }
}

class AgeComparator implements Comparator{
    public int compare(Object o1, Object o2){
        Student s1 = (Student) o1;
        Student s2 = (Student) o2;
        if(s1.age > s2.age){
            return 1;
        }
        return -1;
    }
}

public class Main{
    public static void main(String[] args){
        ArrayList<Student> l = new ArrayList<>();
        l.add(new Student(101, "John", 23));
        l.add(new Student(102, "Wick", 30));
        l.add(new Student(103, "Santanio", 53));
        l.add(new Student(104, "Di Antonio", 13));
        System.out.println("Before sort :: ");
        for(Student s : l){
            System.out.println(s.rollno + ", " + s.name + ", " + s.age);
        }
        Collections.sort(l, new AgeComparator());
        System.out.println("After sort :: ");
        for(Student s : l){
            System.out.println(s.rollno + ", " + s.name + ", " + s.age);
        }
    }
}

```

```
Before sort :: 
101, John, 23
102, Wick, 30
103, Santanio, 53
104, Di Antonio, 13
After sort :: 
104, Di Antonio, 13
101, John, 23
102, Wick, 30
103, Santanio, 53
```


#### Using generics for creating Comparator class

```java
import java.util.*;

class Student{
    int rollno;
    String name;
    int age;
    Student(int rollno, String name, int age){
        this.rollno = rollno;
        this.name = name;
        this.age = age;
    }
}

class NameComparator implements Comparator<Student>{
    @Override
    public int compare(Student s1, Student s2){
        return s1.name.compareTo(s2.name);
    }
}

public class Main{
    public static void main(String[] args){
        ArrayList<Student> l = new ArrayList<>();
        l.add(new Student(101, "John", 23));
        l.add(new Student(102, "Wick", 30));
        l.add(new Student(103, "Santanio", 53));
        l.add(new Student(104, "Di Antonio", 13));
        System.out.println("Before sort :: ");
        for(Student s : l){
            System.out.println(s.rollno + ", " + s.name + ", " + s.age);
        }
        Collections.sort(l, new NameCoparator());
        System.out.println("After sort :: ");
        for(Student s : l){
            System.out.println(s.rollno + ", " + s.name + ", " + s.age);
        }
    }
}

```

```
Before sort :: 
101, John, 23
102, Wick, 30
103, Santanio, 53
104, Di Antonio, 13
After sort :: 
104, Di Antonio, 13
101, John, 23
103, Santanio, 53
102, Wick, 30
```

### Java 8 Comparator Interface
- Java 8 comparator interface is a functional interface that contains only **one abstract method**.
- It provides many `static` and `default` methods to compare different types of Object elements.
- Comparator interface can be used as assignment target for a **lambda expression or method reference**.

```java
import java.util.*;

class Student{
    private int rollno;
    private String name;
    private int age;

    public int getRollno(){
        return this.rollno;
    }

    public String getName(){
        return this.name;
    }

    public int getAge(){
        return this.age;
    }

    public Student(int rollno, String name, int age){
        this.rollno = rollno;
        this.name = name;
        this.age = age;
    }
}

public class Main{
    public static void main(String[] args){
        ArrayList<Student> l = new ArrayList<>();
        int rolls[] = {101, 102, 103, 104};
        String names[] = {"John", "wick", "Adam", "Jack"};
        int ages[] = {25, 15, 10, 30};

        for(int i = 0; i < 4; i++){
            l.add(new Student(rolls[i], names[i], ages[i]));
        }

        Comparator<Student> cm1 = Comparator.comparing(Student::getName);
        Collections.sort(l, cm1);
        System.out.println("Sort by name");
        for(Student s : l){
            System.out.println(s.getRollno() + ", " + s.getName() + ", " +  s.getAge());
        }

        Comparator<Student> cm2 = Comparator.comparing(Student::getAge);
        Collections.sort(l, cm2);
        System.out.println("Sort by age");
        for(Student s : l){
            System.out.println(s.getRollno() + ", " + s.getName() + ", " +  s.getAge());
        }
    }
}

```

```
Sort by name
103, Adam, 10
104, Jack, 30
101, John, 25
102, wick, 15
Sort by age
103, Adam, 10
102, wick, 15
101, John, 25
104, Jack, 30
```