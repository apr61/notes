---
title: SOLID Principles
date: 23/08/2026
---

The SOLID principles are five essential guidelines that enhance software guidelines which makes software more maintainable and scalable.

- SOLID principles help in enhancing loose coupling. Loose coupling means a group classes which are less dependent on each other.

### SOLID principles

S - Single Responsiblity Principle

O - Open Closed Principle

L - Liskov Substitution Principle

I - Interface Segregation Principle

D - Dependency Inversion Principle


### Single Responsiblity Principle (SRP)

This principle states that a "Class should only have one reason to change" which means every class should have a single responsiblity or single purpose or single job.

> Example: Imagine a baker who is reponsible for baking bread. The baker's role to make bake bread, ensure the bread is of high quality and properly baked.

- If the baker handles inventory, ordering, customer service and cleaning along with baking bread, it violates the SRP principle.


```cpp

#include <iostream>
#include <string>

class BreadBaker{
public:
    void bakeBread()
    {
        std::cout << "Baking bread..." << std::endl;
    }
};

class InventoryManager{
public:
    void manageInventory()
    {
        std::cout << "Manage inventory..." << std::endl;
    }
};


class CustomerService{
public:
    void customerService()
    {
        std::cout << "Customer service...." << std::endl;
    }
};


int main()
{
    BreadBaker breadBaker;
    InventoryManager inventoryManager;
    CustomerService customerService;

    breadBaker.bakeBread();
    inventoryManager.manageInventory();
    customerService.customerService();

    return 0;
}

```

### Open Closed Principle (OCP)

This principle states that "Software entities (Class, Function, etc..) should be open to extensions but closed to modifications" which means we should be able to extend a class behavior without modifying it.

> Example: Imagine you have a PaymentProcessor that process payments for an online store. Intially you are accepting payments only via CreditCards, but later you can extend the functionality to also support processing payments via UPI.


```c++

#include <iostream>

class PaymentProcessor{
public:
    virtual void processPayment(double amount) = 0; // Pure virtual function
};

class CreditCardPayment: public PaymentProcessor
{
public:
    void processPayment(double amount)
    {
        std::cout << "Process payment via Credit Card of Rupees " << amount << std::endl; 
    }
};


// We an extend the functionality by adding UPI Payment

class UPIPayment : public PaymentProcessor
{
public:
    void processPayment(double amount)
    {
        std::cout << "Process payment via UPI of Rupees " << amount << std::endl; 
    }
};

void processPayment(PaymentProcessor & processor, double amount)
{
    processor.processPayment(amount);
}

int main()
{
    CreditCardPayment creditCard;
    UPIPayment upiPayment;

    processPayment(creditCard, 1000.00);
    processPayment(upiPayment, 200.00);

    return 0;
}

```


### Liskov's Substitution Principle (LSP)

This principle was introduced in 1987 by Barbara Liskov. This states that "derived or child classes must be able to replace their base or parent classes". This ensures that any child class can be used in place of parent class without causing unexpected behavior in program.


```c++
#include <iostream>

// Base class for shapes
class Rectangle {
protected:
    double width;
    double height;

public:
    virtual double area() const {
        return width * height;
    }

    double getWidth() const {
        return width;
    }

    double getHeight() const {
        return height;
    }

    virtual void setWidth(double w) {   // made virtual
        width = w;
    }

    virtual void setHeight(double h) {  // also virtual (good practice)
        height = h;
    }
};

// Derived class for squares
class Square : public Rectangle {
public:
    void setWidth(double w) override {
        width = height = w;
    }

    void setHeight(double h) override {
        width = height = h;
    }
};

void calculate(Rectangle & r)
{
    r.setHeight(5);
    r.setWidth(10);

    std::cout << "Area: " << s.area() << std::endl;
}

int main() {
    Square s;
    Rectangle r;

    calculate(r);
    calculate(s);  // Here, Area is 100, but expected Area is 50.
    
    return 0;
}
```
Here, `Square` cannot properly substitute `Rectangle`.

To resolve this we can create a `Shape` Interface and be inherited in `Square` and `Rectangle`.

```c++

#include <iostream>

class Shape{
public:
    virtual double area() = 0;
    virtual ~Shape() = default;
};

class Rectangle: public Shape{
private:
    double length;
    double width;

public:
    Rectangle(double width, double length): width(width), length(length){}

    double area() override
    {
        return length * width;
    }
};

class Square: public Shape{
private:
    double side;

public:
    Square(double side): side(side){}

    double area() override
    {
        return side * side;
    }
};


void calculate(Shape & s)
{
    std::cout << "Area :: " << s.area() << std::endl;
}

int main()
{
    Square s(10);

    Rectangle r(10, 20);

    calculate(s);
    calculate(r);
}
```

### Interface Segregation Principle (ISP)

This principle is similar to SRP and applies to interfaces. It states that "A class should not be forced to depend on methods it doesn't need."

```c++

#include <iostream>

class Machine{
public:
    virtual void print() = 0;
    virtual void fax() = 0;
    virtual void scan() = 0;
};

// Let's take a SimplePrinter class

class SimplePrinter : public Machine{
public:
    void print() override{
        std::cout << "Printing..." << std::endl;
    }

    void fax() override{
        // Doesn't support
    }

    void scan() override{
        // Doesn't support
    }
};
```

The above implementation is bad. Because `SimplePrinter` is forced to implement `fax()` and `scan()`, even though it doesn't support.


A better design should be to split the interfaces.

```c++
#include <iostream>

class Printer
{
public:
    virtual void print() = 0;
    virtual ~Printer() = default;
};

class Scanner
{
public:
    virtual void scan() = 0;
    virtual ~Scanner() = default;
};

class Fax
{
public:
    virtual void fax() = 0;
    virtual ~Fax() = default;
};


// A simple printer
class SimplePrinter : public Printer
{
public:
    void print() override
    {
        std::cout << "Printing\n";
    }
};


// A Multifunction printer
class MultiFunctionPrinter
    : public Printer,
      public Scanner,
      public Fax
{
public:
    void print() override
    {
        std::cout << "Printing\n";
    }

    void scan() override
    {
        std::cout << "Scanning\n";
    }

    void fax() override
    {
        std::cout << "Faxing\n";
    }
};

```

***

### Dependency Inversion Principle (DIP)

This principle states that "High level modules should not depend directly on low level modules. Both should depend on abstraction."

DIP explained with the example of a Database Connection.

```c++
#include <iostream>
#include <string>

class MySQLConnector {
public:
  void connect();
  void query(const std::string& query);
};

class Database {
public:
  void addUser(const std::string& name, const std::string& email) {
    MySQLConnector connector;
    connector.connect();
    std::string query = "INSERT INTO users (name, email) VALUES ('" + name + "', '" + email + "')";
    connector.query(query);
  }
};
```

The above example violates the DIP, because `Database` depends on low-level `MySQLConnector` class. If we were to switch to a different database, then we would need to modify `Database` class.

To adhare to DIP, we can create a abstract interface for the database connector and have `Database` class depend on interface instead of concreate implementation.


```c++
#include <iostream>
#include <string>

class IDatabaseConnector{
public:
    virtual void connect() = 0;
    virtual void query(const std::string & query) = 0;
};

class MySQLConnector : public IDatabaseConnector {
public:
  void connect() override;
  void query(const std::string& query) override;
};

class Database {
private:
    IDatabaseConnector & m_databaseConnector;    

public:
    Database(IDatabaseConnector & databaseConnector) : m_databaseConnector(databaseConnector){}

  void addUser(const std::string& name, const std::string& email) {
    m_databaseConnector.connect();
    std::string query = "INSERT INTO users (name, email) VALUES ('" + name + "', '" + email + "')";
    m_databaseConnector.query(query);
  }
};

int main()
{
    MySQLConnector mysqlConnector;
    Database db(mysqlConnector);

    db.addUser("John Doe", "john.doe@example.com");
}

```

Now, the `Database` class depends on abstract interface `IDatabaseConnector` rather than concreate class `MySQLConnector`.

Later if we want to use a different database connector we can simply swap the connector.

```c++

class PostgressSQLConnector: public IDatabaseConnector {
public:
    void connect() override;
    void query(const std::string& query) override;
};

int main()
{
    PostgressSQLConnector postgressConnector;
    Database db(postgressConnector);

    db.addUser("John Doe", "john.doe@example.com");
}

```

### Diff b/w OCP and DIP

While both OCP and DIP aim to reduce coupling and increase flexibility, they address different aspects of design:

**Open Closed Principle** : OCP focuses on behavioral extension. It dictates that existing code should not be modified when new functionality is added. Instead we should extend it's behavior by creating new classes that implement an interface or extend an abstract class.

**Dependency Inversion Principle** : DIP focuses on dependency direction and abstraction. Both high-level and low-level modules should depend on abstractions (interfaces or abstract classes). DIP is an key enabler of OCP.