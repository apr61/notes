---
title: Dbus QA
date: 09/03/2025
---


# 📚 GDBus Concepts – Q&A Summary

---

## 1. Can I have multiple Objects in a single service?

✅ **Yes**

A single D-Bus service (bus name) can expose **multiple objects**, each with a unique object path, like:

- `/org/example/Object1`
- `/org/example/Object2`

Each object can have its own set of interfaces and methods.

You register each object separately using `g_dbus_connection_register_object()`.

---

## 2. Can I have multiple Interfaces in a single object?

✅ **Yes**

A single object can implement multiple interfaces. For example:

```xml
<node>
  <interface name='org.example.InterfaceOne'>...</interface>
  <interface name='org.example.InterfaceTwo'>...</interface>
</node>
```

This allows one object path to support various capabilities grouped by interface.

The client can invoke methods from any of the interfaces.

---

## 3. Why are we using XML for interface creation? Is there any other option?

🛠️ **Reason:**
GLib uses **D-Bus Introspection XML** to describe:
- Interface name
- Methods
- Arguments
- Signals
- Properties

✅ It’s the cleanest, easiest way to define interfaces.

🔁 **Alternatives:**
- You **can manually define** the `GDBusInterfaceInfo` struct yourself.
- You can use **`gdbus-codegen`** to generate C code from XML.

---

## 4. Why `introspection_data->interfaces[0]`? Why not other index?

Because the XML only defined **one interface**, so only `interfaces[0]` is valid.

If you define multiple interfaces, they are accessible like this:
- `interfaces[0]` → first interface
- `interfaces[1]` → second interface
- etc.

```c
introspection_data->interfaces[0]; // org.example.InterfaceOne
introspection_data->interfaces[1]; // org.example.InterfaceTwo
```

---

## 5. What is the use of `gpointer user_data` in `handle_method_call()`?

It's a **custom data pointer** passed during object registration:

```c
g_dbus_connection_register_object(
    connection,
    "/some/path",
    iface_info,
    &vtable,
    my_data, // <-- This becomes user_data
    NULL, NULL);
```

You can use it to:
- Pass app context
- Share state
- Store config, struct pointers, etc.

Inside `handle_method_call()` you get access to it:

```c
static void handle_method_call(..., gpointer user_data) {
    MyAppData *data = (MyAppData *)user_data;
    // use your context here
}
```

---

## 6. Example: Multiple Interfaces on One Object

### Interface XML:

```xml
<node>
  <interface name='org.example.InterfaceOne'>
    <method name='SayHi'>
      <arg type='s' name='response' direction='out'/>
    </method>
  </interface>
  <interface name='org.example.InterfaceTwo'>
    <method name='SayBye'>
      <arg type='s' name='response' direction='out'/>
    </method>
  </interface>
</node>
```

### Registration:

```c
g_dbus_connection_register_object(connection, "/org/example/myObject",
                                  introspection_data->interfaces[0], &vtable, NULL, NULL, NULL);
g_dbus_connection_register_object(connection, "/org/example/myObject",
                                  introspection_data->interfaces[1], &vtable, NULL, NULL, NULL);
```

### Method Handler:

```c
static void handle_method_call(..., const gchar *interface_name, ...) {
    if (g_strcmp0(interface_name, "org.example.InterfaceOne") == 0) {
        // Handle SayHi
    } else if (g_strcmp0(interface_name, "org.example.InterfaceTwo") == 0) {
        // Handle SayBye
    }
}
```

---