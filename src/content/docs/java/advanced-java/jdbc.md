---
title: JDBC
date: 2/9/2024
---

JDBC stands for Java DataBase Connectivity. JDBC is a Java API that is used to connect and execute query with Database.

All JDBC interfaces and classes are stored in `java.sql.*` package.

## Types of JDBC drivers

1. JDBC-ODBC bridge driver
2. Native Driver
3. Network Protocol Driver
4. Thin driver

### JDBC-ODBC bridge driver

- Uses ODBC driver to connect to the database.
- THe JDBC-ODBC bridge driver converts JDBC method calls into ODBC function calls.
- Deprecated since Java 8.

### Native-API driver
- Partially written in Java.
- Uses client-side libraries of the database.
- Better performance than JDBC-ODBC driver.
- Native driver/Cendor client library needs to be installed on each client machine.

### Network Protocol Driver
- Fully written in Java.
- Uses middleware(Application server) that converts JDBC calls directly or indirectly into vendor specifi database protocol.
- Needs database specific coding tobe done in the middle tier.

### Thin driver
- Fully written in Java.
- Directly converts JDBC calls to vendor-specific database protocol.
- Best performance than all other drivers.
- Drivers depends on Database.

## Steps to connect to a database using JDBC
#### 1. Register the Driver class

We can register a driver using `Class.forName()`. It takes the driver class as argument.

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

#### 2. Create a connection
We can create a connection using `DriverManager.getConnection(URL, USERNAME, PASSWORD)`. It returns a connection Object. We can use this connection object further for creating Statement.

```java
Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
```

#### 3. Create a statement

We can create Statement using `createStatement()`. It returns a `Statement` object. We can use this object to execute queries.

```java
Statement statement = connection.createStatement();
```

#### 4. Create a query

```java
String query = "select * from table_name";
```

#### 5. Execute the query

- We can use the `executeQuery()` method of the `Statement` interface. 
- It returns a `ResultSet` object. This is used to iterate over the data that is returned from the database.

```java
ResultSet rs = statement.executeQuery(query);
```

#### 6. Close the connection

- The `ResultSet` will be automatically close when connection object is closed. 
- `close()` method is used to close the connection.

```java
connection.close();
```

```java
package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class Main {
    // MySql JDBC driver
    public static final String LOAD_DRIVER = "com.mysql.cj.java.Driver";

    public static final String URL = "jdbc:mysql://localhost:3306/database_name";

    public static final String USERNAME = "username";

    public static final String PASSWORD = "password";

    public static void main(String[] args) {
        // Steps to connect to MYSQL using JDBC
        try{
            // 1. Load the driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            // 2. Create Connection
            Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            // 3. Create statement
            Statement statement = connection.createStatement();
            // 4. Create Query
            String query = "select * from tableName";
            // 5. Execute query
            ResultSet rs = statement.executeQuery(query);

            while(rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String course = rs.getString("course");
                System.out.println("ID: " + id + ", name : " + name + ", course : " + course);
            }
            // 6. Close Connection
            connection.close();

            // JDBC -> Hibernate -> Spring Data JPA
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
    }
}

```

## List of JDBC API
#### 1. DriverManager interface

The Driver manager class acts as an interface between users and drivers. 

#### 2. Connection interface

- A connection is a session between a Java application and a database. 
- It helps to establish a connection with a database.
- It is a factory of `Statement`, `PreparedStatement` and `DatabaseMetaData` interfaces. 

#### 3. Statement interface
- Provides methods to execute queries with database.
- It provides object of ResultSet.

|Method|Description|
|------|-----------|
|`public ResultSet executeQuery(String sql)`|Execute **SELECT** query. Returns ResultSetObject|
|`public int executeUpdate(String sql)`|Executes **CREATE, DROP, INSERT, UPDATE, DELETE** queries|
|`public boolean execute(String sql)`|Execute queries that may return multiple results|
|`public int[] executeBatch()`|Execute bathc commands|

#### 4. PreparedStatement interface

- PreparedStatement interface is a subinterface of `Statement` interface.
- It is used to execute paramaeterized / dynamic queries.
- We will pass parameters using `?` for values.
- We have to set the parameters using setters methods like `setInt(position, value)`, like the same for each data type.

```java
int id = 101;
String sql = "select * from students where id = ?";
PreparedStatement ps = connection.prepareStatement(sql);
ps.setInt(1, id);
ResultSet res = ps.executeQuery();
```

#### 5. ResultSet Interface

- It maintains a cursor pointing to a row of a table.
- Cursor initially points to first row.
- ResultSet object can only be moved forward only and is not updatable.
- To move ResultSet object to move forward and backward direction, we have to use `ResultSet.TYPE_SCROLL_INSENSITIVE` or `ResultSet.TYPE_SCROLL_SENSITIVE`.
- To make the ResultSet object updatable wen have to use `ResultSet.CONCUR_UPDATABLE` in `createConnection(int, int)` object.

```java
Statement st = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
```

## CRUD example that uses above JDBC API's

```java

// POJO class
// Truck.java

package org.example;

public class Truck {
    private int id;
    private String name;
    private String model;
    private int capacity;
    private String driverName;

    public Truck() {
    }

    public Truck(String name, String model, int capacity, String driverName) {
        this.name = name;
        this.model = model;
        this.capacity = capacity;
        this.driverName = driverName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    @Override
    public String toString() {
        return "Truck{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", model='" + model + '\'' +
                ", capacity=" + capacity +
                ", driverName='" + driverName + '\'' +
                '}';
    }
}


```

```java
// ConnectionDetails.java

package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionDetails {

    public static final String LOAD_DRIVER = "com.mysql.cj.jdbc.Driver";

    public static final String URL = "jdbc:mysql://localhost:3306/truck_management";

    public static final String USERNAME = "root";

    public static final String PASSWORD = "rootroot";

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName(LOAD_DRIVER);
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}

```

```java
// TruckService.java

package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TruckService {

    public int addTruck(Truck truck){
        String query = "insert into truck (name, model, capacity, driver_name) values (?, ?, ?, ?)";
        int res = 0;
        try{
            Connection connection = ConnectionDetails.getConnection();
            PreparedStatement ps = connection.prepareStatement(query);

            ps.setString(1, truck.getName());
            ps.setString(2, truck.getModel());
            ps.setInt(3, truck.getCapacity());
            ps.setString(4, truck.getDriverName());

            res = ps.executeUpdate();
            connection.close();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return res;
    }

    public Truck getTruckById(int id){
        Truck t = new Truck();
        String query = "select * from truck where id = ?";
        try {
            Connection connection = ConnectionDetails.getConnection();
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);

            ResultSet rs =  ps.executeQuery();

            while(rs.next()){
                t.setId(rs.getInt("id"));
                t.setName(rs.getString("name"));
                t.setModel(rs.getString("model"));
                t.setCapacity(rs.getInt("capacity"));
                t.setDriverName(rs.getString("driver_name"));
            }
            connection.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return t;
    }

    public List<Truck> getAllTrucks(){
        String query = "select * from truck";
        List<Truck> trucks = new ArrayList<>();
        try {
            Connection connection = ConnectionDetails.getConnection();
            Statement st = connection.createStatement();

            ResultSet rs = st.executeQuery(query);

            while(rs.next()){
                Truck t = new Truck();
                t.setId(rs.getInt("id"));
                t.setName(rs.getString("name"));
                t.setModel(rs.getString("model"));
                t.setCapacity(rs.getInt("capacity"));
                t.setDriverName(rs.getString("driver_name"));
                trucks.add(t);
            }
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return trucks;
    }

    public int deleteTruck(int id){
        int res = 0;
        String query = "delete from truck where id = ?";
        try{
            Connection connection = ConnectionDetails.getConnection();
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);

            res = ps.executeUpdate();
            connection.close();
        } catch (Exception e){
            e.printStackTrace();
        }
        return res;
    }

    public int updateTruck(Truck truck, int id){
        String query = "update truck set name = ?, model = ?, capacity = ?, driver_name = ? where id = ?";
        int res = 0;
        try{
            Connection connection = ConnectionDetails.getConnection();
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setString(1, truck.getName());
            ps.setString(2, truck.getModel());
            ps.setInt(3, truck.getCapacity());
            ps.setString(4, truck.getDriverName());
            ps.setInt(5, id);

            res = ps.executeUpdate();
            connection.close();
        } catch (Exception e){
            e.printStackTrace();
        }
        return res;
    }
}


```

```java
//Main.java

package org.example;

import java.util.List;
import java.util.Scanner;

import static java.lang.System.exit;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        TruckService truckService = new TruckService();
        int res;
        while(true) {
            System.out.println("Truck Management System");
            System.out.println("1. Add new truck");
            System.out.println("2. Update a truck");
            System.out.println("3. Delete a truck");
            System.out.println("4. Get all trucks");
            System.out.println("5. Get a truck by Id");
            System.out.println("0. Exit");
            System.out.println("Enter you choice :: ");
            int choice = sc.nextInt();
            switch (choice) {
                case 1: {
                    sc.nextLine();
                    System.out.println("Enter truck name :: ");
                    String name = sc.nextLine();
                    System.out.println("Enter truck model :: ");
                    String model = sc.nextLine();
                    System.out.println("Enter truck capacity :: ");
                    int capacity = sc.nextInt();
                    sc.nextLine();
                    System.out.println("Enter truck driver name :: ");
                    String driverName = sc.nextLine();
                    Truck t = new Truck(name, model, capacity, driverName);
                    res = truckService.addTruck(t);
                    if (res == 1) {
                        System.out.println("Truck details added successfully....");
                    } else {
                        System.out.println("Unable to add new truck details...");
                    }
                    break;
                }
                case 2: {
                    System.out.println("Enter truck id :: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    System.out.println("Enter truck name :: ");
                    String name = sc.nextLine();
                    System.out.println("Enter truck model :: ");
                    String model = sc.nextLine();
                    System.out.println("Enter truck capacity :: ");
                    int capacity = sc.nextInt();
                    sc.nextLine();
                    System.out.println("Enter truck driver name :: ");
                    String driverName = sc.nextLine();
                    Truck t = new Truck(name, model, capacity, driverName);
                    res = truckService.updateTruck(t, id);
                    if (res == 1) {
                        System.out.println("Truck details added successfully....");
                    } else {
                        System.out.println("There is no truck record with id :: " + id + " to update..");
                    }
                    break;
                }
                case 3: {
                    System.out.println("Enter truck id to delete :: ");
                    int id = sc.nextInt();
                    res = truckService.deleteTruck(id);
                    if(res != 0){
                        System.out.println("Truck deleted successfully....");
                    } else {
                        System.out.println("No truck found with given id to delete...");
                    }
                    break;
                }
                case 4: {
                    List<Truck> list = truckService.getAllTrucks();
                    if(list.isEmpty()){
                        System.out.println("Truck table is empty...");
                    } else {
                        for (Truck t : list) {
                            System.out.println(t.toString());
                        }
                    }
                    break;
                }
                case 5: {
                    System.out.println("Enter truck id to fetch :: ");
                    int id = sc.nextInt();
                    Truck t = truckService.getTruckById(id);
                    System.out.println(t.toString());
                    break;
                }
                case 0:
                    System.out.println("Exiting program...");
                    sc.close();
                    exit(0);
                    break;
                default:
                    System.out.println("Invalid option...\nPlease enter a valid choice from menu...");
                    break;
            }
        }
    }
}
```