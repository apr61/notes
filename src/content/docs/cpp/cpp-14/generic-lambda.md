---
title: Generic Lambda C++ 14
date: 27/11/2026
---

Generic lambda's are also called init capture.

Init capture makes it possible to specify
1. The name of a data member in the closure generated from the lambda
2. An expression initializing that data member

Lets see an example to use init capture to move a `std::unique_ptr` into a closure

```c++
class Widget {
public:
	bool isValidated() const;
	bool isProcessed() const;
	bool isArchived() const;
};

auto pw = std::make_unique<Widget>();

// configure pw, if needed

auto func = [pw = std::move(pw)] 
		{return pw->isValidated() && pw->isArchived(); };

auto func1 = [pw = std::make_unique<Widget>()]
		{return pw->isValidated() && pw->isArchived(); };
```

The equivalent code in C++ 11, 

```c++
class IsValAndArch {
public:
	using DataType = std::unique_ptr<Widget>;

	explicit IsValAndArch(DataType&& ptr) : pw(std::move(ptr)) {}

	bool operator()() const
	{ return pw->isValidated() && pw->isArchived(); }

private:
	DataType pw;
};

auto func = IsValidAndArch(std::make_unique<Widget>());
```

The similar can be achieved by using `std::bind`

```c++
std::vector<double> data;

auto func = std::bind(
	[](const std::vector<double>& data)
	{/* Uses of data */},
	std::move(data)
	);
```

`std::bind` produces function objects. The first argument to std::bind is a callable object. Subsequent arguments represent values to be passed to that object.

A bind object contains copies of all the arguments passed to `std::bind`. For each
- lvalue argument, the corresponding object in the bind object is copy constructed
- rvalue, its move constructed

